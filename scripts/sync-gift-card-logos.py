"""Import the public logo images associated with the audited India gift-card listings."""
import concurrent.futures, hashlib, html, json, re, sys, urllib.error, urllib.parse, urllib.request, http.cookiejar
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'src/lib/data/gift-card-catalogue.json'
AUDIT = ROOT / 'docs/gift-card-reference-audit.json'
MAP = ROOT / '.tmp/gift-card-logo-sources.json'

def sources():
    catalogue = json.loads(SOURCE.read_text(encoding='utf-8'))
    audit = json.loads(AUDIT.read_text(encoding='utf-8'))
    jar = http.cookiejar.CookieJar()
    client = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    try:
        client.open('https://giftcardxpert.com/site/set-country?setcountry=IN', timeout=30).read()
    except urllib.error.HTTPError as error:
        if error.code != 302: raise

    expected = {item['sourceId']: item['name'] for item in catalogue['listings']}
    def read_page(page):
        url = page['url']
        if not url.startswith('https://giftcardxpert.com/site/gifts?'): raise ValueError('Unexpected catalogue URL')
        body = client.open(url, timeout=30).read().decode('utf-8-sig')
        entries = re.split(r'<li\s+class="item"\s+data-key="(\d+)">', body)
        rows = []
        for index in range(1, len(entries), 2):
            key, content = entries[index], entries[index+1]
            name_match = re.search(r'<a\s+class="item-list-title"[^>]*>(.*?)</a>', content, re.S)
            image_match = re.search(r'<img[^>]*src="([^"]+)"', content)
            if not name_match: continue
            if not image_match:
                figure = re.search(r'<figure>(.*?)</figure>', content, re.S)
                print('Missing image markup', key, figure[1] if figure else 'No figure', flush=True)
                continue
            name = html.unescape(re.sub('<[^>]+>', '', name_match[1])).strip()
            if expected.get(key) != name: raise ValueError(f'Listing changed: {key} {name}')
            rows.append((key, html.unescape(image_match[1])))
        return rows

    result = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for rows in pool.map(read_page, audit['pages']): result.update(rows)
    overrides = json.loads((ROOT / 'docs/gift-card-logo-overrides.json').read_text(encoding='utf-8'))
    for key, override in overrides.items():
        if expected.get(key) != override['name']: raise ValueError('Logo override does not match listing')
        result[key] = override['url']
    MAP.parent.mkdir(parents=True, exist_ok=True)
    MAP.write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'listings': len(result), 'distinctUrls': len(set(result.values())), 'hosts': sorted({urllib.parse.urlparse(url).hostname for url in result.values()})}), flush=True)
    if set(result) != set(expected): raise ValueError('Missing logo sources: ' + json.dumps({key:name for key,name in expected.items() if key not in result}))

def download():
    from PIL import Image
    import io
    catalogue = json.loads(SOURCE.read_text(encoding='utf-8'))
    mapping = json.loads(MAP.read_text(encoding='utf-8'))
    target = ROOT / 'static/gift-card-logos'
    target.mkdir(parents=True, exist_ok=True)
    def fetch(url):
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme != 'https' or parsed.hostname not in {'cdn2.gyftr.com', 'cdn.gyftr.com', 'giftbig.s3.amazonaws.com', 'innovist.com'}: raise ValueError('Unverified logo host: ' + url)
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = response.read(2_000_001)
        if len(payload) > 2_000_000: raise ValueError('Oversized logo')
        with Image.open(io.BytesIO(payload)) as image:
            fmt = image.format
            width, height = image.size
            image.load()
            rgba = image.convert('RGBA')
            visible = [pixel for pixel in rgba.getdata() if pixel[3] > 32] if rgba.getchannel('A').getextrema()[0] < 255 else []
            dark = bool(visible) and sum((pixel[0] * .2126 + pixel[1] * .7152 + pixel[2] * .0722) for pixel in visible) / len(visible) > 220
        extension = {'PNG': 'png', 'JPEG': 'jpg', 'WEBP': 'webp', 'GIF': 'gif'}.get(fmt)
        if not extension or not (0 < width <= 8000 and 0 < height <= 8000): raise ValueError('Unsupported logo image')
        digest = hashlib.sha256(payload).hexdigest()[:16]
        filename = digest + '.' + extension
        (target / filename).write_bytes(payload)
        return {'src': '/gift-card-logos/' + filename, 'width': width, 'height': height, 'dark': dark}

    results, errors = {}, {}
    urls = sorted(set(mapping.values()))
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        futures = {pool.submit(fetch, url): url for url in urls}
        for number, future in enumerate(concurrent.futures.as_completed(futures), 1):
            url = futures[future]
            try: results[url] = future.result()
            except Exception as error: errors[url] = str(error)
            if number % 50 == 0: print(f'Checked {number}/{len(urls)} logo images', flush=True)
    if errors:
        (ROOT / '.tmp/gift-card-logo-errors.json').write_text(json.dumps(errors, indent=2), encoding='utf-8')
        print(json.dumps({'downloaded': len(results), 'failed': errors}), flush=True)
        return
    for listing in catalogue['listings']:
        url = mapping[listing['sourceId']]
        listing['logoSource'] = url
        listing['logo'] = results[url]
    SOURCE.write_text(json.dumps(catalogue, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'listingsWithLogos': len(catalogue['listings']), 'uniqueImages': len({image['src'] for image in results.values()})}), flush=True)

if __name__ == '__main__':
    if '--download' in sys.argv: download()
    else: sources()
