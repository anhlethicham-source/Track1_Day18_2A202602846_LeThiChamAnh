# Option Design Sheet (2 option)

> Case B: AI Notes (Personal Learning Notes) · Tiếp nối kết quả phỏng vấn Day 17
>
> Nhóm có 2 người nên làm 2 option (A và B) thay vì 3. Tên file giữ nguyên theo cấu trúc bài nộp.

---

## 1. Bối cảnh chung cho cả 2 option

**Người dùng:** học sinh / học viên tự học, có thói quen tô và ghi chú khi đọc bài.

**Vấn đề (từ Day 17):** dấu vết học tập (highlight, câu hỏi, chỗ chưa hiểu) rời rạc, hiếm được xem lại. Chỗ "chưa hiểu" thường bị bỏ quên. Người được phỏng vấn ghi chú vào notepad nhưng "lý thuyết ghi trong file nhiều lúc mất đi context của nó" và "học quá nhiều nên chưa có khả năng ôn tập lại".

**Điều cả 2 option giữ giống nhau để so sánh công bằng:**
- Cùng một bài học mẫu: *Design the Experiment: prototype nhiều phương án*.
- Cùng thời lượng thử: khoảng 5 phút mỗi option.
- Cùng câu hỏi sau khi thử (xem `prototype-feedback-note.md`).

**Hai option khác nhau ở một trục chính: _AI can thiệp lúc nào và học sinh phải bỏ bao nhiêu công sức._**

| | Option A: Tô rồi tổng hợp | Option B: Hỏi ngay tại chỗ |
|---|---|---|
| Thời điểm AI làm việc | Sau khi học xong | Ngay trong lúc đọc |
| Công sức của học sinh | Cao (tự tô, tự ghi câu hỏi) | Trung bình (chỉ tô chỗ khó) |
| Giả định chính đang test | H2: học sinh quay lại dùng bản tổng hợp để ôn | H3: chỗ chưa hiểu cần được giải ngay, để sau sẽ quên |

---

## 2. Option A: Tô màu rồi AI tổng hợp

**Ý tưởng một câu:** học sinh tô xanh chỗ quan trọng, tô đỏ chỗ chưa hiểu (kèm câu hỏi), học xong bấm một nút để AI viết bản tổng hợp riêng.

| Thành phần | Mô tả |
|---|---|
| Trigger | Học sinh bấm **AI tổng hợp kiến thức bài này** sau khi đọc xong |
| Input | Toàn bộ bài học + các đoạn tô xanh/đỏ + câu hỏi học sinh ghi |
| AI action | Hệ thống lại ý tô xanh theo mạch bài, giải thích từng đoạn tô đỏ, ra câu tự kiểm tra |
| Output | Bản tổng hợp 4 mục: Kiến thức trọng tâm · Giải đáp chỗ chưa hiểu · Tự kiểm tra · Tìm hiểu thêm |
| User control | Học sinh quyết định tô gì; bản tổng hợp được lưu lại, mở lại được; có thể tạo lại |

**Luồng chính:** Vào học → chọn bài → tô xanh/đỏ, ghi câu hỏi → bấm tổng hợp → đọc bản tổng hợp hiện dần → lưu.

**Điểm mạnh:** bản note bám đúng những gì học sinh quan tâm; chỗ chưa hiểu được trả lời có ngữ cảnh của bài.

**Rủi ro:** tốn công tô; học sinh có thể không bao giờ bấm tổng hợp; phải chờ khoảng 30 đến 40 giây để AI viết xong.

**Muốn học được từ người thử:**
- Họ có tự tô mà không cần nhắc không? Tô bao nhiêu đoạn?
- Đọc bản tổng hợp xong, họ có nói "mình sẽ mở lại cái này khi ôn" không, và vì sao?

**Mức độ prototype:** chạy được thật (app Node.js trong repo này, gọi AI thật).

---

## 3. Option B: Hỏi ngay tại chỗ

**Ý tưởng một câu:** học sinh bôi đen đoạn khó, AI giải thích ngay trong một khung nhỏ cạnh đoạn đó, không cần đợi học xong.

| Thành phần | Mô tả |
|---|---|
| Trigger | Học sinh bôi đen một đoạn và bấm **Giải thích** |
| Input | Đoạn được chọn + mục chứa đoạn đó + câu hỏi ngắn (không bắt buộc) |
| AI action | Giải thích đoạn đó bằng lời dễ hiểu kèm một ví dụ, bám theo bài |
| Output | Khung giải thích ngắn (3 đến 5 câu) ngay cạnh đoạn văn; có nút **Đã hiểu** / **Vẫn chưa hiểu** |
| User control | Học sinh chọn đoạn nào cần hỏi; có thể hỏi tiếp; lời giải thích được ghim vào lề bài |

**Luồng chính:** Đọc bài → bôi đen chỗ khó → đọc giải thích → bấm Đã hiểu hoặc hỏi tiếp → đọc tiếp.

**Điểm mạnh:** giải quyết chỗ chưa hiểu ngay khi còn nhớ ngữ cảnh; không cần công sức tô cả bài.

**Rủi ro:** không tạo ra bản note tổng để ôn tập; học sinh có thể ỷ lại, hỏi cả những chỗ tự hiểu được; nhiều lần gọi AI nhỏ, tốn chi phí hơn.

**Muốn học được từ người thử:**
- Họ hỏi bao nhiêu lần trong 5 phút? Có chỗ nào hỏi xong vẫn bấm "Vẫn chưa hiểu" không?
- Họ có nhắc tới việc muốn giữ lại các lời giải thích để ôn sau không?

**Mức độ prototype:** `[Figma có thể bấm / HTML tĩnh với câu trả lời viết sẵn / chạy AI thật]`

---

## 4. Cách đo chung khi thử

| Tín hiệu | Cách ghi nhận | Option liên quan |
|---|---|---|
| Hoàn thành nhiệm vụ "chuẩn bị note để mai ôn bài" | Có / Không / Cần nhắc | A, B |
| Số thao tác chủ động (số đoạn tô, số lần hỏi, số ý sửa) | Đếm khi quan sát | A, B |
| Lúc ngập ngừng, lúc hỏi "bấm vào đâu" | Ghi thời điểm và màn hình | A, B |
| Câu nói nguyên văn thể hiện thích / không thích | Trích dẫn | A, B |
| Lựa chọn cuối: "Nếu chỉ được giữ một cách, bạn chọn cái nào?" | Ghi option và lý do | So sánh |

