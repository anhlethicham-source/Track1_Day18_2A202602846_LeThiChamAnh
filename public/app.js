import { parseText, docMeta as meta, sectionAt, excerpt } from './doc.js';

/* ---------- Cấu hình ---------- */
const CATS = {
  imp: { label: 'Quan trọng', heading: 'Điều quan trọng', noteLabel: 'Ghi chú', placeholder: 'Vì sao điều này quan trọng? (không bắt buộc)' },
  q: { label: 'Chưa hiểu', heading: 'Chưa hiểu, cần tìm hiểu thêm', noteLabel: 'Câu hỏi', placeholder: 'Bạn chưa hiểu chỗ nào? Ghi câu hỏi, AI sẽ trả lời khi tổng hợp.' },
};
const CAT_KEYS = { '1': 'imp', '2': 'q' };
const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const MAMMOTH = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
const SESSION_KEY = 'tobai.session.v2';
const UI_KEY = 'tobai.ui.v2';

/* ---------- Tiện ích ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const fmtDate = t => new Date(t).toLocaleDateString('vi-VN');
const fmtTime = t => new Date(t).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
const isWide = () => matchMedia('(min-width: 761px)').matches;
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const smooth = () => (reducedMotion() ? 'auto' : 'smooth');

function load(k, fallback) {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function persist(k, v) {
  try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch { /* bộ nhớ bị chặn */ }
}

const scriptCache = {};
function loadScript(src, globalName) {
  if (window[globalName]) return Promise.resolve(window[globalName]);
  return scriptCache[src] || (scriptCache[src] = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => (window[globalName] ? resolve(window[globalName]) : reject(new Error('Thư viện đọc file không khởi động được.')));
    s.onerror = () => { delete scriptCache[src]; reject(new Error('Không tải được thư viện đọc file. Kiểm tra kết nối mạng rồi thử lại.')); };
    document.head.append(s);
  }));
}

function renderMd(md) {
  if (window.marked && window.DOMPurify) return window.DOMPurify.sanitize(window.marked.parse(md));
  const pre = el('pre', 'md-plain', md);
  return pre.outerHTML;
}

async function copyText(text, fallbackTa, msgEl, okMsg) {
  try {
    await navigator.clipboard.writeText(text);
    msgEl.textContent = okMsg;
  } catch {
    fallbackTa.value = text;
    fallbackTa.hidden = false;
    fallbackTa.focus();
    fallbackTa.select();
    msgEl.textContent = 'Trình duyệt không cho sao chép tự động. Nội dung đã được chọn sẵn bên dưới, nhấn Ctrl+C.';
  }
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2800);
}

/* ---------- Gọi máy chủ ---------- */
let session = load(SESSION_KEY, null);

const errMsg = err => (err instanceof TypeError ? 'Không kết nối được máy chủ. Kiểm tra máy chủ còn chạy và mạng còn kết nối.' : err.message);

async function apiFetch(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(session ? { Authorization: 'Bearer ' + session.token } : {}) };
  const res = await fetch('/api' + path, { ...opts, headers });
  if (res.status === 401 && session) {
    endSession();
    throw new Error('Phiên đăng nhập đã hết. Đăng nhập lại để tiếp tục.');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Máy chủ báo lỗi ${res.status}.`);
  }
  return res;
}
const getJson = async (path, opts) => (await apiFetch(path, opts)).json();
const sendJson = (path, method, body) => getJson(path, { method, body: JSON.stringify(body || {}) });

/* ---------- Trạng thái ---------- */
let docs = [];
let hls = {};          // docId -> danh sách vùng tô của học sinh đang đăng nhập
const summaries = {};  // docId -> bản tổng hợp AI đã lưu
const ui = Object.assign({ docId: null, filter: 'all', scope: 'doc' }, load(UI_KEY, {}));
const saveUi = () => persist(UI_KEY, ui);

const curDoc = () => docs.find(d => d.id === ui.docId);
const hlOf = id => (hls[id] || (hls[id] = []));
const counts = id => { const c = { imp: 0, q: 0 }; for (const h of hlOf(id)) c[h.cat]++; return c; };

// Lưu vùng tô lên máy chủ: gom thay đổi, gửi cả danh sách của từng bài.
const dirty = new Set();
let syncTimer;
const setSync = text => { $('#syncState').textContent = text; };
function markDirty(docId) {
  dirty.add(docId);
  setSync('Đang lưu…');
  clearTimeout(syncTimer);
  syncTimer = setTimeout(flushSync, 600);
}
async function flushSync() {
  clearTimeout(syncTimer);
  const ids = [...dirty];
  if (!ids.length) return true;
  dirty.clear();
  try {
    await Promise.all(ids.map(id => sendJson(`/docs/${id}/highlights`, 'PUT', { highlights: hlOf(id) })));
    setSync('Đã lưu');
    return true;
  } catch (err) {
    ids.forEach(id => dirty.add(id));
    if (!session) return false;
    setSync('Chưa lưu được, đang thử lại…');
    syncTimer = setTimeout(flushSync, 4000);
    return false;
  }
}
addEventListener('pagehide', () => {
  if (!dirty.size || !session) return;
  for (const id of dirty) {
    fetch(`/api/docs/${id}/highlights`, {
      method: 'PUT', keepalive: true,
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.token },
      body: JSON.stringify({ highlights: hlOf(id) }),
    });
  }
});

// Bỏ phần [a, b) khỏi các đoạn đã tô, tách đôi nếu cần, để các vùng tô không chồng lên nhau.
function carve(list, a, b) {
  const out = [];
  for (const h of list) {
    if (h.end <= a || h.start >= b) { out.push(h); continue; }
    if (h.start < a) out.push({ ...h, end: a });
    if (h.end > b) out.push({ ...h, id: h.start < a ? uid() : h.id, start: b });
  }
  return out;
}

/* ---------- Đăng nhập ---------- */
// Màn đăng nhập dành cho học sinh; giáo viên vào qua đường phụ chỉ để đăng tài liệu.
let loginRole = 'student';
function setLoginRole(role) {
  loginRole = role;
  const teacher = role === 'teacher';
  $('#codeField').hidden = !teacher;
  $('#studentIntro').hidden = teacher;
  $('#loginEyebrow').textContent = teacher ? 'Giáo viên' : 'Vào lớp';
  $('#loginHeading').textContent = teacher ? 'Đăng tài liệu cho học sinh' : 'Bắt đầu học';
  $('#loginSubmit').textContent = teacher ? 'Đăng nhập giáo viên' : 'Vào học';
  $('#loginAltText').textContent = teacher ? 'Bạn là học sinh?' : 'Thầy cô cần đăng tài liệu?';
  $('#loginSwitch').textContent = teacher ? 'Quay lại trang học sinh' : 'Đăng nhập giáo viên';
  $('#loginStatus').textContent = '';
}
$('#loginSwitch').addEventListener('click', () => setLoginRole(loginRole === 'teacher' ? 'student' : 'teacher'));
$('#loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const status = $('#loginStatus');
  status.className = 'status';
  status.textContent = 'Đang vào lớp…';
  try {
    const res = await sendJson('/auth/login', 'POST', { name: $('#loginName').value, role: loginRole, code: $('#loginCode').value });
    session = res;
    persist(SESSION_KEY, session);
    $('#loginCode').value = '';
    status.textContent = '';
    await enterApp();
  } catch (err) {
    status.className = 'status error';
    status.textContent = errMsg(err);
  }
});
$('#logoutBtn').addEventListener('click', async () => {
  await flushSync();
  apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
  endSession();
});

function endSession() {
  session = null;
  persist(SESSION_KEY, null);
  docs = [];
  hls = {};
  dirty.clear();
  hideToolbar();
  $('#loginName').value = '';
  $('#loginCode').value = '';
  setLoginRole('student');
  showView('login');
}

function showView(name) {
  $('#loginView').hidden = name !== 'login';
  $('#studentView').hidden = name !== 'student';
  $('#teacherView').hidden = name !== 'teacher';
  $('#who').hidden = name === 'login';
  if (name === 'login') setTimeout(() => $('#loginName').focus(), 0);
}

async function enterApp() {
  const { user } = session;
  $('#whoRole').textContent = user.role === 'teacher' ? 'Giáo viên' : 'Học sinh';
  $('#whoName').textContent = user.name;
  const words = user.name.trim().split(/\s+/);
  $('#whoAvatar').textContent = (words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0].slice(0, 2)).toUpperCase();
  const [d, h] = await Promise.all([
    getJson('/docs'),
    user.role === 'student' ? getJson('/highlights') : Promise.resolve({ highlights: [] }),
  ]);
  docs = d.docs;
  hls = {};
  for (const x of h.highlights) hlOf(x.docId).push(x);
  if (!docs.some(x => x.id === ui.docId)) ui.docId = docs[0] ? docs[0].id : null;
  if (user.role === 'teacher') {
    showView('teacher');
    updateParseInfo();
    renderTeacherDocs();
  } else {
    showView('student');
    setSync('');
    renderAll();
    loadSummaries(ui.docId);
  }
}

/* ---------- Giao diện học sinh ---------- */
const reader = $('#reader');

function renderLibrary() {
  const ul = $('#docList');
  ul.replaceChildren();
  if (!docs.length) {
    ul.append(el('li', 'small muted', 'Lớp chưa có tài liệu. Khi giáo viên đăng bài, bài sẽ hiện ở đây.'));
    return;
  }
  for (const d of docs) {
    const li = el('li');
    const b = el('button', 'doc-item');
    b.type = 'button';
    if (d.id === ui.docId) b.setAttribute('aria-current', 'true');
    const c = counts(d.id);
    const cn = el('span', 'doc-item-counts');
    cn.innerHTML = `<span title="Quan trọng"><i class="dot dot-imp"></i>${c.imp}</span><span title="Chưa hiểu"><i class="dot dot-q"></i>${c.q}</span>`;
    b.append(el('span', 'doc-item-title', d.title), el('span', 'doc-item-meta', d.lesson || fmtDate(d.createdAt)), cn);
    b.addEventListener('click', () => openDoc(d.id));
    li.append(b);
    ul.append(li);
  }
}

function renderReader() {
  const d = curDoc();
  $('#docTitle').textContent = d ? d.title : 'Chưa có tài liệu';
  const lesson = $('#docLesson');
  lesson.replaceChildren(d ? (d.lesson || 'Tài liệu') : '');
  if (d && d.sample) lesson.append(' ', el('span', 'badge', 'Tài liệu mẫu'));
  $('#docBy').textContent = d ? `${d.teacher || 'Giáo viên'} · đăng ngày ${fmtDate(d.createdAt)} · ${d.blocks.length} đoạn` : '';
  reader.replaceChildren();
  if (!d) {
    reader.append(el('p', 'empty', 'Khi giáo viên đăng tài liệu, bài sẽ hiện ở đây để bạn đọc và tô màu.'));
    return;
  }
  const { starts } = meta(d);
  const list = hlOf(d.id).slice().sort((x, y) => x.start - y.start);
  d.blocks.forEach((b, i) => {
    const tag = b.t === 'h1' ? 'h2' : b.t === 'h2' ? 'h3' : 'p';
    const node = el(tag, b.t === 'li' || b.t === 'ol' ? b.t : '');
    const s = starts[i], e = s + b.text.length;
    node.dataset.s = s;
    let cur = s;
    for (const h of list) {
      if (h.end <= s || h.start >= e) continue;
      const a = Math.max(h.start, s), z = Math.min(h.end, e);
      if (a > cur) node.append(b.text.slice(cur - s, a - s));
      const m = el('mark', `hl hl-${h.cat}${h.done ? ' is-done' : ''}`, b.text.slice(a - s, z - s));
      m.dataset.id = h.id;
      m.title = CATS[h.cat].label + (h.note ? ': ' + h.note : '');
      node.append(m);
      cur = z;
    }
    if (cur < e) node.append(b.text.slice(cur - s));
    reader.append(node);
  });
}

function renderNotes() {
  const scopeDocs = ui.scope === 'all' ? docs : docs.filter(d => d.id === ui.docId);
  const all = scopeDocs.flatMap(d => hlOf(d.id).slice().sort((x, y) => x.start - y.start).map(h => ({ d, h })));
  const c = { all: all.length, imp: all.filter(x => x.h.cat === 'imp').length, q: all.filter(x => x.h.cat === 'q').length };
  $$('#filters button').forEach(b => {
    b.setAttribute('aria-pressed', String(b.dataset.filter === ui.filter));
    $('.n', b).textContent = c[b.dataset.filter];
  });
  $$('#scopeSeg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.scope === ui.scope)));
  renderAiBox();

  const list = $('#noteList');
  list.replaceChildren();
  const shown = all.filter(x => ui.filter === 'all' || x.h.cat === ui.filter);
  $('#exportBtn').disabled = !shown.length;
  if (!shown.length) {
    const what = ui.filter === 'all' ? 'đoạn nào' : `đoạn "${CATS[ui.filter].label}" nào`;
    list.append(el('p', 'empty-notes', `Chưa có ${what} được tô. Bôi đen một câu trong bài rồi chọn Quan trọng (xanh) hoặc Chưa hiểu (đỏ). Mọi đoạn tô sẽ được gom vào đây.`));
    return;
  }
  for (const cat of ui.filter === 'all' ? ['imp', 'q'] : [ui.filter]) {
    const items = shown.filter(x => x.h.cat === cat);
    if (!items.length) continue;
    const group = el('section', 'note-group');
    const gh = el('h3', 'note-group-title');
    gh.append(el('i', `dot dot-${cat}`), CATS[cat].heading, el('span', 'n', String(items.length)));
    group.append(gh);
    for (const x of items) group.append(card(x.d, x.h));
    list.append(group);
  }
}

function card(d, h) {
  const a = el('article', 'card' + (h.done ? ' is-done' : ''));
  a.dataset.id = h.id;
  const where = [ui.scope === 'all' ? d.title : null, sectionAt(d, h.start)].filter(Boolean).join(' › ');
  const metaLine = el('div', 'card-meta', where || 'Đầu bài');

  const quote = el('button', 'card-quote');
  quote.type = 'button';
  quote.title = 'Xem đoạn này trong bài';
  const ex = excerpt(d, h);
  quote.append(el('span', `hl hl-${h.cat}${h.done ? ' is-done' : ''}`, ex.length > 260 ? ex.slice(0, 257) + '…' : ex));
  quote.addEventListener('click', () => jumpTo(d.id, h.id));

  const note = el('textarea', 'card-note');
  note.id = 'note-' + h.id;
  note.rows = 1;
  note.value = h.note || '';
  note.placeholder = CATS[h.cat].placeholder;
  note.setAttribute('aria-label', CATS[h.cat].noteLabel);
  note.addEventListener('input', () => { h.note = note.value; autoGrow(note); markDirty(d.id); });
  note.addEventListener('change', () => { if (d.id === ui.docId) renderReaderKeepScroll(); });

  const acts = el('div', 'card-actions');
  if (h.cat === 'q') {
    const lab = el('label', 'check');
    const cb = el('input');
    cb.type = 'checkbox';
    cb.id = 'done-' + h.id;
    cb.checked = !!h.done;
    cb.addEventListener('change', () => { h.done = cb.checked; markDirty(d.id); renderAll(); });
    lab.append(cb, 'Đã hiểu');
    acts.append(lab);
  }
  const sw = el('button', 'link', h.cat === 'imp' ? 'Đổi sang đỏ' : 'Đổi sang xanh');
  sw.type = 'button';
  sw.addEventListener('click', () => { h.cat = h.cat === 'imp' ? 'q' : 'imp'; h.done = false; markDirty(d.id); renderAll(); });
  const del = el('button', 'link danger', 'Bỏ tô');
  del.type = 'button';
  del.addEventListener('click', () => { hls[d.id] = hlOf(d.id).filter(x => x.id !== h.id); markDirty(d.id); renderAll(); toast('Đã bỏ tô đoạn này.'); });
  acts.append(sw, del);

  a.append(metaLine, quote, note, acts);
  requestAnimationFrame(() => autoGrow(note));
  return a;
}

function autoGrow(ta) { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 2 + 'px'; }

function renderReaderKeepScroll() {
  const y = scrollY;
  renderReader();
  scrollTo(0, y);
}

function renderAll() {
  renderLibrary();
  renderReader();
  renderNotes();
}

function openDoc(id) {
  ui.docId = id;
  saveUi();
  hideToolbar();
  renderAll();
  loadSummaries(id);
  if (!isWide()) $('.reading').scrollIntoView({ behavior: smooth(), block: 'start' });
}

function flash(node) {
  if (!node) return;
  node.classList.remove('flash');
  void node.offsetWidth;
  node.classList.add('flash');
  setTimeout(() => node.classList.remove('flash'), 1400);
}

function jumpTo(docId, hid) {
  if (docId !== ui.docId) { ui.docId = docId; saveUi(); renderAll(); loadSummaries(docId); }
  const m = $(`#reader mark[data-id="${hid}"]`);
  if (!m) return;
  m.scrollIntoView({ behavior: smooth(), block: 'center' });
  flash(m);
}

function focusCard(hid, focusNote) {
  const h = hlOf(ui.docId).find(x => x.id === hid);
  if (h && ui.filter !== 'all' && ui.filter !== h.cat) { ui.filter = 'all'; saveUi(); renderNotes(); }
  const c = $(`.card[data-id="${hid}"]`);
  if (!c) return;
  c.scrollIntoView({ behavior: smooth(), block: 'nearest' });
  flash(c);
  if (focusNote) $('.card-note', c).focus({ preventScroll: true });
}

/* ---------- Bôi đen và tô màu ---------- */
const tb = $('#toolbar');
let pending = null; // { docId, a, b, hid?, rectFn }

function pointToPos(node, off) {
  const d = curDoc();
  if (!d) return null;
  if (node === reader) {
    const kids = reader.children;
    return off >= kids.length ? meta(d).text.length : +kids[off].dataset.s;
  }
  const start = node.nodeType === 1 ? node : node.parentElement;
  const block = start && start.closest('#reader [data-s]');
  if (!block) return null;
  const r = document.createRange();
  r.selectNodeContents(block);
  r.setEnd(node, off);
  return +block.dataset.s + r.toString().length;
}

function readSelection() {
  const sel = getSelection();
  if (!sel.rangeCount || sel.isCollapsed) return null;
  const r = sel.getRangeAt(0);
  if (!reader.contains(r.commonAncestorContainer)) return null;
  let a = pointToPos(r.startContainer, r.startOffset);
  let b = pointToPos(r.endContainer, r.endOffset);
  if (a == null || b == null) return null;
  const text = meta(curDoc()).text;
  while (a < b && /\s/.test(text[a])) a++;
  while (b > a && /\s/.test(text[b - 1])) b--;
  return b > a ? { a, b } : null;
}

function showToolbar(p) {
  pending = p;
  const list = hlOf(p.docId);
  const h = p.hid ? list.find(x => x.id === p.hid) : null;
  $('#tbNote').hidden = !h;
  $('#tbClear').hidden = !h && !list.some(x => x.start < p.b && x.end > p.a);
  $$('[data-act="imp"], [data-act="q"]', tb).forEach(b => b.setAttribute('aria-pressed', String(!!h && h.cat === b.dataset.act)));
  tb.hidden = false;
  placeToolbar();
}

function placeToolbar() {
  if (!pending) return;
  if (!isWide() || matchMedia('(pointer: coarse)').matches) {
    tb.classList.add('docked');
    tb.style.left = tb.style.top = '';
    return;
  }
  const rect = pending.rectFn();
  if (!rect || (!rect.width && !rect.height)) { hideToolbar(); return; }
  tb.classList.remove('docked');
  const w = tb.offsetWidth, hgt = tb.offsetHeight;
  let top = rect.top - hgt - 10;
  if (top < 70) top = rect.bottom + 10;
  const left = Math.max(8, Math.min(rect.left + rect.width / 2 - w / 2, innerWidth - w - 8));
  tb.style.top = top + 'px';
  tb.style.left = left + 'px';
}

function hideToolbar() { tb.hidden = true; pending = null; }

function updateFromSelection() {
  if (!session || session.user.role !== 'student' || $('#studentView').hidden) return;
  const s = readSelection();
  if (s) {
    showToolbar({
      docId: ui.docId, a: s.a, b: s.b,
      rectFn: () => { const sel = getSelection(); return sel.rangeCount ? sel.getRangeAt(0).getBoundingClientRect() : null; },
    });
  } else if (pending && !pending.hid) {
    hideToolbar();
  }
}

function act(kind) {
  const p = pending;
  if (!p) return;
  const list = hlOf(p.docId);
  let created = null;
  if (kind === 'note') { hideToolbar(); focusCard(p.hid, true); return; }
  if (kind === 'clear') {
    hls[p.docId] = p.hid ? list.filter(h => h.id !== p.hid) : carve(list, p.a, p.b);
  } else if (p.hid) {
    const h = list.find(x => x.id === p.hid);
    if (h && h.cat !== kind) { h.cat = kind; h.done = false; }
  } else {
    created = { id: uid(), start: p.a, end: p.b, cat: kind, note: '', done: false, at: Date.now() };
    hls[p.docId] = [...carve(list, p.a, p.b), created];
  }
  getSelection().removeAllRanges();
  hideToolbar();
  markDirty(p.docId);
  const y = scrollY;
  renderAll();
  scrollTo(0, y);
  if (created) {
    flash($(`#reader mark[data-id="${created.id}"]`));
    if (isWide()) focusCard(created.id, kind === 'q');
    toast(kind === 'q' ? 'Đã thêm vào mục Chưa hiểu. Ghi câu hỏi để AI giải đáp.' : 'Đã thêm vào mục Quan trọng.');
  } else if (kind === 'clear') {
    toast('Đã bỏ màu.');
  }
}

tb.addEventListener('pointerdown', e => e.preventDefault()); // giữ nguyên vùng đang bôi đen
tb.addEventListener('mousedown', e => e.preventDefault());
tb.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (b) act(b.dataset.act);
});

let dragging = false, selTimer;
reader.addEventListener('pointerdown', () => { dragging = true; });
document.addEventListener('pointerup', () => { if (dragging) { dragging = false; setTimeout(updateFromSelection, 0); } });
document.addEventListener('pointercancel', () => { dragging = false; });
document.addEventListener('selectionchange', () => {
  if (dragging) return;
  clearTimeout(selTimer);
  selTimer = setTimeout(updateFromSelection, 160);
});
document.addEventListener('pointerdown', e => {
  if (pending && pending.hid && !tb.contains(e.target) && !e.target.closest('mark.hl')) hideToolbar();
});

reader.addEventListener('click', e => {
  const m = e.target.closest('mark.hl');
  if (!m || !getSelection().isCollapsed) return;
  const h = hlOf(ui.docId).find(x => x.id === m.dataset.id);
  if (!h) return;
  showToolbar({
    docId: ui.docId, hid: h.id, a: h.start, b: h.end,
    rectFn: () => { const mm = $(`#reader mark[data-id="${h.id}"]`); return mm ? mm.getBoundingClientRect() : null; },
  });
  if (isWide()) focusCard(h.id, false);
});

document.addEventListener('keydown', e => {
  if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
  if (!pending || tb.hidden) return;
  if (CAT_KEYS[e.key]) { e.preventDefault(); act(CAT_KEYS[e.key]); }
  else if (e.key === 'Escape') { hideToolbar(); }
  else if ((e.key === 'Delete' || e.key === 'Backspace') && !$('#tbClear').hidden) { e.preventDefault(); act('clear'); }
});
addEventListener('scroll', () => { if (pending) placeToolbar(); }, { passive: true, capture: true });
addEventListener('resize', () => { if (pending) placeToolbar(); });

$('#filters').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  ui.filter = b.dataset.filter;
  saveUi();
  renderNotes();
});
$('#scopeSeg').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  ui.scope = b.dataset.scope;
  saveUi();
  renderNotes();
});

/* ---------- AI tổng hợp kiến thức ---------- */
const aiDlg = $('#aiDlg');
let aiRun = null; // { controller, docId }
let aiMarkdown = '';

async function loadSummaries(docId) {
  if (!docId) return;
  try {
    const { summaries: list } = await getJson(`/docs/${docId}/summaries`);
    summaries[docId] = list;
    if (docId === ui.docId) renderAiBox();
  } catch (err) {
    if (session) toast(errMsg(err));
  }
}

function renderAiBox() {
  const d = curDoc();
  const btn = $('#aiBtn');
  const n = d ? hlOf(d.id).length : 0;
  btn.disabled = !d || !n || !!aiRun;
  btn.textContent = aiRun ? 'AI đang viết…' : 'Tổng hợp và giải đáp';
  $('#aiHint').textContent = !d ? '' : n
    ? 'AI đọc lại cả bài cùng những chỗ bạn tô để viết bản ôn tập: ý chính, lời giải thích cho từng chỗ đỏ, và câu hỏi tự kiểm tra.'
    : 'Tô ít nhất một đoạn trong bài, AI sẽ dựa vào đó để viết bản ôn tập cho bạn.';

  // Số liệu ôn bài: bao nhiêu ý quan trọng, bao nhiêu chỗ chưa hiểu, đã hiểu được bao nhiêu
  const stats = $('#aiStats');
  stats.replaceChildren();
  if (d) {
    const list = hlOf(d.id);
    const q = list.filter(h => h.cat === 'q');
    const done = q.filter(h => h.done).length;
    const stat = (num, label, cls) => {
      const s = el('div', 'stat ' + cls);
      s.append(el('span', 'stat-n', String(num)), el('span', 'stat-l', label));
      return s;
    };
    stats.append(stat(list.length - q.length, 'ý quan trọng', 'imp'), stat(q.length - done, 'chỗ chưa hiểu', 'q'));
    if (q.length) {
      const prog = el('div', 'progress');
      const row = el('div', 'progress-row');
      row.append(el('span', '', 'Đã hiểu'), el('span', '', `${done}/${q.length} chỗ`));
      const bar = el('div', 'progress-bar');
      const fill = el('span', 'progress-fill');
      fill.style.width = `${Math.round((done / q.length) * 100)}%`;
      bar.append(fill);
      prog.append(row, bar);
      stats.append(prog);
    }
  }
  const ul = $('#summaryList');
  ul.replaceChildren();
  for (const s of (d && summaries[d.id]) || []) {
    const li = el('li');
    const open = el('button', 'summary-item');
    open.type = 'button';
    open.append(el('span', 'summary-title', 'Bản tổng hợp AI'), el('span', 'summary-meta', `${fmtTime(s.createdAt)} · ${s.counts.imp} xanh, ${s.counts.q} đỏ`));
    open.addEventListener('click', () => showSaved(d, s));
    const del = el('button', 'link danger', 'Xoá');
    del.type = 'button';
    del.setAttribute('aria-label', 'Xoá bản tổng hợp lúc ' + fmtTime(s.createdAt));
    del.addEventListener('click', async () => {
      try {
        await apiFetch(`/summaries/${s.id}`, { method: 'DELETE' });
        summaries[d.id] = summaries[d.id].filter(x => x.id !== s.id);
        renderAiBox();
      } catch (err) { toast(errMsg(err)); }
    });
    li.append(open, del);
    ul.append(li);
  }
}

function setAiOutput(md) {
  aiMarkdown = md;
  $('#aiOut').innerHTML = renderMd(md);
}

function openAiDialog(d, sub) {
  $('#aiTitle').textContent = d.title;
  $('#aiSub').textContent = sub;
  $('#aiMsg').textContent = '';
  $('#aiFallback').hidden = true;
  if (!aiDlg.open) aiDlg.showModal();
}

function showSaved(d, s) {
  if (aiRun) return openAiDialog(d, 'AI đang tổng hợp…');
  openAiDialog(d, `Tạo lúc ${fmtTime(s.createdAt)} từ ${s.highlightCount} đoạn tô (${s.counts.imp} xanh, ${s.counts.q} đỏ).`);
  setAiOutput(s.markdown);
  $('#aiRedo').disabled = false;
}

async function runSummary() {
  const d = curDoc();
  if (!d || aiRun) return;
  const n = hlOf(d.id).length;
  if (!n) { toast('Tô ít nhất một đoạn trong bài để AI có dữ liệu tổng hợp.'); return; }
  hideToolbar();
  openAiDialog(d, `Đang gửi ${n} đoạn bạn tô cùng nội dung bài học…`);
  $('#aiOut').innerHTML = '<p class="ai-wait"><span class="pulse" aria-hidden="true"></span>AI đang đọc bài học và các đoạn bạn tô. Thường mất 20 đến 60 giây.</p>';
  aiMarkdown = '';
  $('#aiRedo').disabled = true;
  const controller = new AbortController();
  aiRun = { controller, docId: d.id };
  renderAiBox();

  let text = '';
  let frame = 0;
  const paint = () => { frame = 0; setAiOutput(text); };
  try {
    if (!(await flushSync())) throw new Error('Chưa lưu được các đoạn tô lên máy chủ. Kiểm tra kết nối rồi thử lại.');
    const res = await fetch(`/api/docs/${d.id}/summaries`, {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.token },
      body: '{}',
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Máy chủ báo lỗi ${res.status}.`);
    }
    const readerStream = res.body.pipeThrough(new TextDecoderStream()).getReader();
    let buf = '';
    let finished = false;
    for (;;) {
      const { value, done } = await readerStream.read();
      if (done) break;
      buf += value;
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const lineText = buf.slice(0, i);
        buf = buf.slice(i + 1);
        if (!lineText.trim()) continue;
        const msg = JSON.parse(lineText);
        if (msg.t === 'start') $('#aiSub').textContent = `Đang viết từ ${msg.count} đoạn bạn tô…`;
        else if (msg.t === 'reset') text = '';
        else if (msg.t === 'delta') { text += msg.text; if (!frame) frame = requestAnimationFrame(paint); }
        else if (msg.t === 'error') throw new Error(msg.message);
        else if (msg.t === 'done') {
          finished = true;
          cancelAnimationFrame(frame);
          setAiOutput(msg.summary.markdown);
          (summaries[d.id] || (summaries[d.id] = [])).unshift(msg.summary);
          $('#aiSub').textContent = `Tạo lúc ${fmtTime(msg.summary.createdAt)} từ ${msg.summary.highlightCount} đoạn tô. Đã lưu vào Bản note.`;
        }
      }
    }
    if (!finished) throw new Error('Kết nối bị ngắt trước khi AI viết xong. Thử lại.');
  } catch (err) {
    cancelAnimationFrame(frame);
    if (err.name === 'AbortError') {
      $('#aiMsg').textContent = '';
    } else {
      if (!text) $('#aiOut').innerHTML = `<div class="ai-error">${renderMd(errMsg(err))}</div>`;
      else setAiOutput(text);
      $('#aiMsg').textContent = errMsg(err);
      $('#aiSub').textContent = 'Chưa tổng hợp xong.';
    }
  } finally {
    aiRun = null;
    $('#aiRedo').disabled = false;
    renderAiBox();
  }
}

$('#aiBtn').addEventListener('click', runSummary);
$('#aiRedo').addEventListener('click', runSummary);
$('#aiClose').addEventListener('click', () => aiDlg.close());
aiDlg.addEventListener('close', () => { if (aiRun) { aiRun.controller.abort(); toast('Đã dừng tổng hợp.'); } });
$('#aiCopy').addEventListener('click', () => {
  if (!aiMarkdown) return;
  copyText(aiMarkdown, $('#aiFallback'), $('#aiMsg'), 'Đã sao chép bản tổng hợp (Markdown).');
});

/* ---------- Xuất bản note Markdown (không dùng AI) ---------- */
function exportModel() {
  const scopeDocs = ui.scope === 'all' ? docs : docs.filter(d => d.id === ui.docId);
  const cats = ui.filter === 'all' ? ['imp', 'q'] : [ui.filter];
  return scopeDocs.map(d => {
    const list = hlOf(d.id).slice().sort((x, y) => x.start - y.start);
    const groups = cats.map(cat => ({
      cat,
      items: list.filter(h => h.cat === cat).map(h => ({ text: excerpt(d, h), sec: sectionAt(d, h.start), note: (h.note || '').trim(), done: !!h.done })),
    })).filter(g => g.items.length);
    return { doc: d, groups };
  }).filter(x => x.groups.length);
}

const exportTitle = () => (ui.scope === 'all' ? 'Sổ note tổng hợp' : `Bản note: ${curDoc() ? curDoc().title : ''}`);

function toMarkdown(model) {
  const all = ui.scope === 'all';
  const L = [`# ${exportTitle()}`, '', `_Tổng hợp ngày ${fmtDate(Date.now())}. Xanh = quan trọng, đỏ = chưa hiểu._`, ''];
  for (const { doc, groups } of model) {
    if (all) { L.push(`## ${doc.title}`); if (doc.lesson) L.push(`_${doc.lesson}_`); L.push(''); }
    for (const g of groups) {
      L.push(`${all ? '###' : '##'} ${CATS[g.cat].heading} (${g.items.length})`, '');
      for (const it of g.items) {
        const box = g.cat === 'q' ? (it.done ? '[x] ' : '[ ] ') : '';
        L.push(`- ${box}"${it.text}"${it.sec ? ` _(${it.sec})_` : ''}`);
        if (it.note) L.push(`  - ${CATS[g.cat].noteLabel}: ${it.note.replace(/\s*\n\s*/g, ' ')}`);
      }
      L.push('');
    }
  }
  return L.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function renderPreview(model) {
  const box = $('#exportPreview');
  box.replaceChildren();
  for (const { doc, groups } of model) {
    if (ui.scope === 'all') box.append(el('h3', '', doc.title));
    for (const g of groups) {
      const h4 = el('h4');
      h4.append(el('i', `dot dot-${g.cat}`), `${CATS[g.cat].heading} (${g.items.length})`);
      const ul = el('ul');
      for (const it of g.items) {
        const li = el('li');
        if (g.cat === 'q') li.append(el('span', 'box', it.done ? '☑' : '☐'));
        li.append(el('span', `hl hl-${g.cat}${it.done ? ' is-done' : ''}`, it.text));
        if (it.sec) li.append(' ', el('span', 'sec', `(${it.sec})`));
        if (it.note) li.append(el('span', 'pnote', `${CATS[g.cat].noteLabel}: ${it.note}`));
        ul.append(li);
      }
      box.append(h4, ul);
    }
  }
}

const exportDlg = $('#exportDlg');
let exportMd = '';
$('#exportBtn').addEventListener('click', () => {
  const model = exportModel();
  if (!model.length) return;
  exportMd = toMarkdown(model);
  const n = model.reduce((s, x) => s + x.groups.reduce((t, g) => t + g.items.length, 0), 0);
  $('#exportTitle').textContent = exportTitle();
  $('#exportSub').textContent = `${n} đoạn đã tô${ui.filter === 'all' ? '' : ` · chỉ mục ${CATS[ui.filter].label}`}${ui.scope === 'all' ? ` · ${model.length} tài liệu` : ''}. Sao chép để dán vào Notion, Google Docs, Word hoặc Obsidian.`;
  $('#exportMsg').textContent = '';
  $('#exportFallback').hidden = true;
  renderPreview(model);
  hideToolbar();
  exportDlg.showModal();
});
$('#closeDlg').addEventListener('click', () => exportDlg.close());
$('#copyBtn').addEventListener('click', () => copyText(exportMd, $('#exportFallback'), $('#exportMsg'), 'Đã sao chép bản note dạng Markdown.'));
$('#dlBtn').addEventListener('click', () => {
  const blob = new Blob([exportMd], { type: 'text/markdown;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = exportTitle().replace(/[\\/:*?"<>|]+/g, '').slice(0, 80) + '.md';
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  $('#exportMsg').textContent = 'Đã tải file .md.';
});
for (const dlg of [aiDlg, exportDlg]) {
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
}

/* ---------- Giáo viên: đăng tài liệu ---------- */
const fTitle = $('#fTitle'), fLesson = $('#fLesson'), fBody = $('#fBody'), fFile = $('#fFile');

function setStatus(msg, kind) {
  const s = $('#fStatus');
  s.textContent = msg;
  s.className = 'status' + (kind ? ' ' + kind : '');
}

function updateParseInfo() {
  const info = $('#parseInfo');
  if (!fBody.value.trim()) {
    info.textContent = 'Dòng bắt đầu bằng # là tiêu đề mục, dòng bắt đầu bằng - là gạch đầu dòng. Để trống một dòng giữa các đoạn văn.';
    return;
  }
  const blocks = parseText(fBody.value);
  const heads = blocks.filter(b => b.t === 'h1' || b.t === 'h2').length;
  info.textContent = `Xem trước: ${blocks.length} đoạn, ${heads} tiêu đề mục.`;
}

async function extractPdf(file) {
  const pdfjsLib = await loadScript(PDFJS, 'pdfjsLib');
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const out = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const content = await (await pdf.getPage(p)).getTextContent();
    const lines = [];
    let line = '';
    for (const it of content.items) {
      line += it.str;
      if (it.hasEOL) { lines.push(line); line = ''; }
    }
    if (line) lines.push(line);
    // Nối các dòng bị ngắt giữa chừng thành đoạn văn
    const paras = [];
    let cur = '';
    for (const l of lines.map(x => x.trim())) {
      if (!l) { if (cur) { paras.push(cur); cur = ''; } continue; }
      cur = cur ? cur + ' ' + l : l;
      if (/[.!?:;]["”')]?$/.test(l)) { paras.push(cur); cur = ''; }
    }
    if (cur) paras.push(cur);
    if (paras.length) out.push(`## Trang ${p}`, '', ...paras.flatMap(x => [x, '']));
  }
  if (!out.length) throw new Error('File PDF này không có lớp chữ (có thể là ảnh scan). Hãy dán nội dung vào ô bên dưới.');
  return out.join('\n');
}

async function extractDocx(file) {
  const mammoth = await loadScript(MAMMOTH, 'mammoth');
  const res = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return res.value;
}

async function handleFile(file) {
  if (!file) return;
  setStatus(`Đang đọc ${file.name}…`);
  try {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    let text;
    if (ext === 'pdf') text = await extractPdf(file);
    else if (ext === 'docx') text = await extractDocx(file);
    else if (['txt', 'md', 'markdown'].includes(ext) || file.type.startsWith('text/')) text = await file.text();
    else throw new Error('Chưa đọc được định dạng này. Hãy dùng PDF, Word (.docx), .txt hoặc .md.');
    fBody.value = text;
    if (!fTitle.value.trim()) fTitle.value = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
    updateParseInfo();
    setStatus(`Đã đọc ${file.name}. Kiểm tra nội dung bên dưới rồi bấm Đăng tài liệu.`, 'ok');
  } catch (err) {
    setStatus(err.message || 'Không đọc được file này.', 'error');
  } finally {
    fFile.value = '';
  }
}

$('#pickFile').addEventListener('click', () => fFile.click());
fFile.addEventListener('change', () => handleFile(fFile.files[0]));
const drop = $('#drop');
drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('over'));
drop.addEventListener('drop', e => {
  e.preventDefault();
  drop.classList.remove('over');
  handleFile(e.dataTransfer.files[0]);
});
fBody.addEventListener('input', updateParseInfo);

$('#uploadForm').addEventListener('submit', async e => {
  e.preventDefault();
  const title = fTitle.value.trim();
  if (!title) { setStatus('Thêm tiêu đề để học sinh nhận ra tài liệu.', 'error'); fTitle.focus(); return; }
  if (!parseText(fBody.value).length) { setStatus('Tài liệu chưa có nội dung. Chọn file hoặc dán văn bản vào ô Nội dung.', 'error'); fBody.focus(); return; }
  const btn = $('#postBtn');
  btn.disabled = true;
  setStatus('Đang đăng…');
  try {
    const { doc } = await sendJson('/docs', 'POST', { title, lesson: fLesson.value, text: fBody.value });
    docs.unshift(doc);
    fTitle.value = '';
    fBody.value = '';
    updateParseInfo();
    setStatus(`Đã đăng "${doc.title}" (${doc.blocks.length} đoạn). Học sinh mở được ngay.`, 'ok');
    renderTeacherDocs();
  } catch (err) {
    setStatus(errMsg(err), 'error');
  } finally {
    btn.disabled = false;
  }
});

function renderTeacherDocs() {
  const ul = $('#teacherDocs');
  ul.replaceChildren();
  if (!docs.length) { ul.append(el('li', 'small muted', 'Chưa có tài liệu nào.')); return; }
  for (const d of docs) {
    const li = el('li', 't-doc');
    const title = el('div', 't-doc-title', d.title);
    if (d.sample) title.append(' ', el('span', 'badge', 'Mẫu'));
    const metaLine = el('div', 't-doc-meta', [d.lesson, d.teacher, fmtDate(d.createdAt), `${d.blocks.length} đoạn`].filter(Boolean).join(' · '));
    const row = el('div', 't-doc-row');
    const del = el('button', 'link danger', 'Xoá');
    del.type = 'button';
    let armed = null;
    del.addEventListener('click', async () => {
      if (!armed) {
        del.textContent = 'Bấm lần nữa để xoá';
        armed = setTimeout(() => { armed = null; del.textContent = 'Xoá'; }, 3000);
        return;
      }
      clearTimeout(armed);
      try {
        await apiFetch(`/docs/${d.id}`, { method: 'DELETE' });
        docs = docs.filter(x => x.id !== d.id);
        renderTeacherDocs();
        setStatus(`Đã xoá "${d.title}" cùng các ghi chú của học sinh trên bài này.`, 'ok');
      } catch (err) {
        setStatus(errMsg(err), 'error');
      }
    });
    row.append(del);
    li.append(title, metaLine, row);
    ul.append(li);
  }
}

/* ---------- Khởi động ---------- */
if (session) {
  enterApp().catch(err => {
    if (session) { showView('login'); $('#loginStatus').textContent = errMsg(err); }
  });
} else {
  showView('login');
}
