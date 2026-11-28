/**
 * The offer a prospect sees on their preview site: "Make it live · $99/mo".
 *
 *   /<slug>/live    the offer, one phone screen: what they get, the price, Start now
 *                   (Stripe) and Ask me a question (a short form that emails the owner)
 *   /welcome        Stripe's success page: three questions that start the work
 *   /about-us       who we are, for "from where?" and "company information"
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
export const PRICE_LINE = `${PRICE} / month. No setup fee, no contract, cancel anytime.`;
export const REFUND_LINE = "Not happy in the first 30 days? Full refund, no questions asked.";
export const OWNS_LINE = "The site and domain are yours. If you ever stop, you keep them.";
/** The person behind it, named on the who-we-are page. */
export const OWNER_FIRST_NAME = "Mati";

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
function ownerForm(f,kind,extra){f.addEventListener('submit',async function(e){e.preventDefault();
  var d={kind:kind};[].forEach.call(f.elements,function(x){if(x.name&&(x.type!=='radio'||x.checked))d[x.name]=x.value});Object.assign(d,extra||{});
  var ok=f.parentNode.querySelector('.done'),b=f.querySelector('[type=submit]');b.disabled=true;
  try{var r=await fetch('/api/owner-message',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});if(!r.ok)throw 0;
    ok.className='done';ok.textContent=f.dataset.thanks;ok.style.display='block';f.hidden=true}
  catch(_){ok.className='done err';ok.textContent='Sorry, that did not go through. Please try again in a minute.';ok.style.display='block';b.disabled=false}})}
`;

/** The visit log, as the site pages keep it: one event, attached to the visit the prospect came from. */
const TRACK_SCRIPT = (slug: string) => `
var SLUG=${JSON.stringify(slug)},VISIT=(new URLSearchParams(location.search).get('v')||'').replace(/[^a-z0-9]/g,'').slice(0,16);
function track(ev){var fresh=!VISIT;if(fresh)VISIT=Math.random().toString(36).slice(2,12);
  function one(e){var body=JSON.stringify({slug:SLUG,event:e,page:location.pathname,visit:VISIT});try{if(!(navigator.sendBeacon&&navigator.sendBeacon('/api/demo/track',new Blob([body],{type:'application/json'}))))fetch('/api/demo/track',{method:'POST',headers:{'Content-Type':'application/json'},body:body,keepalive:true})}catch(_){}}
  if(fresh)one('view');one(ev)}
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
  <div class="fine"><p>Live on your domain within 3 days.</p><p>${REFUND_LINE}</p><p>${OWNS_LINE}</p></div>
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
</main>
<p class="foot"><a href="/about-us?site=${slug}">Who we are</a></p>
</div>`;
  const script = `${TRACK_SCRIPT(slug)}${FORM_SCRIPT}
var f=document.getElementById('askf');ownerForm(f,'question',{slug:SLUG});
function openAsk(){f.hidden=false;var i=f.querySelector('input[name=email]');try{f.scrollIntoView({block:'start',behavior:'smooth'})}catch(_){}setTimeout(function(){i.focus()},250)}
document.getElementById('ask').addEventListener('click',function(){track('cta:ask');openAsk()});
var s=document.getElementById('start');s.addEventListener('click',function(e){track('cta:start-now');
  try{localStorage.setItem('mbn-start',JSON.stringify({slug:SLUG,at:Date.now()}))}catch(_){}
  if(s.tagName==='BUTTON'){openAsk()}});`;
  return page(`Make it live | ${businessHtml}`, body, script);
}

export function welcomePage(): string {
  const body = `<div class="wrap">
<div class="top"><b>MoreBookedNow</b><a href="/about-us">Who we are</a></div>
<main class="card">
  <h1>Thank you, you&#39;re in</h1>
  <p class="for" id="for">Three quick questions and we start on your site.</p>
  <form id="wf" data-thanks="Got it. Your site will be live on your domain within 3 days. We will be in touch as soon as it is.">
    <fieldset style="border:0;display:grid;gap:8px"><legend style="font-weight:600;font-size:.92rem;margin-bottom:6px">Do you have a domain?</legend>
      <div class="radio"><label><input type="radio" name="hasDomain" value="yes" required> Yes</label><label><input type="radio" name="hasDomain" value="no"> No, get me one</label></div></fieldset>
    <label>Which one?<input name="domain" placeholder="yourbusiness.com" maxlength="200" autocapitalize="off"></label>
    <label>Anything you&#39;d like changed?<textarea name="changes" maxlength="3000" placeholder="Photos, words, services, prices, anything"></textarea></label>
    <label>Best phone number for texts<input name="phone" type="tel" autocomplete="tel" required maxlength="40"></label>
    <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button type="submit" class="btn go">Send</button>
  </form>
  <div class="done" role="status"></div>
</main>
</div>`;
  const script = `${FORM_SCRIPT}
var q=new URLSearchParams(location.search),slug=(q.get('slug')||'').toLowerCase();
try{var st=JSON.parse(localStorage.getItem('mbn-start')||'null');if(!slug&&st&&st.slug)slug=st.slug}catch(_){}
ownerForm(document.getElementById('wf'),'new-customer',{slug:slug,session:(q.get('session_id')||'').slice(0,200)});`;
  return page("Thank you | MoreBookedNow", body, script);
}

export function aboutUsPage(slug: string | null): string {
  const back = slug ? `<a href="/${slug}">&larr; Back to your site</a>` : `<span></span>`;
  const body = `<div class="wrap">
<div class="top">${back}<b>MoreBookedNow</b></div>
<main class="card">
  <h1>Who we are</h1>
  <p class="for">MoreBookedNow</p>
  <h2>What we do</h2>
  <p>We build and run websites for local service businesses: pressure washers, tree services, landscapers, detailers, roofers and more. We build the site, put it on your domain, connect it to your Google Business Profile, and keep it running: changes and fixes whenever you need them.</p>
  <h2>Who you work with</h2>
  <p>I&#39;m ${OWNER_FIRST_NAME}. I build every site myself. We are based in Europe and work with businesses across the US, by email and text.</p>
  <h2>The deal</h2>
  <p>${PRICE_LINE}</p>
  <p>${REFUND_LINE}</p>
  <p>${OWNS_LINE}</p>
  <h2>Company information</h2>
  <p><a href="https://morebookednow.com/imprint" target="_blank" rel="noopener">morebookednow.com/imprint</a></p>
  ${slug ? `<div class="btns"><a class="btn go" href="/${slug}/live">See the offer</a></div>` : ""}
</main>
</div>`;
  return page("Who we are | MoreBookedNow", body);
}
