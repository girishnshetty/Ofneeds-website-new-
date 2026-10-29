export type RequestStatus = 'draft' | 'pending' | 'changes_requested' | 'approved';
export const statusLabels: Record<RequestStatus, string> = {
 draft: 'Draft', pending: 'Awaiting review', changes_requested: 'Changes requested', approved: 'Approved locally'
};
export const fulfilmentStages = ['Not started', 'Sourcing', 'Artwork review', 'Production', 'Dispatched', 'Delivered'] as const;
export type RequestLine = { id: string; name: string; quantity: number; estimate: number | null };
export type RequestInput = { title: string; department: string; reviewer: string; locations: string; neededBy: string; notes: string; lines: RequestLine[] };
export type PurchaseRequest = RequestInput & {
 id: string; status: RequestStatus; stage: number; createdAt: string; updatedAt: string;
 history: { at: string; action: string; note: string }[]; sample?: boolean;
};
export type Workspace = { version: 1; budget: number; requests: PurchaseRequest[] };
export const emptyWorkspace = (): Workspace => ({ version: 1, budget: 100000, requests: [] });
export function requestTotal(request: Pick<RequestInput, 'lines'>) {
 return Math.round(request.lines.reduce((sum, line) => sum + line.quantity * (line.estimate ?? 0), 0) * 100) / 100;
}
export const hasEstimates = (request: Pick<RequestInput, 'lines'>) => request.lines.length > 0 && request.lines.every(line => line.estimate !== null);
export const approvedTotal = (workspace: Workspace, except = '') => workspace.requests.filter(r => r.id !== except && r.status === 'approved').reduce((sum, r) => sum + requestTotal(r), 0);
export function validateInput(input: RequestInput) {
 const errors: string[] = [];
 for (const [field, label, max] of [['title', 'Request title', 120], ['department', 'Department', 80], ['reviewer', 'Reviewer', 100], ['locations', 'Delivery locations', 500]] as const) {
  if (typeof input[field] !== 'string' || !input[field].trim() || input[field].length > max) errors.push(`${label} is required (up to ${max} characters).`);
 }
 if (typeof input.notes !== 'string' || input.notes.length > 2000) errors.push('Keep notes within 2,000 characters.');
 if (!Array.isArray(input.lines) || input.lines.length < 1 || input.lines.length > 30) errors.push('Add between 1 and 30 product lines.');
 else for (const line of input.lines) {
  if (!line || typeof line.id !== 'string' || line.id.length > 100 || typeof line.name !== 'string' || !line.name.trim() || line.name.length > 150 || !Number.isSafeInteger(line.quantity) || line.quantity < 1 || line.quantity > 1000000 || (line.estimate !== null && (!Number.isFinite(line.estimate) || line.estimate < 0 || line.estimate > 10000000))) {
   errors.push('Each line needs a name, a whole quantity from 1 to 1,000,000 and a valid estimate.'); break;
  }
 }
 if (typeof input.neededBy !== 'string') errors.push('Enter a valid delivery date.');
 else if (input.neededBy) {
  const date = new Date(input.neededBy + 'T00:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.neededBy) || Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== input.neededBy) errors.push('Enter a valid delivery date.');
 }
 return errors;
}
export function saveRequest(workspace: Workspace, input: RequestInput, id: string, submit: boolean, at = new Date().toISOString()): Workspace {
 const errors = validateInput(input);
 if (errors.length) throw new Error(errors.join(' '));
 const prior = workspace.requests.find(r => r.id === id);
 if (prior && !['draft', 'changes_requested'].includes(prior.status)) throw new Error('Only drafts or requests needing changes can be edited.');
 if (!prior && workspace.requests.length >= 200) throw new Error('This browser workspace supports up to 200 requests. Export your records before starting a new workspace.');
 const clean = { ...input, title: input.title.trim(), department: input.department.trim(), reviewer: input.reviewer.trim(), locations: input.locations.trim(), lines: input.lines.map(line => ({ ...line, name: line.name.trim() })) };
 const request: PurchaseRequest = {
  ...clean, id, status: submit ? 'pending' : 'draft', stage: 0, createdAt: prior?.createdAt || at, updatedAt: at,
  history: [...(prior?.history || []), { at, action: submit ? 'Submitted for local review' : 'Draft saved', note: '' }], ...(prior?.sample ? { sample: true } : {})
 };
 return { ...workspace, requests: prior ? workspace.requests.map(r => r.id === id ? request : r) : [request, ...workspace.requests] };
}
export function reviewRequest(workspace: Workspace, id: string, decision: 'approve' | 'changes', note: string, at = new Date().toISOString()): Workspace {
 const request = workspace.requests.find(r => r.id === id);
 if (!request || request.status !== 'pending') throw new Error('This request is not awaiting review.');
 if (note.length > 1000) throw new Error('Keep the review note within 1,000 characters.');
 if (decision === 'changes' && !note.trim()) throw new Error('Add a note explaining the changes needed.');
 if (decision === 'approve') {
  if (!hasEstimates(request)) throw new Error('Add an estimate for every item before recording approval.');
  if (approvedTotal(workspace, id) + requestTotal(request) > workspace.budget) throw new Error('This request exceeds the remaining planning budget. Request changes or adjust the budget first.');
 }
 return { ...workspace, requests: workspace.requests.map(r => r.id === id ? { ...r, status: decision === 'approve' ? 'approved' : 'changes_requested', updatedAt: at, history: [...r.history, { at, action: decision === 'approve' ? 'Approval recorded locally' : 'Changes requested', note: note.trim() }] } : r) };
}
export function advanceFulfilment(workspace: Workspace, id: string, note: string, at = new Date().toISOString()): Workspace {
 const request = workspace.requests.find(r => r.id === id);
 if (!request || request.status !== 'approved' || request.stage >= fulfilmentStages.length - 1) throw new Error('Only an approved request with an unfinished progress record can be advanced.');
 if (!note.trim() || note.length > 1000) throw new Error('Add a confirmation or reference for this manual update (up to 1,000 characters).');
 return { ...workspace, requests: workspace.requests.map(r => r.id === id ? { ...r, stage: r.stage + 1, updatedAt: at, history: [...r.history, { at, action: `Manually recorded: ${fulfilmentStages[r.stage + 1]}`, note: note.trim() }] } : r) };
}
export function restoreWorkspace(raw: string): Workspace {
 if (raw.length > 2000000) throw new Error('Stored workspace is too large.');
 const data = JSON.parse(raw) as Workspace;
 if (!data || data.version !== 1 || !Number.isFinite(data.budget) || data.budget < 0 || data.budget > 1000000000 || !Array.isArray(data.requests) || data.requests.length > 200) throw new Error('Stored workspace is invalid.');
 const ids = new Set<string>();
 for (const request of data.requests) {
  if (!request || typeof request.id !== 'string' || request.id.length > 100 || ids.has(request.id) || validateInput(request).length || !Object.hasOwn(statusLabels, request.status) || !Number.isInteger(request.stage) || request.stage < 0 || request.stage >= fulfilmentStages.length || (request.status !== 'approved' && request.stage !== 0) || !Array.isArray(request.history) || request.history.length > 1000 || request.history.some(h => !h || typeof h.action !== 'string' || h.action.length > 200 || typeof h.note !== 'string' || h.note.length > 1000 || !Number.isFinite(Date.parse(h.at))) || !Number.isFinite(Date.parse(request.createdAt)) || !Number.isFinite(Date.parse(request.updatedAt))) throw new Error('Stored request data is invalid.');
  ids.add(request.id);
 }
 return data;
}
export const csvCell = (value: unknown) => '"' + String(value ?? '').replace(/^[\s]*[=+@-]/, match => "'" + match).replaceAll('"', '""') + '"';
export function workspaceCsv(workspace: Workspace) {
 const rows: unknown[][] = [['Request ID', 'Title', 'Department', 'Reviewer', 'Status', 'Planning estimate INR', 'Estimate complete', 'Locations', 'Needed by', 'Manual fulfilment stage']];
 for (const r of workspace.requests) rows.push([r.id, r.title, r.department, r.reviewer, statusLabels[r.status], requestTotal(r), hasEstimates(r) ? 'Yes' : 'No', r.locations, r.neededBy, fulfilmentStages[r.stage]]);
 return rows.map(row => row.map(csvCell).join(',')).join('\r\n');
}
export function requestBrief(r: PurchaseRequest) {
 return `Hi OfNeeds, please review this planning brief (not a purchase order).\n\nReference: ${r.id}\nRequirement: ${r.title}\nDepartment: ${r.department}\nItems:\n${r.lines.map(l => `${l.name} × ${l.quantity}${l.estimate !== null ? ` (planning estimate ₹${l.estimate} each)` : ' (quote required)'}`).join('\n')}\nLocations: ${r.locations}\nNeeded by: ${r.neededBy || 'To discuss'}\nNotes: ${r.notes || 'None'}\n\nPlease confirm availability, branding, GST, shipping and final pricing. Local planning approval does not place an order.`;
}
export function sampleWorkspace(): Workspace {
 const at = new Date().toISOString();
 const base = { department: 'People Operations', reviewer: 'Sample reviewer', locations: 'Bengaluru · 1 office', neededBy: '', notes: 'Fictional sample for exploring the workspace.', sample: true };
 return { version: 1, budget: 100000, requests: [
  { ...base, id: 'SAMPLE-001', title: 'New joiner welcome kits', lines: [{ id: 'welcome-kit-1', name: 'Welcome kits — sample estimate', quantity: 40, estimate: 600 }], status: 'pending', stage: 0, createdAt: at, updatedAt: at, history: [{ at, action: 'Sample request awaiting local review', note: 'Fictional amounts, not a supplier quotation.' }] },
  { ...base, id: 'SAMPLE-002', title: 'Team milestone merchandise', department: 'Marketing', lines: [{ id: 'custom', name: 'Branded desk sets — sample estimate', quantity: 20, estimate: 800 }], status: 'approved', stage: 1, createdAt: at, updatedAt: at, history: [{ at, action: 'Sample approval and sourcing stage', note: 'Demonstration only; no order exists.' }] },
  { ...base, id: 'SAMPLE-003', title: 'Year-end gifting ideas', lines: [{ id: 'custom', name: 'Seasonal hampers', quantity: 60, estimate: null }], status: 'draft', stage: 0, createdAt: at, updatedAt: at, history: [{ at, action: 'Sample draft created', note: '' }] }
 ] };
}
