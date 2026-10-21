/**
 * A tiny template engine for the hand-built demo pages.
 *
 *   {{path.to.value}}           inserts the value as is (data is our own, written as HTML)
 *   {{json path}}               inserts JSON.stringify(value), for use inside <script>
 *   {{#each list}}…{{/each}}    repeats for each item; inside, {{this}} is the item and
 *                               {{field}} looks in the item first, then the outer data
 *   {{#if path}}…{{else}}…{{/if}}  shown when the value is truthy (non-empty for lists)
 *
 * A missing value is an error, so a typo in a data file fails the build
 * instead of shipping an empty gap.
 */

function tokenize(src) {
  const re = /\{\{\s*([#/]?)(each|if|else|json)?\s*([^}]*?)\s*\}\}/g;
  const out = [];
  let last = 0, m;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push({ t: "text", v: src.slice(last, m.index) });
    const [, sigil, word, arg] = m;
    if (sigil === "#") out.push({ t: "open", kind: word, arg });
    else if (sigil === "/") out.push({ t: "close", kind: word });
    else if (word === "else") out.push({ t: "else" });
    else if (word === "json") out.push({ t: "json", arg });
    else out.push({ t: "var", arg: (word || "") + arg });
    last = re.lastIndex;
  }
  if (last < src.length) out.push({ t: "text", v: src.slice(last) });
  return out;
}

function parse(tokens) {
  const root = { kids: [] };
  const stack = [root];
  for (const tok of tokens) {
    const top = stack[stack.length - 1];
    if (tok.t === "open") {
      const node = { t: tok.kind, arg: tok.arg, kids: [], alt: [] };
      (top.inElse ? top.alt : top.kids).push(node);
      stack.push(node);
    } else if (tok.t === "else") {
      top.inElse = true;
    } else if (tok.t === "close") {
      if (stack.length < 2 || top.t !== tok.kind) throw new Error(`Unmatched {{/${tok.kind}}}`);
      stack.pop();
    } else {
      (top.inElse ? top.alt : top.kids).push(tok);
    }
  }
  if (stack.length !== 1) throw new Error(`Unclosed {{#${stack[stack.length - 1].t}}}`);
  return root.kids;
}

function lookup(scopes, path) {
  if (path === "this") return scopes[0];
  const parts = path.split(".");
  for (const scope of scopes) {
    if (scope !== null && typeof scope === "object" && parts[0] in scope) {
      let v = scope;
      for (const p of parts) {
        if (v === null || v === undefined || !(p in Object(v))) return undefined;
        v = v[p];
      }
      return v;
    }
  }
  return undefined;
}

function renderNodes(nodes, scopes) {
  let s = "";
  for (const n of nodes) {
    if (n.t === "text") s += n.v;
    else if (n.t === "var") {
      const v = lookup(scopes, n.arg);
      if (v === undefined || v === null) throw new Error(`Missing value: ${n.arg}`);
      if (typeof v === "object") throw new Error(`Not a text value: ${n.arg}`);
      s += String(v);
    } else if (n.t === "json") {
      const v = lookup(scopes, n.arg);
      if (v === undefined) throw new Error(`Missing value: ${n.arg}`);
      s += JSON.stringify(v).replace(/</g, "\\u003c");
    } else if (n.t === "each") {
      const list = lookup(scopes, n.arg);
      if (!Array.isArray(list)) throw new Error(`Not a list: ${n.arg}`);
      list.forEach((item, i) => {
        s += renderNodes(n.kids, [item, { "@index": i, "@first": i === 0, "@last": i === list.length - 1 }, ...scopes]);
      });
    } else if (n.t === "if") {
      const v = lookup(scopes, n.arg);
      const on = Array.isArray(v) ? v.length > 0 : Boolean(v);
      s += renderNodes(on ? n.kids : n.alt, scopes);
    }
  }
  return s;
}

export function render(template, data) {
  return renderNodes(parse(tokenize(template)), [data]);
}
