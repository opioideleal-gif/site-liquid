#!/usr/bin/env bash
# Importa logotipos anexados para o contrato drop-in do site.
# Uso: ./scripts/import-logos.sh [pasta-de-origem]   (padrão: /home/user/uploads)
# Renomeia "17_G.Paniz.png" -> src/assets/logos/g-paniz.png (mesmo slug das URLs /marcas/<slug>).
set -euo pipefail
SRC="${1:-/home/user/uploads}"
DEST="src/assets/logos"
if [ ! -d "$SRC" ]; then
  echo "Pasta de origem não encontrada: $SRC"; echo "Anexe os arquivos novamente (de preferência um .zip) ou passe o caminho certo."; exit 1;
fi
mkdir -p "$DEST"
python3 - "$SRC" "$DEST" <<'PY'
import sys, os, shutil, unicodedata, re
src, dest = sys.argv[1], sys.argv[2]
def slug(name):
    name = os.path.splitext(name)[0]
    name = re.sub(r'^\d+[_\s-]+', '', name)          # remove prefixo "17_"
    name = unicodedata.normalize('NFD', name)
    name = ''.join(c for c in name if unicodedata.category(c) != 'Mn')
    name = re.sub(r'[^a-zA-Z0-9]+', '-', name).lower()
    return name.strip('-')
done = 0
for f in sorted(os.listdir(src)):
    if not f.lower().endswith(('.png', '.jpg', '.jpeg', '.svg', '.webp')):
        continue
    target = os.path.join(dest, slug(f) + os.path.splitext(f)[1].lower())
    shutil.copy2(os.path.join(src, f), target)
    print(f"  {f}  ->  {target}")
    done += 1
print(f"{done} logo(s) importado(s). O site já exibe todos automaticamente.")
PY
