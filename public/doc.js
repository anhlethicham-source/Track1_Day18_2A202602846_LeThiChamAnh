// Dùng chung cho trình duyệt và máy chủ.
// Mỗi tài liệu là danh sách khối {t, text}: t = h1 | h2 | p | li | ol.
// Vùng tô lưu bằng offset ký tự trên chuỗi nối các khối bằng "\n".

export function parseText(raw) {
  const lines = String(raw || '').replace(/\r\n?/g, '\n').split('\n');
  const hasBlank = lines.some((l, i) => !l.trim() && i > 0 && i < lines.length - 1);
  const blocks = [];
  let buf = [];
  const flush = () => { if (buf.length) { blocks.push({ t: 'p', text: buf.join(' ') }); buf = []; } };
  for (const line of lines) {
    const s = line.trim();
    if (!s) { flush(); continue; }
    let m;
    if ((m = s.match(/^(#{1,6})\s+(.+)$/))) { flush(); blocks.push({ t: m[1].length === 1 ? 'h1' : 'h2', text: m[2] }); continue; }
    if ((m = s.match(/^[-*•–]\s+(.+)$/))) { flush(); blocks.push({ t: 'li', text: m[1] }); continue; }
    if (/^\d{1,3}[.)]\s+\S/.test(s) && s.length < 160) { flush(); blocks.push({ t: 'ol', text: s }); continue; }
    if (hasBlank) buf.push(s); else blocks.push({ t: 'p', text: s });
  }
  flush();
  return blocks.map(b => ({ t: b.t, text: b.text.replace(/\s+/g, ' ').trim() })).filter(b => b.text);
}

const metaCache = new WeakMap();
export function docMeta(doc) {
  let m = metaCache.get(doc);
  if (!m) {
    let s = 0;
    const starts = doc.blocks.map(b => { const st = s; s += b.text.length + 1; return st; });
    m = { starts, text: doc.blocks.map(b => b.text).join('\n') };
    metaCache.set(doc, m);
  }
  return m;
}

export function sectionAt(doc, pos) {
  const { starts } = docMeta(doc);
  let sec = '';
  doc.blocks.forEach((b, i) => { if ((b.t === 'h1' || b.t === 'h2') && starts[i] <= pos) sec = b.text; });
  return sec;
}

export const excerpt = (doc, h) => docMeta(doc).text.slice(h.start, h.end).replace(/\n+/g, ' / ');

export function blocksToMarkdown(blocks) {
  return blocks.map(b => {
    if (b.t === 'h1') return `\n# ${b.text}\n`;
    if (b.t === 'h2') return `\n## ${b.text}\n`;
    if (b.t === 'li') return `- ${b.text}`;
    if (b.t === 'ol') return b.text;
    return `\n${b.text}\n`;
  }).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
