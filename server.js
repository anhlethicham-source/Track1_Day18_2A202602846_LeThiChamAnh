import http from 'node:http';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { docMeta, parseText } from './public/doc.js';
import { MODEL, llmErrorMessage, streamSummary } from './llm.js';
import { SAMPLE } from './sample.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(here, 'public');
const DATA_FILE = path.join(here, 'data', 'db.json');
const PORT = Number(process.env.PORT) || 3000;
const TEACHER_CODE = process.env.TEACHER_CODE || 'giaovien';

/* ---------- Lưu trữ: một file JSON, ghi lần lượt ---------- */
let db;
let saving = Promise.resolve();

async function loadDb() {
  try {
    db = JSON.parse(await readFile(DATA_FILE, 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    db = { users: [], sessions: {}, docs: [], highlights: [], summaries: [] };
    db.docs.push({ id: newId(), sample: true, title: SAMPLE.title, lesson: SAMPLE.lesson, teacher: SAMPLE.teacher, teacherId: null, createdAt: Date.now(), blocks: parseText(SAMPLE.text) });
    await saveDb();
  }
}

function saveDb() {
  saving = saving
    .then(async () => {
      await mkdir(path.dirname(DATA_FILE), { recursive: true });
      const tmp = DATA_FILE + '.tmp';
      await writeFile(tmp, JSON.stringify(db));
      await rename(tmp, DATA_FILE);
    })
    .catch(err => console.error('Không ghi được dữ liệu:', err));
  return saving;
}

const newId = () => crypto.randomBytes(8).toString('hex');

/* ---------- HTTP helpers ---------- */
class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

async function readJson(req, limit = 8 * 1024 * 1024) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new HttpError(413, 'Nội dung gửi lên quá lớn.');
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new HttpError(400, 'Dữ liệu gửi lên không đúng định dạng JSON.'); }
}

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function currentUser(req) {
  const m = /^Bearer (\w+)$/.exec(req.headers.authorization || '');
  const userId = m && db.sessions[m[1]];
  return userId ? db.users.find(u => u.id === userId) : null;
}

function requireUser(req, role) {
  const user = currentUser(req);
  if (!user) throw new HttpError(401, 'Phiên đăng nhập đã hết. Đăng nhập lại để tiếp tục.');
  if (role && user.role !== role) throw new HttpError(403, role === 'teacher' ? 'Chỉ giáo viên mới làm được việc này.' : 'Chỉ học sinh mới làm được việc này.');
  return user;
}

function findDoc(id) {
  const doc = db.docs.find(d => d.id === id);
  if (!doc) throw new HttpError(404, 'Không tìm thấy tài liệu. Có thể giáo viên đã xoá.');
  return doc;
}

const publicUser = u => ({ id: u.id, name: u.name, role: u.role });

/* ---------- API ---------- */
async function api(req, res, url) {
  const parts = url.pathname.split('/').filter(Boolean).slice(1); // bỏ "api"
  const route = `${req.method} /${parts.map((p, i) => (i % 2 === 1 && parts[i - 1] !== 'auth' ? ':id' : p)).join('/')}`;
  const id = parts[1];

  switch (route) {
    case 'POST /auth/login': {
      const body = await readJson(req);
      const name = str(body.name, 60);
      const role = body.role === 'teacher' ? 'teacher' : 'student';
      if (!name) throw new HttpError(400, 'Nhập tên để vào lớp.');
      if (role === 'teacher' && body.code !== TEACHER_CODE) throw new HttpError(403, 'Mã giáo viên không đúng.');
      let user = db.users.find(u => u.role === role && u.name.toLowerCase() === name.toLowerCase());
      if (!user) { user = { id: newId(), name, role, createdAt: Date.now() }; db.users.push(user); }
      const token = crypto.randomBytes(24).toString('hex');
      db.sessions[token] = user.id;
      await saveDb();
      return send(res, 200, { token, user: publicUser(user) });
    }
    case 'POST /auth/logout': {
      const m = /^Bearer (\w+)$/.exec(req.headers.authorization || '');
      if (m) { delete db.sessions[m[1]]; await saveDb(); }
      return send(res, 200, { ok: true });
    }
    case 'GET /me':
      return send(res, 200, { user: publicUser(requireUser(req)), model: MODEL });

    case 'GET /docs': {
      requireUser(req);
      return send(res, 200, { docs: db.docs });
    }
    case 'POST /docs': {
      const user = requireUser(req, 'teacher');
      const body = await readJson(req);
      const title = str(body.title, 200);
      const blocks = parseText(typeof body.text === 'string' ? body.text : '');
      if (!title) throw new HttpError(400, 'Thêm tiêu đề để học sinh nhận ra tài liệu.');
      if (!blocks.length) throw new HttpError(400, 'Tài liệu chưa có nội dung.');
      const doc = { id: newId(), title, lesson: str(body.lesson, 200), teacher: user.name, teacherId: user.id, createdAt: Date.now(), blocks };
      db.docs.unshift(doc);
      await saveDb();
      return send(res, 201, { doc });
    }
    case 'DELETE /docs/:id': {
      requireUser(req, 'teacher');
      findDoc(id);
      db.docs = db.docs.filter(d => d.id !== id);
      db.highlights = db.highlights.filter(h => h.docId !== id);
      db.summaries = db.summaries.filter(s => s.docId !== id);
      await saveDb();
      return send(res, 200, { ok: true });
    }

    case 'GET /highlights': {
      const user = requireUser(req);
      return send(res, 200, { highlights: db.highlights.filter(h => h.userId === user.id) });
    }
    case 'PUT /docs/:id/highlights': {
      const user = requireUser(req, 'student');
      const doc = findDoc(id);
      const body = await readJson(req);
      const len = docMeta(doc).text.length;
      const list = (Array.isArray(body.highlights) ? body.highlights : [])
        .slice(0, 2000)
        .filter(h => h && Number.isInteger(h.start) && Number.isInteger(h.end) && h.start >= 0 && h.end <= len && h.start < h.end && (h.cat === 'imp' || h.cat === 'q'))
        .map(h => ({
          id: str(h.id, 40) || newId(), docId: doc.id, userId: user.id,
          start: h.start, end: h.end, cat: h.cat, note: str(h.note, 2000), done: !!h.done, at: Number(h.at) || Date.now(),
        }));
      db.highlights = db.highlights.filter(h => !(h.userId === user.id && h.docId === doc.id)).concat(list);
      await saveDb();
      return send(res, 200, { ok: true, count: list.length });
    }

    case 'GET /docs/:id/summaries': {
      const user = requireUser(req);
      findDoc(id);
      const list = db.summaries.filter(s => s.docId === id && s.userId === user.id).sort((a, b) => b.createdAt - a.createdAt);
      return send(res, 200, { summaries: list });
    }
    case 'POST /docs/:id/summaries':
      return createSummary(req, res, requireUser(req, 'student'), findDoc(id));
    case 'DELETE /summaries/:id': {
      const user = requireUser(req);
      db.summaries = db.summaries.filter(s => !(s.id === id && s.userId === user.id));
      await saveDb();
      return send(res, 200, { ok: true });
    }
  }
  throw new HttpError(404, 'Không có đường dẫn này.');
}

/* ---------- AI tổng hợp kiến thức (stream NDJSON) ---------- */
async function createSummary(req, res, user, doc) {
  const highlights = db.highlights.filter(h => h.userId === user.id && h.docId === doc.id);
  if (!highlights.length) throw new HttpError(400, 'Tô ít nhất một đoạn trong bài rồi mới tổng hợp được.');

  res.writeHead(200, { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' });
  const line = obj => res.write(JSON.stringify(obj) + '\n');
  line({ t: 'start', model: MODEL, count: highlights.length });

  const controller = new AbortController();
  let closed = false;
  res.on('close', () => { closed = true; if (!res.writableFinished) controller.abort(); });

  try {
    const gen = streamSummary({ doc, highlights, studentName: user.name, signal: controller.signal });
    let text = '';
    let step;
    while (!(step = await gen.next()).done) {
      text += step.value;
      line({ t: 'delta', text: step.value });
    }
    const { model, finishReason } = step.value;
    if (finishReason === 'content_filter' || !text.trim()) {
      line({ t: 'error', message: 'AI không tạo được bản tổng hợp cho nội dung này. Thử lại, hoặc bớt vài đoạn tô.' });
      return res.end();
    }
    let markdown = text.trim();
    if (finishReason === 'length') markdown += '\n\n_(Bản tổng hợp bị cắt vì quá dài.)_';
    const summary = {
      id: newId(), docId: doc.id, userId: user.id, createdAt: Date.now(), model,
      highlightCount: highlights.length,
      counts: { imp: highlights.filter(h => h.cat === 'imp').length, q: highlights.filter(h => h.cat === 'q').length },
      markdown,
    };
    db.summaries.push(summary);
    await saveDb();
    line({ t: 'done', summary });
    console.log(`Tổng hợp cho ${user.name} · ${doc.title}: ${model}, ${markdown.length} ký tự`);
  } catch (err) {
    if (closed) return;
    console.error('Lỗi gọi AI:', err);
    line({ t: 'error', message: llmErrorMessage(err) });
  }
  res.end();
}

/* ---------- File tĩnh ---------- */
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

async function serveStatic(res, pathname) {
  const rel = pathname === '/' ? 'index.html' : decodeURIComponent(pathname).replace(/^\/+/, '');
  const file = path.resolve(PUBLIC_DIR, rel);
  if (!file.startsWith(PUBLIC_DIR + path.sep)) throw new HttpError(404, 'Không tìm thấy.');
  let data;
  try { data = await readFile(file); } catch { throw new HttpError(404, 'Không tìm thấy.'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  res.end(data);
}

/* ---------- Khởi động ---------- */
await loadDb();
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) await api(req, res, url);
    else if (req.method === 'GET') await serveStatic(res, url.pathname);
    else throw new HttpError(405, 'Phương thức không được hỗ trợ.');
  } catch (err) {
    if (!(err instanceof HttpError)) console.error(err);
    if (res.headersSent) return res.end();
    send(res, err.status || 500, { error: err instanceof HttpError ? err.message : 'Máy chủ gặp lỗi. Thử lại sau.' });
  }
}).listen(PORT, () => {
  console.log(`Tô Bài đang chạy: http://localhost:${PORT}`);
  console.log(`Mã giáo viên: ${TEACHER_CODE}${process.env.TEACHER_CODE ? '' : ' (mặc định, đổi bằng TEACHER_CODE trong .env)'}`);
});
