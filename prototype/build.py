# 試作の index.html を作り直すスクリプト（画像は ../public/assets/ から埋め込む）。
# 使い方: prototype フォルダで python build.py
import base64,re,pathlib
here=pathlib.Path(__file__).parent
s=(here/'src.html').read_text(encoding='utf-8')
def rep(m):
    n=m.group(1); b=(here/'../public/assets'/n).read_bytes()
    mime='image/png' if n.endswith('.png') else ('image/svg+xml' if n.endswith('.svg') else 'image/jpeg')
    return f'data:{mime};base64,'+base64.b64encode(b).decode()
(here/'index.html').write_bytes(re.sub(r'\{\{([\w./-]+)\}\}',rep,s).encode('utf-8'))
