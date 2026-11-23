import asyncio, json
from playwright.async_api import async_playwright
CHECK = r"""
() => {
  const vw = innerWidth, out = {overflow: document.documentElement.scrollWidth - vw, wide: [], overlaps: []};
  const vis = el => { const r = el.getBoundingClientRect(); const st = getComputedStyle(el); return r.width>0 && r.height>0 && st.visibility!=='hidden' && st.display!=='none' && el.offsetParent!==null; };
  document.querySelectorAll('.view.on *, header *, footer *').forEach(el => {
    if (!vis(el)) return;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && !el.closest('.kanji') && !el.closest('.covgroup')) out.wide.push((el.className||el.tagName)+' '+Math.round(r.right));
  });
  // overlapping leaf text blocks
  const leaves = [...document.querySelectorAll('.view.on h1, .view.on h2, .view.on h3, .view.on p, .view.on a.btn, .view.on li, header a, header button, header img, .view.on .node, .view.on label, .view.on b')].filter(e=>vis(e)&&!e.closest('details:not([open])'));
  const rects = leaves.map(e => [e, e.getBoundingClientRect()]);
  for (let i=0;i<rects.length;i++) for (let j=i+1;j<rects.length;j++){
    const [a,ra]=rects[i],[b,rb]=rects[j];
    if (a.contains(b)||b.contains(a)) continue;
    const ox=Math.min(ra.right,rb.right)-Math.max(ra.left,rb.left), oy=Math.min(ra.bottom,rb.bottom)-Math.max(ra.top,rb.top);
    if (ox>4 && oy>4) out.overlaps.push((a.className||a.tagName)+':'+a.textContent.trim().slice(0,18)+' X '+(b.className||b.tagName)+':'+b.textContent.trim().slice(0,18));
  }
  out.wide = [...new Set(out.wide)].slice(0,8); out.overlaps=[...new Set(out.overlaps)].slice(0,8);
  return out;
}
"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        html=open('/home/claude/site/index.html').read()
        for w in [320,375,414,600,768,900,1024,1180,1280,1440,1920]:
            pg=await b.new_page(viewport={'width':w,'height':900})
            await pg.set_content(html); await pg.wait_for_timeout(1700)
            for lang in ['en','ja']:
                if w>=900: 
                    await pg.evaluate(f"document.querySelector('[data-set={lang}]').click()")
                else:
                    await pg.evaluate(f"document.querySelector('[data-set={lang}]').click()")
                for v in ['home','research','corporate','coverage','about','careers','contact']:
                    await pg.evaluate(f"document.querySelector('a[href=\"#{v}\"]') ? (()=>{{const a=document.createElement('a');a.href='#{v}';document.body.appendChild(a);a.click();a.remove()}})() : 0")
                    await pg.wait_for_timeout(120)
                    r=await pg.evaluate(CHECK)
                    if r['overflow']>0 or r['wide'] or r['overlaps']:
                        print(w,lang,v,json.dumps(r,ensure_ascii=False))
            await pg.close()
        await b.close()
asyncio.run(main())
