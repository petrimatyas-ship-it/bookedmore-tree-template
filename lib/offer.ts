/**
 * The offer a prospect sees on their preview site: "Make it live · $99/mo".
 *
 *   /<slug>/live    the offer, one phone screen: what they get, the price, Start now
 *                   (Stripe) and Ask me a question (a short form that emails the owner)
 *   /welcome        Stripe's success page: three questions that start the work
 *   who we are      morebookednow.com/about (ABOUT_URL), for "from where?" and "company information"
 *
 * One price only, and no phone-call option anywhere: the owner cannot take calls.
 * The Stripe Payment Link is the Vercel variable STRIPE_PAYMENT_LINK (one link for
 * every site); the site's slug goes with it as client_reference_id, so the payment
 * says who paid. Without the variable, Start now opens the question form instead.
 *
 * Every tap is recorded like the site's own (app/api/demo/track): cta:start-now and
 * cta:ask on the offer page, into the same visit as the site page the prospect came
 * from when the link carries it (?v=<visit>).
 */

export const PRICE = "$99";
/** The monthly price over a year, for the buyout block. */
export const YEAR = "$1,188";
export const REFUND_LINE = "Not happy in the first 30 days? Full refund, no questions asked.";
/** Who we are: MoreBookedNow's own about page (the preview banner and the offer link to it). */
export const ABOUT_URL = "https://morebookednow.com/about";
export const LIVE_LINE = "Live within 48 hours. Already have a domain? We move it over with one quick step from you.";

/** Where a paying site goes live first, within 48 hours: domingotreeservice.morebookednow.com. */
export const liveHost = (slug: string) => `${slug.replace(/[^a-z0-9]/g, "")}.morebookednow.com`;

/**
 * The address the owner invites to their domain (DELEGATE_EMAIL, else the owner inbox). Each
 * registrar's own way of letting someone else manage a domain, so nobody hands over a password.
 */
export const delegateEmail = () => (process.env.DELEGATE_EMAIL || process.env.OWNER_EMAIL || "hello@morebookednow.com").trim();

export const REGISTRARS = [
  ["godaddy", "GoDaddy"],
  ["namecheap", "Namecheap"],
  ["squarespace", "Squarespace"],
  ["wix", "Wix"],
  ["other", "Somewhere else"],
  ["unknown", "I don't know"]
] as const;
export type Registrar = (typeof REGISTRARS)[number][0];

/** The one quick step for a registrar, as plain lines (the page and the email both use them). */
export function domainGuide(registrar: string, email: string): { title: string; steps: string[]; note: string } {
  const never = "We never need your password, and you can remove our access any time.";
  switch (registrar) {
    case "godaddy":
      return { title: "GoDaddy: Delegate Access", steps: [
        "Sign in to GoDaddy and open your name at the top right, then Account Settings.",
        "Choose Delegate Access, then Invite to Access.",
        `Enter the name MoreBookedNow and the email ${email}.`,
        "Pick Products & Domains as the access level and send the invite."
      ], note: never };
    case "namecheap":
      return { title: "Namecheap: Share Access", steps: [
        "Sign in to Namecheap and open Domain List.",
        "Click Manage next to your domain, then the Sharing & Transfer tab.",
        `Under Share Access, enter ${email} and allow it to manage the domain's DNS.`,
        "Save. We get an invitation and accept it."
      ], note: never };
    case "squarespace":
      return { title: "Squarespace: add a contributor", steps: [
        "Sign in to Squarespace and open Domains.",
        "Click your domain, then Permissions (or Settings, then Permissions & Ownership).",
        `Invite ${email} as a contributor with permission to manage the domain.`
      ], note: never };
    case "wix":
      return { title: "Wix: invite a collaborator", steps: [
        "Sign in to Wix and open your site's dashboard.",
        "Go to Settings, then Roles & Permissions, then Invite People.",
        `Enter ${email} and choose a role that can manage domains (Admin), then send.`
      ], note: never };
    default:
      return { title: "We will find it for you", steps: [
        "Not sure where your domain is? That's fine: tell us the domain above and we look it up.",
        `We then send you the one step for that company: an invite to ${email}.`
      ], note: never };
  }
}


/** Stripe's Payment Link with the site's slug, or null when none is set. */
export function paymentLink(slug: string): string | null {
  const raw = (process.env.STRIPE_PAYMENT_LINK ?? "").trim();
  if (!/^https:\/\/(buy|checkout)\.stripe\.com\//.test(raw)) return null;
  const url = new URL(raw);
  url.searchParams.set("client_reference_id", slug);
  return url.toString();
}

/** Text that goes into the page, escaped. Stored site names are already HTML-escaped; pass them as they are. */
export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const STYLE = `
:root{--ink:#0f1f33;--soft:#4a5a6e;--muted:#6b7a8c;--line:#e2e8f0;--bg:#f5f7fa;--go:#16a34a;--go-d:#12803a;--blue:#1d4ed8}
*{box-sizing:border-box;margin:0;padding:0}
body{font:400 1rem/1.55 Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--ink);background:var(--bg);-webkit-text-size-adjust:100%}
a{color:inherit}
.wrap{max-width:560px;margin:0 auto;padding:18px 18px 40px}
.top{display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:.86rem;color:var(--muted);margin-bottom:16px}
.top a{color:var(--muted);text-decoration:none}
.top b{color:var(--ink)}
.card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:24px 20px;box-shadow:0 18px 40px -28px rgba(15,31,51,.45)}
h1{font-size:1.65rem;line-height:1.15;letter-spacing:-.02em}
.for{color:var(--muted);margin-top:6px;font-size:.95rem}
ul.ok{list-style:none;margin:20px 0;display:grid;gap:12px}
ul.ok li{display:flex;gap:10px;align-items:flex-start}
ul.ok li::before{content:"";flex:none;width:22px;height:22px;margin-top:1px;border-radius:50%;background:var(--go) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2.5 7.5l3 3 6-7'/%3E%3C/svg%3E") center/14px no-repeat}
.price{border-top:1px solid var(--line);padding-top:18px;margin-top:4px}
.price b{font-size:2rem;letter-spacing:-.02em}
.price b small{font-size:1rem;font-weight:600;color:var(--muted)}
.price p{color:var(--soft);font-size:.95rem;margin-top:4px}
.fine{margin-top:14px;display:grid;gap:6px;font-size:.92rem;color:var(--soft)}
.fine p::before{content:"· ";color:var(--muted)}
.btns{display:grid;gap:10px;margin-top:22px}
.btn{display:flex;align-items:center;justify-content:center;min-height:54px;padding:12px 18px;border-radius:12px;border:2px solid transparent;font-family:inherit;font-size:1.05rem;font-weight:700;line-height:1.2;text-decoration:none;cursor:pointer;background:none}
.btn.go{background:var(--go);color:#fff}
.btn.go:hover{background:var(--go-d)}
.btn.q{border-color:var(--line);color:var(--ink);background:#fff}
form{display:grid;gap:12px;margin-top:18px}
form[hidden]{display:none}
label{display:grid;gap:6px;font-weight:600;font-size:.92rem}
input,textarea{font:inherit;width:100%;border:1.5px solid var(--line);border-radius:10px;padding:12px 13px;background:#fff;min-height:48px}
textarea{min-height:96px;resize:vertical}
input:focus,textarea:focus{outline:none;border-color:var(--blue)}
.radio{display:flex;gap:10px}
.radio label{display:flex;align-items:center;gap:8px;flex:1;border:1.5px solid var(--line);border-radius:10px;padding:12px;font-weight:600;cursor:pointer}
.radio input{width:auto;min-height:0}
.hp{position:absolute;left:-5000px}
.done{display:none;margin-top:16px;padding:14px;border-radius:10px;background:#ecfdf3;border:1px solid #b7e4c7;color:#14532d}
.done.err{background:#fef2f2;border-color:#fecaca;color:#7f1d1d}
.buy{margin-top:26px;padding-top:20px;border-top:1px solid var(--line);font-size:.93rem;color:var(--soft)}
.buy h2{margin:0 0 8px;font-size:1.02rem;color:var(--ink)}
.buy p+p{margin-top:8px}
.buy form{margin-top:14px;gap:10px}
.buy .btn{min-height:48px;font-size:.98rem}
.buy .amt{display:flex;align-items:center;gap:8px;flex-wrap:wrap;color:var(--ink)}
.buy .cur{display:flex;align-items:center;border:1.5px solid var(--line);border-radius:10px;background:#fff;padding-left:12px;width:150px}
.buy .cur:focus-within{border-color:var(--blue)}
.buy .cur b{color:var(--muted)}
.buy .cur input{border:0;min-height:46px;padding:10px 10px 10px 4px;font-weight:700;width:100%}
.buy .cur input:focus{outline:none}
.foot{margin-top:18px;text-align:center;font-size:.85rem;color:var(--muted)}
.foot a{color:var(--muted)}
h2{font-size:1.1rem;margin-top:22px}
.card p+p{margin-top:10px}
`;

function page(title: string, body: string, script = ""): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="robots" content="noindex, nofollow"><title>${title}</title><style>${STYLE}</style></head><body>${body}${script ? `<script>${script}</script>` : ""}</body></html>`;
}

/** Posts a short form to /api/owner-message and says how it went. */
const FORM_SCRIPT = `
function ownerForm(f,kind,extra,after){f.addEventListener('submit',async function(e){e.preventDefault();
  var d={kind:kind};[].forEach.call(f.elements,function(x){if(x.name&&(x.type!=='radio'||x.checked))d[x.name]=x.value});Object.assign(d,extra||{});
  var ok=f.parentNode.querySelector('.done'),b=f.querySelector('[type=submit]');b.disabled=true;
  try{var r=await fetch('/api/owner-message',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});if(!r.ok)throw 0;
    ok.className='done';ok.textContent=f.dataset.thanks;ok.style.display='block';f.hidden=true;if(after)after(d)}
  catch(_){ok.className='done err';ok.textContent='Sorry, that did not go through. Please try again in a minute.';ok.style.display='block';b.disabled=false}})}
`;

/** The visit log, as the site pages keep it: one event, attached to the visit the prospect came from. */
const TRACK_SCRIPT = (slug: string) => `
var SLUG=${JSON.stringify(slug)},VISIT=(new URLSearchParams(location.search).get('v')||'').replace(/[^a-z0-9]/g,'').slice(0,16);
function track(ev,val){var fresh=!VISIT;if(fresh)VISIT=Math.random().toString(36).slice(2,12);
  function one(e,v){var body=JSON.stringify({slug:SLUG,event:e,page:location.pathname,visit:VISIT,value:v});try{if(!(navigator.sendBeacon&&navigator.sendBeacon('/api/demo/track',new Blob([body],{type:'application/json'}))))fetch('/api/demo/track',{method:'POST',headers:{'Content-Type':'application/json'},body:body,keepalive:true})}catch(_){}}
  if(fresh)one('view');one(ev,val)}
`;

export function offerPage(slug: string, businessHtml: string): string {
  const pay = paymentLink(slug);
  const body = `<div class="wrap">
<div class="top"><a href="/${slug}">&larr; Back to your site</a><span>MoreBookedNow</span></div>
<main class="card">
  <h1>Your site, live on your own domain</h1>
  <p class="for">For <b>${businessHtml}</b></p>
  <ul class="ok">
    <li>This site, on your domain (a new one, or the one you have)</li>
    <li>Hosting, changes and fixes whenever you need them</li>
    <li>Connected to your Google Business Profile</li>
  </ul>
  <div class="price"><b>${PRICE} <small>/ month</small></b><p>No setup fee, no contract, cancel anytime.</p></div>
  <div class="fine"><p>${LIVE_LINE}</p><p>${REFUND_LINE}</p></div>
  <div class="btns">
    ${pay ? `<a class="btn go" id="start" href="${esc(pay)}">Start now</a>` : `<button type="button" class="btn go" id="start">Start now</button>`}
    <button type="button" class="btn q" id="ask">Ask me a question</button>
  </div>
  <form id="askf" hidden data-thanks="Thanks! Your question is on its way. You will get an answer by email, usually the same day.">
    <label>Your name<input name="name" autocomplete="name" maxlength="120"></label>
    <label>Your email<input name="email" type="email" autocomplete="email" required maxlength="200"></label>
    <label>Your question<textarea name="question" required maxlength="3000"${pay ? "" : ' placeholder="Tell me you want to start, or ask anything."'}></textarea></label>
    <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button type="submit" class="btn go">Send</button>
  </form>
  <div class="done" role="status"></div>
  <section class="buy">
    <h2>Want to own it instead?</h2>
    <p>On the monthly plan this site is ${PRICE} a month, ${YEAR} a year, with hosting, changes and fixes included.</p>
    <p>If you&#39;d rather buy it outright, tell me what it&#39;s worth to you. Buying it out means the site is yours; hosting and later changes aren&#39;t included.</p>
    <form id="buyf" data-thanks="Offer sent.">
      <label class="amt">I&#39;d pay <span class="cur"><b>$</b><input name="amount" type="text" inputmode="numeric" pattern="[0-9]{1,7}" required maxlength="7" autocomplete="off" aria-label="Amount in dollars"></span> once</label>
      <label>Your email<input name="email" type="email" autocomplete="email" required maxlength="200"></label>
      <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button type="submit" class="btn q">Send my offer &rarr;</button>
    </form>
    <div class="done" role="status"></div>
  </section>
</main>
<p class="foot"><a href="${ABOUT_URL}">Who we are</a></p>
</div>`;
  const script = `${TRACK_SCRIPT(slug)}${FORM_SCRIPT}
var f=document.getElementById('askf');ownerForm(f,'question',{slug:SLUG});
var bf=document.getElementById('buyf'),amt=bf.querySelector('[name=amount]');
amt.addEventListener('input',function(){var v=amt.value.replace(/[^0-9]/g,'');if(v!==amt.value)amt.value=v});
ownerForm(bf,'buyout',{slug:SLUG},function(d){track('cta:buyout',parseInt(d.amount,10))});
function openAsk(){f.hidden=false;var i=f.querySelector('input[name=email]');try{f.scrollIntoView({block:'start',behavior:'smooth'})}catch(_){}setTimeout(function(){i.focus()},250)}
document.getElementById('ask').addEventListener('click',function(){track('cta:ask');openAsk()});
var s=document.getElementById('start');s.addEventListener('click',function(e){track('cta:start-now');
  try{localStorage.setItem('mbn-start',JSON.stringify({slug:SLUG,at:Date.now()}))}catch(_){}
  if(s.tagName==='BUTTON'){openAsk()}});`;
  return page(`Make it live | ${businessHtml}`, body, script);
}

export function welcomePage(): string {
  const email = delegateEmail();
  const guides = Object.fromEntries(REGISTRARS.map(([k]) => [k, domainGuide(k, email)]));
  const body = `<div class="wrap">
<div class="top"><b>MoreBookedNow</b><a href="${ABOUT_URL}">Who we are</a></div>
<main class="card">
  <h1>Thank you, you&#39;re in</h1>
  <p class="for" id="for">A few quick questions and we start on your site. It goes live within 48 hours<span id="host"></span>.</p>
  <form id="wf">
    <fieldset style="border:0;display:grid;gap:8px"><legend style="font-weight:600;font-size:.92rem;margin-bottom:6px">Do you have a domain?</legend>
      <div class="radio"><label><input type="radio" name="hasDomain" value="yes" required> Yes</label><label><input type="radio" name="hasDomain" value="no"> No, get me one</label></div></fieldset>
    <div id="dom" hidden style="display:grid;gap:12px">
      <label>Which one?<input name="domain" placeholder="yourbusiness.com" maxlength="200" autocapitalize="off"></label>
      <label>Where is it registered?<select name="registrar">${REGISTRARS.map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join("")}</select></label>
    </div>
    <label>Anything you&#39;d like changed?<textarea name="changes" maxlength="3000" placeholder="Photos, words, services, prices, anything"></textarea></label>
    <label>Best phone number for texts<input name="phone" type="tel" autocomplete="tel" required maxlength="40"></label>
    <label>Your email<input name="email" type="email" autocomplete="email" required maxlength="200"></label>
    <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button type="submit" class="btn go">Send</button>
  </form>
  <div class="done" role="status"></div>
  <div id="guide" hidden></div>
</main>
</div>`;
  const script = `${FORM_SCRIPT}
var GUIDES=${JSON.stringify(guides).replace(/</g, "\\u003c")};
var q=new URLSearchParams(location.search),slug=(q.get('slug')||'').toLowerCase().replace(/[^a-z0-9-]/g,'');
try{var st=JSON.parse(localStorage.getItem('mbn-start')||'null');if(!slug&&st&&st.slug)slug=String(st.slug).replace(/[^a-z0-9-]/g,'')}catch(_){}
var host=slug?slug.replace(/[^a-z0-9]/g,'')+'.morebookednow.com':'';
if(host)document.getElementById('host').textContent=' at '+host;
var f=document.getElementById('wf'),dom=document.getElementById('dom');
f.addEventListener('change',function(){var y=f.querySelector('[name=hasDomain]:checked');dom.hidden=!(y&&y.value==='yes');dom.style.display=dom.hidden?'none':'grid'});dom.style.display='none';
f.dataset.thanks='Got it. Your site will be live within 48 hours'+(host?' at '+host:'')+'. We will be in touch as soon as it is.';
ownerForm(f,'new-customer',{slug:slug,session:(q.get('session_id')||'').slice(0,200)},function(d){
  if(d.hasDomain!=='yes')return;
  var g=GUIDES[d.registrar]||GUIDES.unknown,box=document.getElementById('guide');box.textContent='';
  var h=document.createElement('h2');h.textContent='One quick step for your domain: '+g.title;box.appendChild(h);
  var ol=document.createElement('ol');ol.style.cssText='margin:10px 0 0 20px;display:grid;gap:8px';
  g.steps.forEach(function(s){var li=document.createElement('li');li.textContent=s;ol.appendChild(li)});box.appendChild(ol);
  var n=document.createElement('p');n.style.cssText='margin-top:12px;font-weight:600';n.textContent=g.note;box.appendChild(n);
  var p=document.createElement('p');p.style.cssText='margin-top:12px;color:var(--muted);font-size:.9rem';p.textContent='We have emailed you these steps too. Once you send the invite, we move the site over to '+(d.domain||'your domain')+'.';box.appendChild(p);
  box.hidden=false});`;
  return page("Thank you | MoreBookedNow", body, script);
}
