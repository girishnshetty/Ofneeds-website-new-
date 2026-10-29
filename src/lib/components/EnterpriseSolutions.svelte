<script lang="ts">
 import { resolve } from '$app/paths';
 import Icon from './Icon.svelte';
 const features = [
  { icon: 'grid', title: 'One organised brief', text: 'Keep product selections, quantities and delivery locations together.' },
  { icon: 'check', title: 'A clear review trail', text: 'Try request and reviewer views, with notes for each decision.' },
  { icon: 'truck', title: 'Know the next step', text: 'Record confirmed supplier updates alongside your request.' }
 ];
</script>

<section class="section enterprise-solutions" id="procurement">
 <div class="container">
  <div class="section-heading"><div><p class="eyebrow">From a selection to a considered plan</p><h2>Every request.<br />A little more organised.</h2></div><p>Give your HR, admin and procurement teams a useful place to plan the details before speaking with OfNeeds.</p></div>
  <div class="enterprise-workspace-feature">
   <div class="enterprise-workspace-copy"><span class="enterprise-label">BUYER WORKSPACE · PREVIEW</span><h3>Less chasing.<br />More clarity.</h3><p>Build a request, check the budget and keep a record of the review. Start from your product shortlist or add a custom requirement.</p><ul>{#each features as feature (feature.title)}<li><span><Icon name={feature.icon} size={19} /></span><div><strong>{feature.title}</strong><p>{feature.text}</p></div></li>{/each}</ul><a class="button button-white" href={resolve('/workspace')}>Explore the buyer workspace <Icon size={17} /></a><p class="enterprise-preview-note">A browser-based planning preview. No live order, team notification or payment is created.</p></div>
   <div class="enterprise-workspace-visual" aria-label="Illustrative buyer workspace"><div class="enterprise-mini-header"><span>OfNeeds / workspace</span><span class="enterprise-mini-dot">Illustrative view</span></div><div class="enterprise-mini-title"><h4>Good plans start here.</h4><span>+ New request</span></div><div class="enterprise-mini-stats"><div><small>Build your brief</small><strong>Products</strong></div><div><small>Keep it considered</small><strong>Budget</strong></div><div><small>Align the details</small><strong>Review</strong></div></div><div class="enterprise-mini-request"><div><span>PEOPLE OPERATIONS</span><strong>Welcome the next chapter.</strong><p>Welcome kits · Branding · Delivery locations</p></div><span class="enterprise-mini-badge">Ready to plan</span></div><div class="enterprise-mini-flow"><span>01<br /><strong>Shortlist</strong></span><i></i><span>02<br /><strong>Review</strong></span><i></i><span>03<br /><strong>Enquire</strong></span></div><p class="enterprise-mini-footer"><Icon name="check" size={14} /> Your requirements, with room for every detail.</p></div>
  </div>
  <div class="enterprise-gifting-choice" id="digital-gifting"><div><p class="eyebrow">More ways to say thank you</p><h3>Corporate gift cards.<br />The freedom to choose.</h3><p>Explore OfNeeds gift cards and gift vouchers for employee rewards, festive programmes and client thank-yous across India. Share your preferred brands, value per recipient and quantity so our team can check suitable options.</p><a class="button button-outline" href={resolve('/gift-cards')}>Explore gift cards <Icon size={17} /></a><p class="enterprise-availability">Available brands, denominations, validity, delivery method and commercial terms are confirmed individually. Instant voucher issuance is not available on this website.</p></div><div class="enterprise-voucher-art" aria-label="Illustrative digital gifting card"><div class="enterprise-voucher-back"></div><div class="enterprise-voucher-front"><span>OfNeeds · Gifting possibilities</span><Icon name="tag" size={32} /><strong>A little choice.<br />A lot of thought.</strong><small>Gift card enquiry · availability to confirm</small></div><span class="enterprise-voucher-caption">An enquiry starts with your recipient.</span></div></div>
 </div>
</section>

<style>
 .enterprise-solutions { background:#f7f8f6; }
 .enterprise-workspace-feature { display:grid; grid-template-columns:1fr 1.05fr; background:#102c37; border-radius:14px; overflow:hidden; color:white; }
 .enterprise-workspace-copy { padding:46px; }
 .enterprise-label { display:inline-block; font-size:9px; letter-spacing:1.5px; color:#b5d2c9; margin-bottom:23px; }
 .enterprise-workspace-copy h3 { color:#fff; font-size:37px; line-height:1.12; letter-spacing:-1px; margin:0 0 22px; }
 .enterprise-workspace-copy > p { color:#b9cbd1; font-size:13px; line-height:1.85; }
 .enterprise-workspace-copy ul { list-style:none; display:grid; gap:21px; padding:0; margin:29px 0; }
 .enterprise-workspace-copy li { display:flex; align-items:start; gap:14px; }
 .enterprise-workspace-copy li > span { color:#b0cec0; background:#ffffff0c; border:1px solid #ffffff18; padding:10px; border-radius:8px; }
 .enterprise-workspace-copy li strong { font-size:13px; }
 .enterprise-workspace-copy li p { font-size:11px; color:#b9cbd1; margin:6px 0 0; line-height:1.7; }
 .enterprise-workspace-copy .button { font-size:12px; }
 .enterprise-workspace-copy .enterprise-preview-note { margin:15px 0 0; font-size:10px; max-width:340px; }
 .enterprise-workspace-visual { margin:55px 0 55px 12px; padding:25px; background:#f9fbfa; color:#17363d; border:1px solid #cbd9d6; border-radius:12px 0 0 12px; box-shadow:0 15px 50px #0003; align-self:center; }
 .enterprise-mini-header { display:flex; justify-content:space-between; align-items:center; gap:14px; font-size:9px; color:#6a817b; padding-bottom:23px; border-bottom:1px solid #e1e8e4; }
 .enterprise-mini-dot { background:#e5f0e9; padding:5px 8px; border-radius:5px; font-size:8px; }
 .enterprise-mini-title { display:flex; justify-content:space-between; gap:12px; align-items:center; margin:29px 0 22px; }
 .enterprise-mini-title h4 { font-size:18px; letter-spacing:-.5px; margin:0; }
 .enterprise-mini-title > span { color:#fff; background:#204b42; padding:9px; font-size:8px; border-radius:4px; white-space:nowrap; }
 .enterprise-mini-stats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; }
 .enterprise-mini-stats > div { padding:15px 10px; background:white; border:1px solid #e0e8e4; border-radius:6px; }
 .enterprise-mini-stats small { font-size:8px; color:#6b7f78; display:block; }
 .enterprise-mini-stats strong { display:block; font-size:14px; margin-top:12px; }
 .enterprise-mini-request { display:flex; gap:12px; justify-content:space-between; align-items:start; padding:22px 16px; background:#fff; border:1px solid #e0e8e4; border-radius:7px; margin:17px 0 25px; }
 .enterprise-mini-request span { font-size:7px; color:#688078; }
 .enterprise-mini-request strong { display:block; font-size:13px; margin-top:12px; }
 .enterprise-mini-request p { font-size:8px; color:#6b7f78; margin:10px 0 0; }
 .enterprise-mini-request .enterprise-mini-badge { white-space:nowrap; background:#e6f1e7; color:#3b6b44; border-radius:4px; padding:5px 7px; font-size:7px; }
 .enterprise-mini-flow { display:flex; align-items:center; gap:13px; padding:0 10px; }
 .enterprise-mini-flow > span { font-size:9px; color:#678078; line-height:2; }
 .enterprise-mini-flow strong { font-size:10px; color:#204b42; }
 .enterprise-mini-flow i { height:1px; background:#d6e3dc; flex:1; }
 .enterprise-mini-footer { display:flex; gap:8px; align-items:center; font-size:9px; color:#577d6b; border-top:1px solid #e0e8e4; padding-top:18px; margin:23px 0 0; }
 .enterprise-gifting-choice { display:grid; grid-template-columns:1.1fr .9fr; gap:70px; margin-top:50px; padding:50px 42px; background:#eeeae0; border:1px solid #e3ded0; border-radius:14px; align-items:center; }
 .enterprise-gifting-choice h3 { font-family:Georgia,serif; font-size:35px; font-weight:400; letter-spacing:-.8px; line-height:1.2; margin:0 0 23px; }
 .enterprise-gifting-choice p { font-size:13px; line-height:1.85; }
 .enterprise-gifting-choice .button { margin-top:5px; font-size:12px; }
 .enterprise-gifting-choice .enterprise-availability { font-size:10px; line-height:1.8; max-width:460px; margin:17px 0 0; }
 .enterprise-voucher-art { position:relative; padding:20px 0 30px 20px; min-width:0; }
 .enterprise-voucher-front { position:relative; display:flex; flex-direction:column; align-items:start; gap:20px; padding:27px; color:#fff; background:linear-gradient(120deg,#284d45,#122e36); border:1px solid #426459; border-radius:14px; box-shadow:0 17px 30px #243d2c24; transform:rotate(-4deg); }
 .enterprise-voucher-front > span { font-size:9px; letter-spacing:.5px; color:#c8d5c6; }
 .enterprise-voucher-front strong { font-family:Georgia,serif; font-weight:400; font-size:30px; line-height:1.15; }
 .enterprise-voucher-front small { font-size:8px; color:#bdd0c2; }
 .enterprise-voucher-front :global(svg) { align-self:end; color:#d8c69d; }
 .enterprise-voucher-back { position:absolute; inset:20px 5px 45px 25px; border-radius:14px; background:#c7b68b; transform:rotate(7deg); }
 .enterprise-voucher-caption { display:block; position:relative; z-index:1; text-align:center; margin-top:38px; font-size:9px; color:#766d57; }
 @media(max-width:1000px) { .enterprise-workspace-copy { padding:32px; } .enterprise-workspace-visual { padding:18px; } .enterprise-gifting-choice { gap:35px; padding:35px; } }
 @media(max-width:760px) { .enterprise-workspace-feature { grid-template-columns:1fr; } .enterprise-workspace-copy h3 { font-size:32px; } .enterprise-workspace-visual { margin:0 22px 28px; border-radius:10px; } .enterprise-gifting-choice { grid-template-columns:1fr; padding:28px; gap:25px; } .enterprise-gifting-choice h3 { font-size:30px; } .enterprise-voucher-art { width:100%; max-width:360px; margin:auto; } }
 @media(max-width:400px) { .enterprise-workspace-copy { padding:26px 22px; } .enterprise-workspace-visual { margin:0 14px 22px; padding:15px; } .enterprise-mini-title h4 { font-size:15px; } .enterprise-mini-stats { gap:6px; } .enterprise-mini-request { padding:16px 10px; flex-wrap:wrap; } .enterprise-mini-stats strong { font-size:12px; } }
</style>
