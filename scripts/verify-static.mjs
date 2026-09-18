import fs from 'node:fs';
import assert from 'node:assert/strict';
for (const file of ['out/index.html', 'out/sbc-summit-2026/index.html']) {
  const html = fs.readFileSync(file, 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(ids.length, new Set(ids).size, 'Duplicate element IDs');
  assert.equal((html.match(/<h1\b/g)||[]).length, 1);
  for (const [,id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), `Missing anchor ${id}`);
  for (const [,src] of html.matchAll(/<img[^>]+src="([^"]+)"/g)) if(src.startsWith('/')) assert.ok(fs.existsSync('public'+src), `Missing image ${src}`);
  const links = [...html.matchAll(/href="(https:\/\/meetings[^" ]+)"/g)];
  assert.ok(links.length >= 9, 'Missing booking links');
  for (const [,href] of links) {
    const url = new URL(href.replaceAll('&amp;', '&'));
    for (const key of ['uuid','utm_source','utm_medium','utm_campaign','utm_content']) assert.ok(url.searchParams.get(key), `Missing ${key}`);
  }
  console.log(`${file}: anchors, image assets, heading and ${links.length} tracked meeting links passed.`);
}
