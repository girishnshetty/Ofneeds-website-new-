// Bounded, process-local protection. A scaled deployment should use a shared durable limiter/store.
type Success = { success: true; leadId: string; message: string };
type Entry = { expires: number; fingerprint: string; result?: Success; pending?: Promise<Success> };
export class SubmissionGuard {
	private entries = new Map<string, Entry>();
	private attempts = new Map<string, { count: number; expires: number }>();
	constructor(private now: () => number = Date.now) {}
	private prune() {
		for (const [key, value] of this.entries) if (value.expires <= this.now()) this.entries.delete(key);
		for (const [key, value] of this.attempts) if (value.expires <= this.now()) this.attempts.delete(key);
		while (this.entries.size >= 2000) this.entries.delete(this.entries.keys().next().value!);
		while (this.attempts.size >= 2000) this.attempts.delete(this.attempts.keys().next().value!);
	}
	allow(client: string) {
		this.prune();
		const entry = this.attempts.get(client) ?? { count: 0, expires: this.now() + 600000 };
		entry.count++; this.attempts.set(client, entry);
		return entry.count <= 12;
	}
	async run(key: string, fingerprint: string, send: () => Promise<Success>) {
		this.prune();
		const existing = this.entries.get(key);
		if (existing && existing.fingerprint !== fingerprint) throw new Error('KEY_REUSED');
		if (existing?.result) return existing.result;
		if (existing?.pending) return existing.pending;
		const entry: Entry = { expires: this.now() + 1800000, fingerprint };
		const pending = send().then((result) => { entry.result = result; entry.pending = undefined; return result; }).catch((error) => { this.entries.delete(key); throw error; });
		entry.pending = pending; this.entries.set(key, entry);
		return pending;
	}
}
export const submissions = new SubmissionGuard();
export async function limitedFormData(request: Request, limit = 32768) {
	if (Number(request.headers.get('content-length') || 0) > limit) throw new Error('BODY_LIMIT');
	const reader = request.body?.getReader();
	const chunks: Uint8Array[] = []; let size = 0;
	if (reader) try {
		while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > limit) { await reader.cancel(); throw new Error('BODY_LIMIT'); } chunks.push(value); }
	} finally { reader.releaseLock(); }
	const bytes = new Uint8Array(size); let offset = 0;
	for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
	return new Response(bytes, { headers: { 'Content-Type': request.headers.get('content-type') || '' } }).formData();
}
