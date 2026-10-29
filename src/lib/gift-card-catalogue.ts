import source from './data/gift-card-catalogue.json';

export const giftCategories = ['All', 'Shopping', 'Fashion', 'Food & dining', 'Travel', 'Health & beauty', 'Entertainment', 'Jewellery', 'Home & electronics', 'Services & gifting'] as const;
export type GiftCategory = typeof giftCategories[number];
export type GiftLogo = { src: string; width: number; height: number; dark?: boolean };
export type GiftOption = { id: string; name: string; category: string; denominations: number[]; colour: string; listing: number; copies: number; logo?: GiftLogo };
const colours: Record<string, string> = { Shopping: '#224b46', Fashion: '#554663', 'Food & dining': '#8c4b35', Travel: '#315d86', 'Health & beauty': '#687047', Entertainment: '#483d72', Jewellery: '#826135', 'Home & electronics': '#3f616d', 'Services & gifting': '#6c5160' };
// OfNeeds browsing groups; source brand names and face values are retained verbatim.
function group(name: string): string {
	if (/jewell|diamond|gold|silver|tanishq|bluestone|palmonas|^giva$|^mia$|este[l]?e/i.test(name)) return 'Jewellery';
	if (/bill payment|recharge|fastag|bpcl|hp pay|cleartax|smile foundation|points for good|ferns|flower|archies|^igp$|hoora/i.test(name)) return 'Services & gifting';
	if (/travel|yatra|ixigo|intermiles|cleartrip|klook|fab hotels|itc hotels|taj experiences|makemytrip|zoomcar|ola cabs|uber|lohono|elivaas|cordelia|air india|adani|adventra|^matrix$/i.test(name)) return 'Travel';
	if (/zee5|discovery|gaana|hindustan|jiohotstar|ottplay|valorant|vrott|cinepolis|et prime|mint|braingym|shemaroo|yalla|bookmyshow|docubay|xbox|hoichoi|tinder|unipin|discord|ea sports|exitlag|pvr|reader|moba|nintendo|sonyliv|timezone/i.test(name)) return 'Entertainment';
	if (/eat|faasos|lunch box|oven story|starbucks|sweet truth|good bowl|barbeque|baskin|wendy|wow!|zomato|cafe|costa|domino|^kfc$|subway|machaan|mainland|minus30|oh! calcutta|pizza|sigree|sweet bengal|swiggy|^tgif$|bakingo|beer cafe|behrouz|shiva organic/i.test(name)) return 'Food & dining';
	if (/foxtale|inglot|innovist|beauty|mamaearth|mediwheel|nat habit|tattva|apollo|auric|botanicals|shaving|health|wellness|spa|himalaya|fitpass|netmeds|kama|kiehl|soulflower|organic india|luzo|^simple$|skinn|body shop|man company|truefitt|victoria.*beauty|frido/i.test(name)) return 'Health & beauty';
	if (/wonderchef|daily objects|elver|future world|ikea|^pigeon$|reliance digital|my jio|blaupunkt|duroflex|^hammer$|pure home|home centre|sleep company|urban space|croma|^prestige$|skullcandy|vijay sales|aliste|^cello$/i.test(name)) return 'Home & electronics';
	if (/veromoda|^w$|wildcraft|william penn|woodland|charles|colorplus|fashion|fastrack|forever21|louis philippe|lenskart|marks.*spencer|park avenue|^parx$|peter england|planet fashion|^r&b$|rangriti|raymond|samsonite|simon carter|^soch$|tego|titan|aurelia|van heusen|victoria|^bata$|beyoung|woggles|tasva|kalki|nautica|blissclub|femmella|ajio|decathlon|french accent|fabindia|haute|instafab|liberty|freecultr|manyavar|hidesign|speedo|ssunsu|hush puppies|jack.*jones|jockey|levis|mango|^next$|luxe|style baazar|^max$|columbia|zouk|^only$|snitch|pantaloons|puma|relaxo|trends|skechers|v mart|helios|lifestyle|shoppers stop|aldo|allen solly|american|assembly|beverly|^biba$|call it spring|campus|cahoot/i.test(name)) return 'Fashion';
	return 'Shopping';
}
const occurrences = new Map<string, number>();
const nameKey = (name: string) => name.toLocaleLowerCase('en-IN');
export const giftCatalogue: GiftOption[] = source.listings.map(item => {
	const key = nameKey(item.name);
	const listing = (occurrences.get(key) ?? 0) + 1;
	occurrences.set(key, listing);
	const category = group(item.name);
	return { id: 'gift-' + item.sourceId, name: item.name, category, denominations: item.denominations, colour: colours[category], listing, copies: source.listings.filter(other => nameKey(other.name) === key).length, logo: item.logo };
});
export const giftCatalogueMeta = { source: source.source, checked: source.checked, country: source.country, count: giftCatalogue.length, distinctNames: new Set(giftCatalogue.map(option => nameKey(option.name))).size };
export type GiftSort = 'az' | 'za' | 'low' | 'high';
export function browseGiftCards(search: string, category: string, sort: GiftSort = 'az'): GiftOption[] {
	const query = search.trim().toLocaleLowerCase('en-IN');
	return giftCatalogue.filter(option => (category === 'All' || category === option.category) && `${option.name} ${option.category}`.toLocaleLowerCase('en-IN').includes(query)).sort((a, b) => {
		const alphabetical = a.name.localeCompare(b.name, 'en-IN') || a.id.localeCompare(b.id);
		if (sort === 'za') return -alphabetical;
		if (sort === 'low' || sort === 'high') return (Math.min(...a.denominations) - Math.min(...b.denominations)) * (sort === 'low' ? 1 : -1) || alphabetical;
		return alphabetical;
	});
}
