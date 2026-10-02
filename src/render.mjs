// Gera os slides 1080x1350 de src/posts.json em v2/<id>/slideN.jpg.
// Uso: node src/render.mjs [id ...]   (sem id = todos)
// Requer playwright-core e um Chromium (CHROMIUM_PATH ou /opt/pw-browsers/chromium).
import { readFileSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const SRC = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SRC, "..");
const { posts } = JSON.parse(readFileSync(join(SRC, "posts.json"), "utf8"));
const temas = JSON.parse(readFileSync(join(SRC, "temas.json"), "utf8"));
const only = process.argv.slice(2);
// Fontes locais: o Chromium headless nao usa o proxy, entao nada de Google Fonts remoto.
const FONTS = readFileSync(join(SRC, "fonts", "fonts.css"), "utf8").replace(
  /url\(([^)]+)\)/g,
  (_, f) => `url(${pathToFileURL(join(SRC, "fonts", f)).href})`
);

const esc = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function css(t) {
  return `
  ${FONTS}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1080px;height:1350px}
  body{font-family:'${t.sans}',Arial,sans-serif;position:relative;overflow:hidden}
  .escuro{background:${t.escuro};color:${t.textoEscuro}}
  .claro{background:${t.claro};color:${t.textoClaro}}
  .pad{position:absolute;inset:200px 80px 130px 80px;display:flex;flex-direction:column;justify-content:center}
  .pad>.kicker{position:absolute;top:-120px;left:0;right:0}
  .kicker{display:flex;align-items:center;gap:22px;font-weight:700;font-size:26px;letter-spacing:.24em;text-transform:uppercase;color:${t.acento}}
  .claro .kicker{color:${t.acentoForte}}
  .kicker:after{content:"";flex:1;height:2px;background:${t.acento}}
  h1,h2,.serif{font-family:'${t.serif}',serif;font-weight:600;line-height:1.08;letter-spacing:-.01em}
  h1{font-size:96px}
  .capa-texto.solo h1{font-size:124px}
  .capa-texto.solo .sub{font-size:48px}
  h2{font-size:84px}
  .dest{color:${t.acento}}
  .claro .dest{color:${t.acentoForte}}
  .sub{font-size:40px;margin-top:34px;opacity:.9}
  .corpo{font-size:46px;line-height:1.45;margin-top:56px}
  .rodape{position:absolute;left:80px;right:80px;bottom:44px;display:flex;justify-content:space-between;font-weight:700;font-size:24px;letter-spacing:.2em;color:${t.suave}}
  .escuro .rodape{color:${t.textoEscuro};opacity:.85}
  .item{display:flex;gap:30px;align-items:flex-start;padding:38px 0;border-bottom:2px solid ${t.acento}55}
  .num{font-family:'${t.serif}',serif;font-size:66px;color:${t.acentoForte};min-width:82px;line-height:1}
  .escuro .num{color:${t.acento}}
  .item b{display:block;font-size:48px;margin-bottom:10px}
  .item span{font-size:39px;line-height:1.4;opacity:.88}
  .card{border:2px solid ${t.acento};border-radius:26px;padding:38px 44px;margin-top:40px}
  .card .serif{font-size:50px;text-transform:uppercase;color:${t.acentoForte};letter-spacing:.02em}
  .escuro .card .serif{color:${t.acento}}
  .card div+div{font-size:41px;margin-top:10px;line-height:1.35}
  .fecho{font-family:'${t.serif}',serif;font-size:56px;margin-top:56px;color:${t.acentoForte}}
  .acao{display:inline-block;margin-top:70px;padding:30px 46px;border:2px solid ${t.acento};border-radius:999px;font-weight:700;font-size:34px;letter-spacing:.04em;color:${t.acento}}
  .foto{position:absolute;left:0;top:0;width:1080px;height:760px;background-size:cover;background-position:center top}
  .foto:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,${t.escuro} 100%)}
  .capa-texto{position:absolute;left:80px;right:80px;bottom:150px}
  .capa-texto.solo{bottom:auto;top:50%;transform:translateY(-50%)}
  .marca{position:absolute;right:-60px;top:-140px;font-family:'${t.serif}',serif;font-size:720px;line-height:1;color:${t.acento};opacity:.10}
  .capa-texto h1{margin-top:40px}
  `;
}

function lista(itens) {
  return itens
    .map(
      ([a, b], i) =>
        `<div class="item"><div class="num">${String(i + 1).padStart(2, "0")}</div><div><b>${esc(a)}</b><span>${esc(b)}</span></div></div>`
    )
    .join("");
}

function corpoSlide(s, post) {
  switch (s.tipo) {
    case "capa": {
      const foto = s.foto
        ? `<div class="foto" style="background-image:url('${pathToFileURL(join(SRC, "fotos", post.id + ".jpg"))}')"></div>`
        : "";
      const marca = s.foto ? "" : `<div class="marca">IA</div>`;
      return `${marca}${foto}<div class="capa-texto${s.foto ? "" : " solo"}"><div class="kicker">${esc(s.kicker)}</div>
        <h1>${esc(s.titulo)}<br><span class="dest">${esc(s.destaque)}</span></h1>
        ${s.sub ? `<div class="sub">${esc(s.sub)}</div>` : ""}</div>`;
    }
    case "texto":
      return `<div class="pad"><div class="kicker">${esc(s.kicker)}</div><h2>${esc(s.titulo)}</h2><div class="corpo">${esc(s.corpo)}</div></div>`;
    case "lista":
      return `<div class="pad"><div class="kicker">${esc(s.kicker)}</div><h2>${esc(s.titulo)}</h2><div style="margin-top:36px">${lista(s.itens)}</div></div>`;
    case "cartoes":
      return `<div class="pad"><div class="kicker">${esc(s.kicker)}</div><h2>${esc(s.titulo)}</h2>
        ${s.itens.map(([a, b]) => `<div class="card"><div class="serif">${esc(a)}</div><div>${esc(b)}</div></div>`).join("")}
        ${s.fecho ? `<div class="fecho">${esc(s.fecho)}</div>` : ""}</div>`;
    case "cta":
      return `<div class="pad"><div class="kicker">${esc(s.kicker)}</div><h2 style="font-size:78px">${esc(s.titulo)}</h2>
        ${s.corpo ? `<div class="corpo">${esc(s.corpo)}</div>` : ""}<div class="acao">${esc(s.acao)} →</div></div>`;
    default:
      throw new Error(`tipo de slide desconhecido: ${s.tipo} em ${post.id}`);
  }
}

function html(post, s, i) {
  const t = temas[post.tema];
  if (!t) throw new Error(`tema desconhecido: ${post.tema}`);
  const n = post.slides.length;
  const fundo = i === 0 || i === n - 1 ? "escuro" : "claro";
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${css(t)}</style></head>
  <body class="${fundo}">${corpoSlide(s, post)}
  <div class="rodape"><span>${esc(t.assinatura)}</span><span>${String(i + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}</span></div></body></html>`;
}

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
for (const post of posts) {
  if (only.length && !only.includes(post.id)) continue;
  if (post.slides.length > 6) throw new Error(`${post.id}: mais de 6 slides`);
  const out = join(ROOT, "v2", post.id);
  mkdirSync(out, { recursive: true });
  for (const [i, s] of post.slides.entries()) {
    const file = join(out, `.tmp-slide${i + 1}.html`);
    writeFileSync(file, html(post, s, i));
    await page.goto(pathToFileURL(file).href, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() =>
      [...document.querySelectorAll(".pad *,.capa-texto *")].some(
        (el) => el.getBoundingClientRect().bottom > 1350 - 100
      )
    );
    if (overflow) console.warn(`AVISO ${post.id} slide ${i + 1}: texto encosta no rodape`);
    await page.screenshot({ path: join(out, `slide${i + 1}.jpg`), type: "jpeg", quality: 92 });
    rmSync(file);
  }
  console.log(`ok ${post.id} (${post.slides.length} slides)`);
}
await browser.close();
