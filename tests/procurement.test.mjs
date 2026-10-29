import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './helpers/load-typescript.mjs';
const model = await loadTypescript('src/lib/procurement.ts');
const input = (changes = {}) => ({ title:'Welcome kits', department:'People Operations', reviewer:'Procurement', locations:'Bengaluru: 10', neededBy:'2026-12-01', notes:'Logo on packaging', lines:[{id:'kit',name:'Welcome kit',quantity:10,estimate:500}], ...changes });
const at = '2026-10-29T10:00:00.000Z';
const pending = () => model.saveRequest(model.emptyWorkspace(), input(), 'REQ-1', true, at);

test('drafts retain unknown estimates; submitting does not place an order or approve it', () => {
 const draft = model.saveRequest(model.emptyWorkspace(), input({lines:[{id:'custom',name:'Hampers',quantity:5,estimate:null}]}), 'REQ-1', false, at);
 assert.equal(draft.requests[0].status,'draft');
 assert.equal(model.hasEstimates(draft.requests[0]),false);
 assert.equal(model.requestTotal(draft.requests[0]),0);
 const submitted = pending();
 assert.equal(submitted.requests[0].status,'pending');
 assert.equal(submitted.requests[0].stage,0);
 assert.equal(model.approvedTotal(submitted),0);
});
test('approvals require complete pricing and respect the remaining budget across requests', () => {
 let workspace = pending();
 workspace.budget = 6000;
 workspace = model.reviewRequest(workspace,'REQ-1','approve','Confirmed estimate',at);
 assert.equal(model.approvedTotal(workspace),5000);
 workspace = model.saveRequest(workspace,input(),'REQ-2',true,at);
 assert.throws(()=>model.reviewRequest(workspace,'REQ-2','approve','',at),/remaining planning budget/);
 const unpriced = model.saveRequest(model.emptyWorkspace(),input({lines:[{id:'x',name:'Unknown',quantity:10,estimate:null}]}),'REQ-X',true,at);
 assert.throws(()=>model.reviewRequest(unpriced,'REQ-X','approve','',at),/estimate for every item/);
 assert.throws(()=>model.reviewRequest(workspace,'REQ-1','approve','',at),/not awaiting review/);
});
test('changes need a reason and can be revised and resubmitted with history retained', () => {
 assert.throws(()=>model.reviewRequest(pending(),'REQ-1','changes',' ',at),/Add a note/);
 let workspace = model.reviewRequest(pending(),'REQ-1','changes','Reduce quantity',at);
 workspace = model.saveRequest(workspace,input({lines:[{id:'kit',name:'Welcome kit',quantity:5,estimate:500}]}),'REQ-1',true,at);
 assert.equal(workspace.requests.length,1);
 assert.equal(workspace.requests[0].status,'pending');
 assert.equal(workspace.requests[0].history[1].note,'Reduce quantity');
 assert.equal(model.requestTotal(workspace.requests[0]),2500);
 assert.throws(()=>model.saveRequest(workspace,input(),'REQ-1',false,at),/Only drafts/);
});
test('progress requires approval, a confirmation note and advances sequentially', () => {
 assert.throws(()=>model.advanceFulfilment(pending(),'REQ-1','Received update',at),/Only an approved/);
 let workspace = model.reviewRequest(pending(),'REQ-1','approve','',at);
 assert.throws(()=>model.advanceFulfilment(workspace,'REQ-1',' ',at),/confirmation/);
 for(let stage=1; stage<model.fulfilmentStages.length; stage++) {
  workspace = model.advanceFulfilment(workspace,'REQ-1','Supplier confirmation',at);
  assert.equal(workspace.requests[0].stage,stage);
 }
 assert.throws(()=>model.advanceFulfilment(workspace,'REQ-1','Again',at),/unfinished/);
 assert.throws(()=>model.saveRequest(workspace,input(),'REQ-1',false,at),/Only drafts/);
});
test('browser restore rejects malformed states, duplicate references and invalid history', () => {
 const valid = pending();
 assert.deepEqual(model.restoreWorkspace(JSON.stringify(valid)),valid);
 for(const bad of [{...valid,version:2},{...valid,budget:-1},{...valid,requests:[valid.requests[0],valid.requests[0]]},{...valid,requests:[{...valid.requests[0],status:'__proto__'}]},{...valid,requests:[{...valid.requests[0],stage:3}]},{...valid,requests:[{...valid.requests[0],history:[{at:'bad',action:'bad',note:''}]}]}]) {
  assert.throws(()=>model.restoreWorkspace(JSON.stringify(bad)),/invalid/);
 }
});
test('invalid quantities, estimates, dates and oversized text cannot enter a request', () => {
 for(const changes of [{title:''},{notes:'x'.repeat(2001)},{neededBy:'2026-02-30'},{lines:[]},{lines:[{id:'x',name:'Kit',quantity:1.5,estimate:5}]},{lines:[{id:'x',name:'Kit',quantity:1,estimate:Infinity}]},{lines:[{id:'x',name:'Kit',quantity:1,estimate:-1}]}]) assert.throws(()=>model.saveRequest(model.emptyWorkspace(),input(changes),'REQ-1',true,at));
});
test('export neutralises spreadsheet formulas and preserves quoted multiline cells', () => {
 let workspace = model.saveRequest(model.emptyWorkspace(),input({title:'=HYPERLINK("evil")',locations:'Bengaluru\nHyderabad'}),'REQ-1',false,at);
 const csv = model.workspaceCsv(workspace);
 assert.ok(csv.includes('"\'=HYPERLINK(""evil"")"'));
 assert.ok(csv.includes('"Bengaluru\nHyderabad"'));
 assert.equal(model.csvCell(' +SUM(1,2)'), '"\' +SUM(1,2)"');
});
test('sample data is explicitly marked and the shareable brief is not a purchase order', () => {
 const sample = model.sampleWorkspace();
 assert.ok(sample.requests.every(r=>r.sample));
 assert.equal(model.restoreWorkspace(JSON.stringify(sample)).requests.length,3);
 assert.match(model.requestBrief(sample.requests[0]),/not a purchase order/);
});
