// Local Vite instance and local mock receiver. Never contacts the configured production receiver.
import { createServer } from 'node:http';
import { createServer as createViteServer } from 'vite';
import assert from 'node:assert/strict';
const deliveries=[];
const receiver=createServer(async(req,res)=>{
 let body=''; for await(const chunk of req) body+=chunk;
 assert.equal(req.headers.authorization,'Bearer audience-test-token');
 deliveries.push(JSON.parse(body)); res.writeHead(200,{'Content-Type':'application/json'}); res.end('{"accepted":true}');
});
await new Promise(resolve=>receiver.listen(0,'127.0.0.1',resolve));
process.env.LEAD_WEBHOOK_URL=`http://127.0.0.1:${receiver.address().port}/leads`;
process.env.LEAD_WEBHOOK_TOKEN='audience-test-token';
const server=await createViteServer({server:{host:'127.0.0.1',port:5181,strictPort:true},logLevel:'error'});
const base='http://127.0.0.1:5181';
const fields={name:'Test Person',company:'Test Company',email:'audience@example.test',phone:'9000000000',productRequirement:'Local test requirement',quantity:'25',budget:'600',deliveryCity:'Bengaluru',selectedProducts:'[]',source:'/contact',submissionKey:crypto.randomUUID()};
async function submit(changes={}) {
 const response=await fetch(base+'/contact?/quote',{method:'POST',headers:{Origin:base,Accept:'application/json','Content-Type':'application/x-www-form-urlencoded','x-sveltekit-action':'true'},body:new URLSearchParams({...fields,...changes})});
 return response.json();
}
try {
 await server.listen();
 assert.equal((await fetch(base+'/contact')).status,200);
 assert.equal((await submit()).type,'success');
 assert.equal(deliveries[0].enquiryType,'buyer'); assert.equal(deliveries[0].quantity,25);
 assert.equal((await submit()).type,'success'); assert.equal(deliveries.length,1,'A retry must not deliver again');
 for(const enquiryType of ['supplier','other']) {
  assert.equal((await submit({enquiryType,quantity:'',budget:'',submissionKey:crypto.randomUUID()})).type,'success');
  assert.equal(deliveries.at(-1).enquiryType,enquiryType); assert.equal(deliveries.at(-1).quantity,null);
 }
 assert.equal((await submit({enquiryType:'unknown',submissionKey:crypto.randomUUID()})).status,400);
 assert.equal((await submit({quantity:'',submissionKey:crypto.randomUUID()})).status,400);
 assert.equal(deliveries.length,3,'Invalid audience or missing buyer quantity must not deliver');
 console.log('PASS: buyer/supplier/other audience reaches the local receiver; nullable supplier quantity, retry suppression and invalid-form rejection verified.');
} finally { await server.close(); await new Promise(resolve=>receiver.close(resolve)); }
