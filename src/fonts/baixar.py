# Baixa as fontes oficiais do briefing (Google Fonts) para uso offline no render.
import re, subprocess, urllib.request
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
FAMILIAS = [
    "Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500",  # curso: titulos
    "Inter:wght@300;400;500;600;700",                                  # curso: texto
    "Manrope:wght@600;700",                                            # perfil: titulos
    "DM+Serif+Display:ital@0;1",                                       # perfil: marca/italico
    "DM+Sans:wght@300;400;500;700",                                    # perfil: texto
]
url = "https://fonts.googleapis.com/css2?" + "&".join("family=" + f for f in FAMILIAS) + "&display=block"
css = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA})).read().decode()
out = []
for sub, bloco in re.findall(r"/\* (\S+) \*/\s*@font-face \{(.*?)\}", css, re.S):
    if sub not in ("latin", "latin-ext"):
        continue
    fam = re.search(r"font-family: '([^']+)'", bloco).group(1).replace(" ", "")
    est = re.search(r"font-style: (\w+)", bloco).group(1)
    w = re.search(r"font-weight: (\d+)", bloco).group(1)
    src = re.search(r"url\((\S+?)\)", bloco).group(1)
    nome = f"{fam}-{w}-{est}-{sub}.woff2"
    subprocess.run(["curl", "-sS", "-o", nome, src], check=True)
    out.append(re.sub(r"url\(\S+?\)", f"url({nome})", "@font-face {" + bloco + "}"))
open("fonts.css", "w").write("\n".join(out))
print(len(out), "faces")
