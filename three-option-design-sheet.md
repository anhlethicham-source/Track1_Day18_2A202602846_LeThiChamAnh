# Option Design Sheet (2 option)

> Case B: AI Notes (Personal Learning Notes) · Tiếp nối kết quả phỏng vấn Day 17
>
> Nhóm có 2 người nên làm 2 option (A và B) thay vì 3. Tên file giữ nguyên theo cấu trúc bài nộp.

---

## 1. Bối cảnh chung cho cả 2 option

**Người dùng:** học sinh / học viên tự học, có thói quen tô và ghi chú khi đọc bài.

**Vấn đề (từ Day 17):** dấu vết học tập (highlight, câu hỏi, chỗ chưa hiểu) rời rạc, hiếm được xem lại. Chỗ "chưa hiểu" thường bị bỏ quên. Người được phỏng vấn ghi chú vào notepad nhưng "lý thuyết ghi trong file nhiều lúc mất đi context của nó" và "học quá nhiều nên chưa có khả năng ôn tập lại". Lượt luyện phỏng vấn Day 17 của Linh cho tín hiệu tương tự: người học chụp/lưu phần khó rồi tốn thêm thời gian đối chiếu lại với nguồn (tín hiệu đơn lẻ, interviewer đã nhắc công cụ AI trước).

**Phân công:** Option A do **Lê Thị Châm Anh** thiết kế và build. Option B do **Nguyễn Ngọc Linh** thiết kế và build (là phương án "Gọi AI khi cần" trong repo của Linh).

**Điều cả 2 option giữ giống nhau:**
- Cùng câu hỏi sau khi thử (xem `prototype-feedback-note.md`).
- Cùng thời lượng thử: khoảng 5 phút mỗi option.
- AI không tự lưu gì; học sinh là người quyết định cái gì được giữ lại.

**Điều chưa giống nhau (giới hạn đã biết):** hai prototype dùng **hai bài học mẫu khác nhau**. A dùng bài *Design the Experiment: prototype nhiều phương án*; B dùng đoạn handout mẫu *"Rà câu trả lời AI với tài liệu nguồn"*. A gọi AI thật, B dùng câu trả lời AI soạn sẵn. Vòng sau cần đưa về cùng một bài để so sánh công bằng hơn.

**Hai option khác nhau ở một trục chính: _AI can thiệp lúc nào và học sinh phải bỏ bao nhiêu công sức._**

| | Option A: Tô rồi tổng hợp | Option B: Gọi AI khi cần |
|---|---|---|
| Thời điểm AI làm việc | Một lần, sau khi học xong cả bài | Mỗi khi học sinh chủ động yêu cầu, trên từng dấu vết đã lưu |
| Phạm vi AI đọc | Toàn bộ bài học + mọi đoạn đã tô | Chỉ đoạn đã đánh dấu + câu hỏi + vị trí nguồn |
| Công sức của học sinh | Cao (tự tô cả bài, tự ghi câu hỏi) | Trung bình (chọn dấu vết, rà và sửa bản nháp) |
| Giả định chính đang test | H2: học sinh quay lại dùng bản tổng hợp để ôn | H3: chỗ chưa hiểu cần được giải ngay; H4: học sinh chấp nhận AI soạn nếu được sửa và xác nhận |

---

## 2. Option A: Tô màu rồi AI tổng hợp (Châm Anh)

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

## 3. Option B: Gọi AI khi cần (Linh)

**Ý tưởng một câu:** học sinh mở một dấu vết đã lưu (đoạn đánh dấu + câu hỏi còn mở), chủ động bấm yêu cầu AI soạn một bản nháp ghi chú, rồi tự đối chiếu với nguồn để sửa, lưu, để câu hỏi mở hoặc bỏ.

| Thành phần | Mô tả |
|---|---|
| Trigger | Học sinh mở dấu vết rồi bấm **Yêu cầu AI soạn nháp**. Trước khi bấm, màn hình nói rõ AI chỉ dùng đoạn đang mở, không dùng nguồn ngoài, không tự xác minh, không tự lưu |
| Input | Đoạn được đánh dấu + câu hỏi còn mở + vị trí nguồn (tên buổi, mục) |
| AI action | Soạn một bản nháp ghi chú ngắn trả lời câu hỏi, giới hạn trong đoạn nguồn |
| Output | Bản nháp dán nhãn **"chưa xác minh, chưa lưu"**, đặt cạnh đoạn nguồn để đối chiếu |
| User control | Sửa rồi lưu · lưu như đang thấy · để câu hỏi mở · bỏ nháp và tự viết · dừng và quay về nguồn. Note lưu xong mang nhãn "có hỗ trợ AI, chưa xác minh" kèm nguồn |

**Luồng chính:** Mở dấu vết → đọc giới hạn của AI → yêu cầu nháp → đối chiếu với đoạn nguồn → sửa/lưu, để mở hoặc bỏ.

**Điểm mạnh:** học sinh biết rõ lúc nào mình nhờ AI; có điểm bắt đầu thay vì tự viết từ trang trắng; nguồn luôn nằm cạnh bản nháp.

**Rủi ro:** học sinh có thể lưu bản nháp mà không đối chiếu nguồn; công rà và sửa nháp chưa chắc ít hơn công tự viết; mỗi dấu vết một lần gọi AI nên chi phí tăng theo số lần hỏi.

**Muốn học được từ người thử:**
- Họ có đọc đoạn nguồn trước khi lưu bản nháp không?
- Họ sửa gì trong bản nháp, hay lưu nguyên?
- Họ có thấy đường "bỏ nháp, tự làm tiếp" khi không muốn dùng AI không?

**Mức độ prototype:** click-through Markdown trong repo của Linh, câu trả lời AI soạn sẵn (không gọi model). Không có ô nhập: người thử nói thành lời nội dung muốn viết hoặc sửa.

---

## 4. Cách đo chung khi thử

| Tín hiệu | Cách ghi nhận | Option liên quan |
|---|---|---|
| Hoàn thành nhiệm vụ "chuẩn bị note để mai ôn bài" | Có / Không / Cần nhắc | A, B |
| Số thao tác chủ động (số đoạn tô, số lần hỏi, số ý sửa) | Đếm khi quan sát | A, B |
| Lúc ngập ngừng, lúc hỏi "bấm vào đâu" | Ghi thời điểm và màn hình | A, B |
| Câu nói nguyên văn thể hiện thích / không thích | Trích dẫn | A, B |
| Lựa chọn cuối: "Nếu chỉ được giữ một cách, bạn chọn cái nào?" | Ghi option và lý do | So sánh |

