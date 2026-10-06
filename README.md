# Track1_Day18_2A202602846_LeThiChamAnh

> Bài nộp Day 18: Design the Experiment cho **Case B: AI Notes (Personal Learning Notes)**
>
> | File | Nội dung |
> |---|---|
> | [`three-option-design-sheet.md`](three-option-design-sheet.md) | Thiết kế 2 option A/B (nhóm 2 người nên làm 2 option) |
> | [`prototype-link.md`](prototype-link.md) | Link truy cập 2 micro-prototype |
> | [`prototype-feedback-note.md`](prototype-feedback-note.md) | Phiếu ghi chép phiên thử do mình điều phối |
> | [`group-feedback-synthesis.md`](group-feedback-synthesis.md) | Tổng hợp 2 phiên của nhóm và quyết định Next Change |
> | [`ai-support-log.md`](ai-support-log.md) | Nhật ký dùng AI |

---

## 1. Thông tin cá nhân và nhóm

| Mục | Nội dung            |
|---|---------------------|
| MHV | 2A202602846         |
| Họ tên | Lê Thị Châm Anh     |
| Case | **Case B: AI Notes: Personal Learning Notes** |
| Nhóm | Lê Thị Châm Anh - 2A202602846, Nguyễn Ngọc Linh - 2A202602480 |
| Vai trò của mình trong nhóm | Thiết kế và build prototype A, điều phối phiên thử 1, viết bản tổng hợp nhóm |
| Vai trò của Linh | Thiết kế và build prototype B, điều phối phiên thử 2 (mô phỏng) |

## 2. Vấn đề và giả định mang đi thử (kế thừa Day 17)

**Người dùng:** học sinh / học viên tự học, có thói quen tô và ghi chú khi đọc bài.

**Vấn đề:** dấu vết học tập rời rạc, hiếm được xem lại; chỗ "chưa hiểu" bị bỏ quên. Phỏng vấn Day 17 cho thấy người học ghi vào notepad nhưng note "mất đi context" và họ "chưa có khả năng ôn tập lại" vì học quá nhiều.

| # | Giả định | Option kiểm chứng chính |
|---|---|---|
| H1 | Học sinh thực sự tự tô và ghi chú khi học | A (có tự tô mà không cần nhắc không) |
| H2 | Học sinh quay lại dùng note để ôn tập (**rủi ro nhất**) | A |
| H3 | Chỗ chưa hiểu cần được giải ngay, để sau sẽ quên | B |
| H4 | Học sinh chấp nhận AI tổ chức note nếu được sửa và xác nhận | A, B |

## 3. Hai option thiết kế

Nhóm có 2 người nên làm 2 option: **A do Châm Anh**, **B do Linh**. Hai option khác nhau ở một trục: **AI can thiệp lúc nào và học sinh tốn bao nhiêu công sức.** Chi tiết: [`three-option-design-sheet.md`](three-option-design-sheet.md).

| | A: Tô rồi tổng hợp (Châm Anh) | B: Gọi AI khi cần (Linh) |
|---|---|---|
| AI làm việc khi nào | Một lần, sau khi học xong cả bài | Khi học sinh chủ động yêu cầu, trên từng dấu vết đã lưu |
| Công sức học sinh | Cao (tô cả bài) | Trung bình (rà và sửa bản nháp) |
| Output | Bản tổng hợp 4 mục | Bản nháp ghi chú ngắn, nhãn "chưa xác minh", đặt cạnh đoạn nguồn |
| Mức prototype | App chạy thật, gọi AI thật | Click-through Markdown, câu trả lời AI soạn sẵn |

## 4. Micro-prototype

Link: [`prototype-link.md`](prototype-link.md).

## 5. Kết quả thử nghiệm và Next Change

- **Phiên của mình (thật, 05/10/2026):** người thử chọn **A** vì "muốn chủ động hơn", chỉ muốn note phần kiến thức mới. Điều quan trọng nhất: lúc chờ AI tổng hợp, người thử không nhận ra AI đang chạy; cuối phiên họ muốn được hỏi tiếp ngay trên bản note. Chi tiết: [`prototype-feedback-note.md`](prototype-feedback-note.md)
- **Phiên của Linh (mô phỏng, tester do AI dựng):** T1 chọn **B** vì "biết lúc nào mình nhờ AI", đối chiếu nháp với nguồn rồi mới lưu.
- **Pattern của cả nhóm:** (P1) người thử chọn phương án mà mình giữ quyền chủ động; (P2) người thử khựng lại khi không rõ AI đang làm gì; (P3) người thử muốn hỏi tiếp hoặc tự kiểm tra, không coi output của AI là điểm cuối. Vì phiên 2 là mô phỏng nên đây mới là tín hiệu. Chi tiết: [`group-feedback-synthesis.md`](group-feedback-synthesis.md)
- **Next Change:** giữ A, thêm nút **Hỏi tiếp** dưới mỗi mục "Giải đáp chỗ chưa hiểu". Học sinh tự bấm khi vẫn chưa hiểu, AI trả lời ngắn dựa trên bài học và kèm trích đoạn nguồn. Lý do: AI chỉ chạy khi học sinh muốn (P1) và người thử xin đúng tính năng này (P3).

## 6. Reflection và AI Support Log

**Điều mình học được khi làm parallel prototype:** khi đặt hai cách cạnh nhau, người thử nói được vì sao họ chọn, điều mà hỏi về một prototype đơn lẻ khó có được. Lý do chọn ("muốn chủ động hơn") quan trọng hơn bản thân lựa chọn, và nó chỉ ra hướng ghép hai option chứ không phải chọn một bỏ một. Mình cũng thấy một lỗi nhỏ ở màn chờ chỉ lộ ra khi quan sát người thật dùng, đọc code không thấy.

**Nếu làm lại, mình sẽ đổi:** thống nhất với Linh một bài học chung cho cả A và B ngay từ đầu; làm prototype B ở cùng mức với A (hoặc hạ A xuống cùng mức với B) để so sánh công bằng; ghi số liệu ngay trong phiên; và cả hai người đều test với người thật thay vì một phiên mô phỏng.

**AI Support Log:** [`ai-support-log.md`](ai-support-log.md)

---

## Phụ lục: Prototype A "Tô Bài", sổ tay học bài cho học sinh

Người dùng chính là **học sinh**: đọc tài liệu, tô lại những chỗ quan trọng và những chỗ thấy khó, rồi nhờ AI tổng hợp và giải thích. Giáo viên chỉ làm một việc là đăng tài liệu.

1. Giáo viên đăng tài liệu (PDF, Word, .txt, .md hoặc dán chữ).
2. **Học sinh** đọc và tô màu: **xanh = quan trọng**, **đỏ = chưa hiểu** (kèm câu hỏi).
3. Bấm **AI tổng hợp kiến thức bài này**: máy chủ gửi **toàn bộ nội dung bài học** cùng các đoạn học sinh đã tô cho Claude. Claude viết bản tổng hợp riêng cho học sinh đó:
   - **Kiến thức trọng tâm**: hệ thống lại các ý tô xanh, nối các ý theo mạch của bài.
   - **Giải đáp chỗ chưa hiểu**: từng đoạn tô đỏ được giải thích dựa trên chính bài học, có ví dụ, trả lời câu hỏi học sinh đã ghi.
   - **Tự kiểm tra**: 3 đến 5 câu hỏi kèm đáp án gợi ý.
   - **Tìm hiểu thêm**: từ khoá để tra cứu tiếp.
4. Bản tổng hợp hiện dần lên màn hình trong lúc AI viết, được lưu lại để mở lại sau.
5. Ghi chú, câu hỏi và bản tổng hợp là **riêng của từng học sinh**. Giáo viên không xem được.

### Chạy

Cần Node.js 22.9 trở lên và một khoá AI theo chuẩn OpenAI (mặc định dùng vyceai).

```bash
npm install
cp .env.example .env      # rồi điền OPENAI_API_KEY, OPENAI_BASE_URL
npm start                 # mở http://localhost:3000
```

- Học sinh: nhập tên rồi bấm **Vào học**.
- Giáo viên: bấm **Đăng nhập giáo viên** ở cuối trang, nhập tên và mã giáo viên (`TEACHER_CODE` trong `.env`, mặc định `giaovien`).
- Lần chạy đầu có sẵn một bài mẫu "Design the Experiment".
- Để cả lớp dùng chung qua mạng LAN, mở `http://<IP-máy-chạy-server>:3000` trên máy khác.

### Cấu trúc

| File | Vai trò |
| --- | --- |
| `server.js` | Máy chủ Node (không framework): API, đăng nhập, lưu dữ liệu vào `data/db.json`, phục vụ `public/` |
| `llm.js` | Gọi AI qua thư viện `openai`: dựng prompt từ bài học + các đoạn tô, stream kết quả, tự chuyển model dự phòng |
| `sample.js` | Bài mẫu tạo ở lần chạy đầu |
| `public/index.html`, `styles.css`, `app.js` | Giao diện: đăng nhập, đọc và tô màu, bản note, hộp AI, trang đăng tài liệu |
| `public/doc.js` | Dùng chung giữa trình duyệt và máy chủ: tách văn bản thành khối, tính vị trí và mục của đoạn tô |

### API

| Phương thức | Đường dẫn | Ai dùng | Việc |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | mọi người | `{name, role, code?}` → `{token, user}` |
| GET | `/api/docs` | đã đăng nhập | Danh sách tài liệu |
| POST | `/api/docs` | giáo viên | `{title, lesson, text}` → tạo tài liệu |
| DELETE | `/api/docs/:id` | giáo viên | Xoá tài liệu cùng vùng tô, bản tổng hợp |
| GET | `/api/highlights` | học sinh | Các vùng tô của mình |
| PUT | `/api/docs/:id/highlights` | học sinh | Lưu toàn bộ vùng tô của mình trên một bài |
| POST | `/api/docs/:id/summaries` | học sinh | AI tổng hợp, trả về NDJSON stream: `start`, `delta`, `done` hoặc `error` |
| GET | `/api/docs/:id/summaries` | học sinh | Các bản tổng hợp đã lưu |

### Cách gọi AI

- Gọi qua API chuẩn OpenAI (`OPENAI_BASE_URL`, mặc định vyceai), stream để học sinh thấy chữ hiện dần.
- `OPENAI_MODEL` là danh sách model cách nhau bằng dấu phẩy, mặc định `agnes-3.0-flash,deepseek-v4-flash`. Nếu model đầu lỗi trước khi viết được chữ nào, app tự thử model tiếp theo.
- Vì sao không dùng `claude-sonnet-4-6` làm mặc định: trên vyceai, nhiều model bị gom cả câu trả lời rồi mới gửi, và vyceai ngắt sau khoảng 20 giây. Bản tổng hợp dài (30 đến 50 giây) sẽ bị lỗi `timeout`. `agnes-3.0-flash` gửi chữ về dần nên không bị ngắt (đo thử: chữ đầu sau khoảng 11 giây, xong sau khoảng 35 giây).
- Xem model mà khoá được dùng: gọi `GET <OPENAI_BASE_URL>/models`.
- Nội dung bài học nằm trong lời nhắn hệ thống, các đoạn tô và câu hỏi của học sinh nằm trong lời nhắn của người dùng.
- Ghi chú của học sinh được đưa vào như dữ liệu, prompt dặn model không làm theo chỉ dẫn nằm trong đó.
- Khoá API chỉ nằm trên máy chủ, trình duyệt không bao giờ thấy.

### Giới hạn của MVP

- Dữ liệu lưu trong một file JSON, phù hợp một lớp vài chục học sinh. Đông hơn nên chuyển sang SQLite/Postgres.
- Chưa giới hạn số lần gọi AI cho mỗi học sinh. Khi triển khai thật nên đặt hạn mức để kiểm soát chi phí.
- PDF dạng ảnh scan không có lớp chữ nên không đọc được.
