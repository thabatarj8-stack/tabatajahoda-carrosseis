// Teste de direcao visual: 1 capa por estilo, com as cores/fontes do briefing.
// Saida: teste/curso-capa.jpg e teste/autoridade-capa.jpg
import { readFileSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const SRC = dirname(fileURLToPath(import.meta.url));
const OUT = join(SRC, "..", "teste");
const url = (p) => pathToFileURL(join(SRC, p)).href;
const FONTS = readFileSync(join(SRC, "fonts", "fonts.css"), "utf8").replace(
  /url\(([^)]+)\)/g,
  (_, f) => `url(${url("fonts/" + f)})`
);
const base = `*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1350px;overflow:hidden}body{position:relative}`;

// Contorno "adesivo" em volta do recorte (8 sombras sem desfoque).
const contorno = (cor, r) =>
  [[r, 0], [-r, 0], [0, r], [0, -r], [r * 0.7, r * 0.7], [-r * 0.7, r * 0.7], [r * 0.7, -r * 0.7], [-r * 0.7, -r * 0.7]]
    .map(([x, y]) => `drop-shadow(${x}px ${y}px 0 ${cor})`)
    .join(" ");

// ---------- CURSO: vinho + marfim + Playfair + Inter (estilo recorte/adesivo) ----------
const curso = `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}${base}
body{background:#2E0512;font-family:Inter,sans-serif;color:#FBF7EF}
.glow{position:absolute;inset:0;background:radial-gradient(900px 700px at 78% 70%,#5A0E28 0%,#2E0512 70%)}
.foto{position:absolute;right:0px;bottom:120px;height:1000px;filter:${contorno("#FBF7EF", 10)} drop-shadow(0 30px 40px rgba(0,0,0,.35))}
.kicker{position:absolute;left:80px;top:96px;font-weight:600;font-size:24px;letter-spacing:.26em;text-transform:uppercase;color:#CDA75A}
h1{position:absolute;left:76px;top:150px;width:520px;font-family:'Playfair Display',serif;font-weight:600;font-size:96px;line-height:.98;letter-spacing:-.01em}
h1 em{font-style:italic;font-weight:400;color:#EBD39A}
.sub{position:absolute;left:80px;top:640px;font-family:'Playfair Display',serif;font-style:italic;font-size:54px;color:#FBF7EF}
.sub span{position:relative;color:#EBD39A}
svg{position:absolute;overflow:visible}
.rodape{position:absolute;left:80px;right:80px;bottom:48px;display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:22px;letter-spacing:.22em;color:#E2D2B9}
.logo{background:#FBF7EF;color:#4E1C23;border-radius:14px;padding:16px 22px;font-size:18px;letter-spacing:.12em;border:2px dashed #BB9B62}
</style></head><body>
<div class="glow"></div>
<img class="foto" src="${url("fotos/recortes/selfie-cafe.png")}">
<div class="kicker">IA para profissionais da beleza</div>
<h1>Terça vazia <em>não é falta de cliente.</em></h1>
<div class="sub">É falta de <span>convite.</span></div>
<!-- circulo feito a mao em volta de "convite" -->
<svg style="left:292px;top:624px" width="250" height="100"><path d="M18 52 C 20 12, 230 6, 238 46 C 244 84, 40 96, 14 64 C 4 50, 30 30, 70 24" fill="none" stroke="#CDA75A" stroke-width="4" stroke-linecap="round"/></svg>
<!-- seta curva apontando para a foto -->
<svg style="left:120px;top:760px" width="330" height="220"><path d="M10 10 C 40 140, 170 190, 300 150" fill="none" stroke="#FBF7EF" stroke-width="4" stroke-linecap="round"/><path d="M272 128 L 302 150 L 268 172" fill="none" stroke="#FBF7EF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
<div style="position:absolute;left:84px;top:990px;width:330px;font-size:30px;line-height:1.35;color:#E2D2B9">3 mensagens para mandar na segunda de manhã</div>
<!-- risquinhos de brilho -->
<svg style="left:850px;top:150px" width="120" height="120"><g stroke="#EBD39A" stroke-width="5" stroke-linecap="round"><path d="M60 10 L60 40"/><path d="M20 30 L40 52"/><path d="M100 30 L80 52"/></g></svg>
<div class="rodape"><div class="logo">LOGO DO CURSO AQUI</div><span>01 / 05</span></div>
</body></html>`;

// ---------- AUTORIDADE: ameixa + creme + Manrope + DM Serif Display + DM Sans (editorial) ----------
const autoridade = `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}${base}
body{background:#160d19;font-family:'DM Sans',sans-serif;color:#fff5eb}
.foto{position:absolute;inset:0;background:url('${url("fotos/novas/poltrona-olhar.jpg")}') center 18%/cover;filter:saturate(.75) contrast(1.05)}
.veu{position:absolute;inset:0;background:linear-gradient(180deg,rgba(22,13,25,.15) 0%,rgba(22,13,25,.2) 40%,rgba(22,13,25,.92) 68%,#160d19 100%)}
.card{position:absolute;width:380px;padding:22px 26px;border-radius:22px;background:rgba(38,21,36,.42);border:1.5px solid rgba(255,245,235,.19);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 20px 50px rgba(0,0,0,.25)}
.card small{display:block;font-weight:700;font-size:17px;letter-spacing:.2em;text-transform:uppercase;color:#d9b88e;margin-bottom:8px}
.card div{font-size:26px;line-height:1.3;color:#fff5eb}
.card .ok{color:#cdb8c9}
.kicker{position:absolute;left:80px;top:842px;font-weight:700;font-size:22px;letter-spacing:.28em;text-transform:uppercase;color:#db718a}
h1{position:absolute;left:74px;right:70px;top:884px;font-family:Manrope,sans-serif;font-weight:600;font-size:104px;line-height:.96;letter-spacing:-.06em}
h1 em{font-family:'DM Serif Display',serif;font-style:italic;font-weight:400;letter-spacing:-.02em;color:#ff9f87}
.rodape{position:absolute;left:80px;right:80px;bottom:46px;display:flex;justify-content:space-between;font-weight:500;font-size:22px;letter-spacing:.22em;color:#cdb8c9}
.rodape b{font-family:'DM Serif Display',serif;font-weight:400;letter-spacing:.02em;font-size:28px;color:#fff5eb}
</style></head><body>
<div class="foto"></div><div class="veu"></div>
<div class="card" style="left:620px;top:120px;transform:rotate(2deg)"><small>Resposta final</small><div class="ok">✓ Correta</div></div>
<div class="card" style="left:40px;top:300px;transform:rotate(-3deg)"><small>Etapa 3</small><div>Consultou um dado sem permissão</div></div>
<div class="card" style="left:640px;top:470px;transform:rotate(2.5deg)"><small>Etapa 5</small><div>Repetiu a mesma ação duas vezes</div></div>
<div class="kicker">Pesquisa em agentes de IA</div>
<h1>A resposta certa pode esconder o <em>caminho errado.</em></h1>
<div class="rodape"><b>Tabata Jahoda</b><span>01 / 05</span></div>
</body></html>`;

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
for (const [nome, html] of [["curso-capa", curso], ["autoridade-capa", autoridade]]) {
  const f = join(OUT, `.${nome}.html`);
  writeFileSync(f, html);
  await page.goto(pathToFileURL(f).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(OUT, `${nome}.jpg`), type: "jpeg", quality: 92 });
  rmSync(f);
  console.log("ok", nome);
}
await browser.close();
