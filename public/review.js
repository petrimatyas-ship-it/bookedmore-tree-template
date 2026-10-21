/*
 * Review mode for demo pages.
 *
 * Opened with ?review=<key> on any demo (the key is then remembered on this
 * device until "Exit review"). Pick 👍 / 👎 / ✏️, tap any part of the page,
 * add a note, save. Notes are stored per page through /api/demo/feedback,
 * shown as numbered pins, and listed in a panel. Nothing here is visible
 * to anyone without the key.
 */
(function () {
  if (window.__mbnReview) return;
  window.__mbnReview = true;

  var KEY = "";
  try { KEY = localStorage.getItem("mbn-review") || ""; } catch (e) {}
  if (!KEY) return;

  var segs = location.pathname.split("/").filter(Boolean);
  var SLUG = (segs[0] === "demo" || segs[0] === "modern") ? segs[1] : segs[0];
  if (!SLUG) return;

  var TYPES = {
    like: { icon: "👍", label: "Like", color: "#16a34a", ask: "What do you like about it? (optional)" },
    dislike: { icon: "👎", label: "Don't like", color: "#dc2626", ask: "What's wrong with it?" },
    change: { icon: "✏️", label: "Change", color: "#d97706", ask: "What should it be instead?" }
  };

  var items = [], mode = null, picked = null, hoverEl = null;

  /* ---------- styles ---------- */
  var css = document.createElement("style");
  css.textContent = [
    ".mbnr,.mbnr *{box-sizing:border-box;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:normal;text-transform:none;line-height:1.35}",
    ".mbnr-bar{position:fixed;left:12px;bottom:12px;z-index:2147483600;display:flex;gap:6px;align-items:center;background:#111827;color:#fff;border-radius:16px;padding:6px;box-shadow:0 10px 40px rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.15)}",
    ".mbnr-bar button{all:unset;cursor:pointer;display:flex;align-items:center;gap:6px;height:40px;padding:0 12px;border-radius:11px;font-size:14px;font-weight:600;color:#fff}",
    ".mbnr-bar button:hover{background:rgba(255,255,255,.1)}",
    ".mbnr-bar button.on{background:#fff;color:#111827}",
    ".mbnr-bar .mbnr-t{font-size:11px;font-weight:700;opacity:.6;padding:0 6px 0 8px;text-transform:uppercase;letter-spacing:.08em}",
    "@media(max-width:600px){.mbnr-bar{left:8px;right:8px;bottom:8px;justify-content:space-between}.mbnr-bar .mbnr-t,.mbnr-bar .mbnr-l{display:none}.mbnr-bar button{padding:0 10px}}",
    ".mbnr-hint{position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:2147483600;background:#111827;color:#fff;padding:10px 16px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,.4);max-width:calc(100vw - 24px);text-align:center}",
    ".mbnr-box{position:absolute;z-index:2147483500;pointer-events:none;border:2px solid #d97706;background:rgba(217,119,6,.08);border-radius:6px;transition:all .06s}",
    ".mbnr-pin{position:absolute;z-index:2147483550;min-width:26px;height:26px;padding:0 6px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);cursor:pointer}",
    ".mbnr-pin.done{background:#6b7280!important;opacity:.75}",
    ".mbnr-pop{position:fixed;z-index:2147483640;left:50%;bottom:72px;transform:translateX(-50%);width:min(420px,calc(100vw - 16px));background:#fff;color:#111827;border-radius:16px;padding:16px;box-shadow:0 20px 60px rgba(0,0,0,.5)}",
    ".mbnr-pop h4{margin:0 0 6px;font-size:16px;font-weight:800;color:#111827}",
    ".mbnr-pop .mbnr-snip{font-size:12px;color:#6b7280;background:#f3f4f6;border-radius:8px;padding:6px 8px;margin-bottom:10px;max-height:52px;overflow:hidden}",
    ".mbnr-pop textarea{width:100%;min-height:80px;border:1px solid #d1d5db;border-radius:10px;padding:10px;font-size:15px;color:#111827;background:#fff;resize:vertical}",
    ".mbnr-pop .mbnr-row{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}",
    ".mbnr-pop button{all:unset;cursor:pointer;height:40px;padding:0 14px;border-radius:10px;font-size:14px;font-weight:700;background:#f3f4f6;color:#111827;display:flex;align-items:center}",
    ".mbnr-pop button.mbnr-go{background:#111827;color:#fff;margin-left:auto}",
    ".mbnr-list{position:fixed;z-index:2147483620;right:12px;top:12px;bottom:72px;width:min(380px,calc(100vw - 24px));background:#fff;color:#111827;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.5);display:flex;flex-direction:column;overflow:hidden}",
    ".mbnr-list header{display:flex;align-items:center;gap:8px;padding:14px 16px;border-bottom:1px solid #e5e7eb;font-weight:800;font-size:15px;position:static;background:#fff}",
    ".mbnr-list header button{all:unset;cursor:pointer;margin-left:auto;font-size:13px;font-weight:700;color:#2563eb}",
    ".mbnr-list ol{list-style:none;margin:0;padding:8px;overflow:auto;flex:1}",
    ".mbnr-list li{border:1px solid #e5e7eb;border-radius:12px;padding:10px 12px;margin-bottom:8px;font-size:14px;color:#111827}",
    ".mbnr-list li.done{opacity:.6}",
    ".mbnr-list li b{display:block;margin-bottom:2px}",
    ".mbnr-list li small{display:block;color:#6b7280;font-size:12px;margin-top:4px}",
    ".mbnr-list li .mbnr-acts{display:flex;gap:12px;margin-top:6px}",
    ".mbnr-list li .mbnr-acts a{color:#2563eb;font-size:12px;font-weight:700;cursor:pointer;text-decoration:none}",
    ".mbnr-empty{padding:24px 16px;color:#6b7280;font-size:14px}",
    ".mbnr-flash{outline:3px solid #2563eb!important;outline-offset:3px!important;transition:outline-color .3s}"
  ].join("\n");
  document.head.appendChild(css);

  /* ---------- helpers ---------- */
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function inUI(t) { return !!(t && t.closest && t.closest(".mbnr")); }

  function selectorOf(node) {
    var parts = [];
    while (node && node.nodeType === 1 && node !== document.body && parts.length < 14) {
      if (node.id && /^[A-Za-z][\w-]*$/.test(node.id)) { parts.unshift("#" + node.id); break; }
      var tag = node.tagName.toLowerCase(), i = 1, sib = node;
      while ((sib = sib.previousElementSibling)) if (sib.tagName === node.tagName) i++;
      parts.unshift(tag + ":nth-of-type(" + i + ")");
      node = node.parentElement;
    }
    return parts.join(" > ");
  }
  function textOf(node) {
    var t = (node.innerText || node.textContent || "").replace(/\s+/g, " ").trim();
    if (!t && node.tagName === "IMG") t = "[image] " + (node.getAttribute("alt") || node.getAttribute("src") || "");
    if (!t) { var img = node.querySelector && node.querySelector("img"); if (img) t = "[image] " + (img.getAttribute("alt") || ""); }
    return t.slice(0, 280);
  }
  function sectionOf(node) {
    var s = node.closest && node.closest("section,header,footer,nav");
    if (!s) return "";
    var h = s.querySelector("h1,h2,h3");
    var name = h ? h.textContent.replace(/\s+/g, " ").trim() : "";
    return (s.id ? "#" + s.id + " " : "") + (name || s.tagName.toLowerCase()).slice(0, 100);
  }
  /* A tap on an icon or a word lands on something tiny; climb to a visible block. */
  function usable(node) {
    while (node && node !== document.body) {
      if (node.nodeType === 1 && !(node instanceof SVGElement && node.tagName.toLowerCase() !== "svg")) {
        var r = node.getBoundingClientRect();
        if (r.width >= 24 && r.height >= 16) return node;
      }
      node = node.parentNode;
    }
    return null;
  }
  function find(item) {
    var n = null;
    try { n = document.querySelector(item.selector); } catch (e) {}
    if (n && item.text && textOf(n).slice(0, 40) !== item.text.slice(0, 40)) {
      // The page changed; fall back to the element carrying the same text.
      var want = item.text.slice(0, 40), all = document.querySelectorAll("h1,h2,h3,h4,p,a,button,li,span,div,figure,img,section");
      for (var i = 0; i < all.length; i++) if (textOf(all[i]).slice(0, 40) === want) { n = all[i]; break; }
    }
    return n;
  }

  /* ---------- api ---------- */
  function api(body) {
    body.slug = SLUG; body.key = KEY;
    return fetch("/api/demo/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || "Failed"); return j; }); });
  }
  function load() {
    return fetch("/api/demo/feedback?slug=" + encodeURIComponent(SLUG) + "&key=" + encodeURIComponent(KEY), { cache: "no-store" })
      .then(function (r) { if (r.status === 403) { exit(); throw new Error("Review key not accepted"); } return r.json(); })
      .then(function (j) { items = j.items || []; draw(); });
  }

  /* ---------- toolbar ---------- */
  var bar = el("div", "mbnr mbnr-bar");
  bar.innerHTML = '<span class="mbnr-t">Review</span>' +
    '<button data-m="like" title="Mark something you like">👍<span class="mbnr-l">Like</span></button>' +
    '<button data-m="dislike" title="Mark something you don\'t like">👎<span class="mbnr-l">Don\'t like</span></button>' +
    '<button data-m="change" title="Mark something to change">✏️<span class="mbnr-l">Change</span></button>' +
    '<button data-a="list" title="All notes">📋<span class="mbnr-n">0</span></button>' +
    '<button data-a="exit" title="Leave review mode">✕</button>';
  document.body.appendChild(bar);
  var hint = el("div", "mbnr mbnr-hint"); hint.style.display = "none"; document.body.appendChild(hint);
  var box = el("div", "mbnr mbnr-box"); box.style.display = "none"; document.body.appendChild(box);
  var pinLayer = el("div", "mbnr"); document.body.appendChild(pinLayer);

  bar.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.m) setMode(mode === b.dataset.m ? null : b.dataset.m);
    else if (b.dataset.a === "list") toggleList();
    else if (b.dataset.a === "exit") { if (confirm("Leave review mode on this device? Your notes stay saved.")) exit(); }
  });

  function setMode(m) {
    mode = m; closePop();
    [].forEach.call(bar.querySelectorAll("[data-m]"), function (b) { b.classList.toggle("on", b.dataset.m === m); });
    if (m) { hint.textContent = TYPES[m].icon + " Tap the part of the page you mean"; hint.style.display = ""; box.style.borderColor = TYPES[m].color; }
    else { hint.style.display = "none"; box.style.display = "none"; }
  }
  function exit() {
    try { localStorage.removeItem("mbn-review"); } catch (e) {}
    [bar, hint, box, pinLayer, css].forEach(function (n) { n.remove(); });
    closePop(); closeList();
  }

  /* ---------- picking ---------- */
  function outline(node) {
    if (!node) { box.style.display = "none"; return; }
    var r = node.getBoundingClientRect();
    box.style.display = ""; box.style.left = (r.left + scrollX - 3) + "px"; box.style.top = (r.top + scrollY - 3) + "px";
    box.style.width = (r.width + 6) + "px"; box.style.height = (r.height + 6) + "px";
  }
  document.addEventListener("mousemove", function (e) {
    if (!mode || pop || inUI(e.target)) return;
    hoverEl = usable(e.target); outline(hoverEl);
  }, true);
  function block(e) { if (mode && !inUI(e.target)) { e.preventDefault(); e.stopPropagation(); } }
  ["pointerdown", "mousedown", "touchstart", "submit", "focusin"].forEach(function (t) { document.addEventListener(t, function (e) { if (mode && !pop && !inUI(e.target) && t !== "touchstart") block(e); }, true); });
  document.addEventListener("click", function (e) {
    if (!mode || inUI(e.target)) return;
    e.preventDefault(); e.stopPropagation();
    if (pop) return;
    var node = usable(e.target); if (!node) return;
    openPop(node);
  }, true);

  /* ---------- note pop-up ---------- */
  var pop = null;
  function openPop(node) {
    picked = node; outline(node);
    var t = TYPES[mode];
    pop = el("div", "mbnr mbnr-pop");
    pop.innerHTML = '<h4>' + t.icon + ' ' + t.label + '</h4><div class="mbnr-snip">' + esc(textOf(node) || selectorOf(node)) + '</div>' +
      '<textarea placeholder="' + esc(t.ask) + '"></textarea>' +
      '<div class="mbnr-row"><button data-p="bigger">⬆ Bigger area</button><button data-p="smaller">⬇ Smaller</button><button data-p="cancel">Cancel</button><button class="mbnr-go" data-p="save">Save</button></div>';
    document.body.appendChild(pop);
    var ta = pop.querySelector("textarea"); setTimeout(function () { ta.focus(); }, 30);
    var trail = [];
    pop.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var a = b.dataset.p;
      if (a === "cancel") { closePop(); return; }
      if (a === "bigger" && picked.parentElement && picked.parentElement !== document.body) { trail.push(picked); picked = picked.parentElement; refresh(); }
      if (a === "smaller" && trail.length) { picked = trail.pop(); refresh(); }
      if (a === "save") save(ta.value.trim(), b);
    });
    function refresh() { outline(picked); pop.querySelector(".mbnr-snip").textContent = textOf(picked) || selectorOf(picked); }
  }
  function closePop() { if (pop) { pop.remove(); pop = null; } picked = null; box.style.display = "none"; }
  function save(note, btn) {
    if (mode === "dislike" || mode === "change") { if (!note) { pop.querySelector("textarea").focus(); pop.querySelector("textarea").style.borderColor = "#dc2626"; return; } }
    btn.textContent = "Saving…";
    var item = { type: mode, note: note, selector: selectorOf(picked), text: textOf(picked), section: sectionOf(picked), page: location.pathname, width: innerWidth };
    api({ action: "add", item: item }).then(function (j) {
      items.push(j.item); closePop(); setMode(null); draw(); if (listEl) renderList();
    }).catch(function (e) { btn.textContent = "Save"; alert("Could not save: " + e.message); });
  }

  /* ---------- pins ---------- */
  function draw() {
    bar.querySelector(".mbnr-n").textContent = items.filter(function (i) { return i.status !== "done"; }).length;
    pinLayer.innerHTML = "";
    items.forEach(function (it, i) {
      if (it.page && it.page !== location.pathname) return;
      var n = find(it); if (!n) return;
      var r = n.getBoundingClientRect(); if (!r.width && !r.height) return;
      var p = el("div", "mbnr-pin" + (it.status === "done" ? " done" : ""), (it.status === "done" ? "✓" : "") + (i + 1));
      p.style.background = TYPES[it.type].color;
      p.style.left = Math.max(2, r.left + scrollX - 8) + "px"; p.style.top = Math.max(2, r.top + scrollY - 10) + "px";
      p.title = TYPES[it.type].label + ": " + (it.note || "");
      p.addEventListener("click", function (e) { e.stopPropagation(); openList(); setTimeout(function () { var li = listEl && listEl.querySelector('[data-id="' + it.id + '"]'); if (li) { li.scrollIntoView({ block: "nearest" }); li.style.borderColor = "#2563eb"; } }, 50); });
      pinLayer.appendChild(p);
    });
  }
  var t0; function later() { clearTimeout(t0); t0 = setTimeout(draw, 150); }
  addEventListener("resize", later); addEventListener("load", later);
  if ("ResizeObserver" in window) new ResizeObserver(later).observe(document.body);

  /* ---------- list ---------- */
  var listEl = null;
  function toggleList() { if (listEl) closeList(); else openList(); }
  function openList() { if (!listEl) { listEl = el("div", "mbnr mbnr-list"); document.body.appendChild(listEl); } renderList(); }
  function closeList() { if (listEl) { listEl.remove(); listEl = null; } }
  function renderList() {
    var open = items.filter(function (i) { return i.status !== "done"; }).length;
    listEl.innerHTML = '<header>Notes on this page · ' + open + ' open<button data-l="copy">Copy all</button><button data-l="close" style="margin-left:12px;color:#111827">✕</button></header>';
    var ol = el("ol");
    if (!items.length) ol.appendChild(el("div", "mbnr-empty", "No notes yet. Pick 👍, 👎 or ✏️ below, then tap part of the page."));
    items.forEach(function (it, i) {
      var li = el("li", it.status === "done" ? "done" : "");
      li.dataset.id = it.id;
      li.innerHTML = '<b>' + (i + 1) + '. ' + TYPES[it.type].icon + ' ' + TYPES[it.type].label + (it.status === "done" ? " · ✅ done" : "") + '</b>' +
        esc(it.note || "(no note)") + '<small>' + esc((it.section ? it.section + " · " : "") + (it.text || "").slice(0, 120)) + '</small>' +
        '<div class="mbnr-acts"><a data-l="show">Show</a><a data-l="toggle">' + (it.status === "done" ? "Reopen" : "Mark done") + '</a><a data-l="del">Delete</a></div>';
      ol.appendChild(li);
    });
    listEl.appendChild(ol);
  }
  document.addEventListener("click", function (e) {
    if (!listEl || !listEl.contains(e.target)) return;
    var a = e.target.closest("[data-l]"); if (!a) return;
    var act = a.dataset.l, li = a.closest("li"), it = li && items.filter(function (x) { return x.id === li.dataset.id; })[0];
    if (act === "close") closeList();
    else if (act === "copy") {
      var txt = "Review notes for " + location.origin + location.pathname + "\n\n" + items.map(function (x, i) {
        return (i + 1) + ". " + TYPES[x.type].label.toUpperCase() + (x.status === "done" ? " (done)" : "") + ": " + (x.note || "-") + "\n   where: " + (x.section || "") + " | " + (x.text || "").slice(0, 120);
      }).join("\n");
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { a.textContent = "Copied ✓"; }, function () { prompt("Copy:", txt); });
    } else if (act === "show" && it) {
      var n = find(it); if (n) { n.scrollIntoView({ block: "center", behavior: "smooth" }); n.classList.add("mbnr-flash"); setTimeout(function () { n.classList.remove("mbnr-flash"); }, 1600); if (innerWidth < 700) closeList(); }
    } else if (act === "toggle" && it) {
      var st = it.status === "done" ? "open" : "done";
      api({ action: "status", id: it.id, status: st }).then(function () { it.status = st; draw(); renderList(); });
    } else if (act === "del" && it) {
      if (!confirm("Delete this note?")) return;
      api({ action: "delete", id: it.id }).then(function () { items = items.filter(function (x) { return x.id !== it.id; }); draw(); renderList(); });
    }
  }, true);

  load().catch(function () {});
})();
