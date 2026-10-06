# Group Feedback Synthesis

> Tổng hợp 2 phiên thử prototype của nhóm (2 người, mỗi người điều phối 1 phiên) và quyết định **Next Change**.
> Phiên của mình: [`prototype-feedback-note.md`](prototype-feedback-note.md) · Phiên của Linh: [`prototype-feedback-note.md` trong repo của Linh](https://github.com/linhmoimoi/Track1_Day18_2A202602480_NguyenNgocLinh/blob/main/prototype-feedback-note.md)

**Nhóm:** Lê Thị Châm Anh (2A202602846) · Nguyễn Ngọc Linh (2A202602480)
**Case:** Case B: AI Notes: Personal Learning Notes
**Option A** "Tô rồi tổng hợp" do Châm Anh build · **Option B** "Gọi AI khi cần" do Linh build. Chi tiết: [`three-option-design-sheet.md`](three-option-design-sheet.md).

> **Độ tin cậy của dữ liệu.** Phiên 1 là phiên thật, trực tiếp, với một bạn cùng lớp. Phiên 2 là **phiên mô phỏng**: tester T1, lời nói và thao tác do AI dựng theo yêu cầu của Linh, Linh đóng vai điều phối trong kịch bản (repo của Linh ghi rõ nhãn "GIẢ LẬP"). Vì vậy mọi pattern dưới đây chỉ là **tín hiệu cần kiểm chứng**, không phải kết luận từ hai người dùng thật.

---

## 1. Hai phiên của nhóm

| Phiên | Người điều phối | Người thử (mô tả ngắn) | Loại phiên | Prototype đã cho xem | Option được chọn cuối |
|---|---|---|---|---|---|
| 1 | Lê Thị Châm Anh | Bạn cùng lớp, ghi chú bằng notepad / chụp màn hình, khó tìm lại | Thật, trực tiếp, 05/10/2026 | A → B | **A** |
| 2 | Nguyễn Ngọc Linh | T1: học viên A.I Thực Chiến (nhân vật ảo), đã đánh dấu một đoạn handout trong 7 ngày gần đây | Mô phỏng, kịch bản 20 phút | Ba phương án trong repo của Linh: A "Tự biên soạn" → B "Gọi AI khi cần" → C "AI gợi ý khi mở dấu vết" | **B** |

Phiên 2 **không thử Option A "Tô rồi tổng hợp"** của nhóm. Phương án A trong repo của Linh là "Tự biên soạn" (không có AI), khác Option A của nhóm. Vì vậy ở mục 2, cột Option A chỉ có dữ liệu từ phiên 1.

## 2. So sánh theo option

| Tín hiệu | Option A: Tô rồi tổng hợp | Option B: Gọi AI khi cần |
|---|---|---|
| Hoàn thành nhiệm vụ | Phiên 1: có · Phiên 2: không thử | Phiên 1: có · Phiên 2 (mô phỏng): có, sửa nháp rồi lưu |
| Người chọn cuối cùng | Phiên 1 | Phiên 2 (mô phỏng) |
| Điểm vướng | Phiên 1: không biết AI đã tổng hợp hay chưa vì không thấy dấu hiệu, một lúc sau mới thấy | Phiên 2: phải đọc lại từng ý của bản nháp; T1 nói sửa nháp chưa chắc nhanh hơn tự viết |
| Điều người thử thích | Phiên 1: tự quyết phần nào được note, bỏ phần đã học | Phiên 2: biết lúc nào mình nhờ AI; có sẵn một điểm bắt đầu |
| Trích dẫn tiêu biểu | Phiên 1: "Muốn chủ động hơn trong việc ghi nhớ bài, có những phần tuy quan trọng nhưng đã học từ trước thì không cần thiết phải được note lại để lượng kiến thức dài ra." | Phiên 2 (lời thoại mô phỏng): "B thì tôi biết lúc nào mình nhờ AI. Có nháp sẵn, nhưng tôi vẫn phải đọc lại từng ý." |
| Muốn ghép thêm | Phiên 1: sau khi có bản note, được hỏi tiếp AI ngay trên bản note đó để hiểu tường tận bài | Phiên 2: muốn AI gợi một câu đầu, còn mình tự kiểm tra với nguồn |

## 3. Pattern rút ra

Chỉ ghi là pattern khi điều đó xuất hiện ở **cả 2 phiên**. Vì phiên 2 là mô phỏng, cột bằng chứng phiên 2 chỉ là hành vi trong kịch bản.

| # | Pattern | Bằng chứng phiên 1 (thật) | Bằng chứng phiên 2 (mô phỏng) |
|---|---|---|---|
| P1 | **Người thử chọn phương án mà mình giữ quyền chủ động**: tự quyết cái gì được ghi, tự quyết lúc nào nhờ AI | Chọn A vì "muốn chủ động hơn", chỉ note phần mới | Chọn B vì "biết lúc nào mình nhờ AI"; ở C bất ngờ khi AI tự viết ("Ủa, tôi chỉ mở đoạn thôi mà, sao nó viết luôn rồi?") |
| P2 | **Người thử khựng lại khi không rõ AI đang làm gì hoặc vì sao AI làm** | Ở A, không biết bản tổng hợp đã chạy chưa vì màn chờ không đủ nổi bật | Ở C, gợi ý tự hiện mà không hiểu vì sao; phải nhìn xuống dưới mới thấy đường "Bỏ qua" |
| P3 | **Người thử không coi output của AI là điểm cuối**: muốn hỏi tiếp hoặc tự kiểm tra lại | Muốn hỏi tiếp ngay trên bản note đã tạo để hiểu tường tận | Đối chiếu bản nháp B với đoạn nguồn, bỏ một câu thừa rồi mới lưu |

**Tín hiệu lẻ (cần thêm phiên để xác nhận):**
- Phiên 1: người thử chỉ muốn note kiến thức **mới**, không note phần đã học dù quan trọng.
- Phiên 2: công rà và sửa bản nháp B có thể không ít hơn công tự viết (không có đo thời gian).
- Repo của Linh có thêm 2 kịch bản mô phỏng T2, T3 (T2 lưu nháp B mà không đối chiếu nguồn; T3 chọn C). Nhóm không tính vào bảng này vì không thuộc 2 phiên của nhóm, nhưng T2 gợi ý một rủi ro đáng theo dõi: **đặt nguồn cạnh bản nháp chưa bảo đảm người dùng sẽ đọc nguồn**.

## 4. Giả định sau 2 phiên

| Giả định | Trạng thái | Dựa trên |
|---|---|---|
| H1: học sinh thực sự tự tô và ghi chú | **Ủng hộ yếu**: người thử phiên 1 tự tô mà không cần nhắc, nhưng chỉ tô phần mới. Phiên 2 không thử việc tô | Phiên 1, tín hiệu lẻ |
| H2: học sinh quay lại dùng note để ôn | **Chưa rõ**: cả hai phiên chỉ thử một lần, không quan sát được việc quay lại. Đây vẫn là giả định rủi ro nhất | Không có bằng chứng |
| H3: chỗ chưa hiểu cần được giải ngay | **Có tín hiệu, chưa rõ**: người thử muốn hỏi tiếp và tự kiểm tra, nhưng chưa thấy "ngay" quan trọng hơn "sau khi học xong" | P3 |
| H4: chấp nhận AI tổ chức note nếu được sửa và xác nhận | **Ủng hộ có điều kiện**: cả hai người thử chọn phương án mà họ giữ quyền quyết định; khi AI tự làm trước (C) thì người thử bất ngờ | P1, P2 |

## 5. Quyết định Next Change

| Mục | Nội dung |
|---|---|
| Hướng đi | **Giữ A, ghép thêm cơ chế "gọi AI khi cần" của B** |
| Thay đổi cụ thể sẽ làm | Trong bản tổng hợp của A, dưới mỗi mục ở phần **Giải đáp chỗ chưa hiểu**, thêm nút **Hỏi tiếp**. Học sinh tự bấm khi vẫn chưa hiểu một đoạn tô đỏ, gõ câu hỏi; AI trả lời ngắn (3 đến 5 câu) chỉ dựa trên bài học, kèm trích đoạn nguồn để đối chiếu. Câu trả lời gắn vào bản note, có nhãn "AI trả lời" và học sinh chọn giữ hay bỏ |
| Vì sao (dẫn về pattern) | P1: AI chỉ chạy khi học sinh bấm, học sinh giữ quyền chủ động. P3: người thử phiên 1 xin đúng tính năng này; người thử phiên 2 muốn đối chiếu với nguồn trước khi lưu |
| Sửa kèm (không tính là Next Change) | Làm màn chờ của A rõ hơn: nút đổi trạng thái ngay khi bấm, có thời gian ước tính, để học sinh biết AI đang chạy (P2) |
| Điều nhóm cố ý **không** làm lần này | Không làm gợi ý AI tự hiện khi mở bài (cơ chế C của Linh), vì phiên 2 cho thấy AI tự làm trước gây bất ngờ. Không làm chế độ "AI tự tô hộ". Không làm phần nhắc ôn tập theo lịch (H2) cho tới khi có bằng chứng học sinh quay lại |
| Cách biết thay đổi này đúng | Ở vòng thử tiếp theo với người thật: người thử tự bấm **Hỏi tiếp** ít nhất một lần mà không cần nhắc; người thử đọc trích đoạn nguồn trước khi bấm giữ câu trả lời; khi được hỏi "tối mai ôn bài bạn mở lại gì", người thử chỉ vào bản note có phần hỏi tiếp |
| Rủi ro còn lại | Chỉ có 2 phiên và phiên 2 là mô phỏng, nên pattern còn yếu. Hai prototype dùng hai bài học khác nhau. Chưa biết học sinh có quay lại ôn bằng note không (H2). Nút **Hỏi tiếp** làm tăng số lần gọi AI, cần đặt hạn mức chi phí |

## 6. Khác biệt trong nhóm và cách chốt

Nhóm không có bất đồng lớn về Next Change. Có ba khác biệt về cách làm, đã chốt như sau:

| Khác biệt | Châm Anh | Linh | Nhóm chốt |
|---|---|---|---|
| Cách phát biểu vấn đề | Dấu vết học tập rời rạc, ít được xem lại; chỗ chưa hiểu bị bỏ quên | Khó tìm lại và ghép ngữ cảnh dấu vết vì dấu vết nằm nhiều nơi, thiếu liên kết với nguồn | Dùng vấn đề chung: **dấu vết học tập mất ngữ cảnh và ít được xem lại**. Cách của Linh nhấn mạnh việc giữ nguồn, nên Next Change bắt buộc kèm trích đoạn nguồn |
| Mức độ prototype | App chạy thật, gọi AI thật | Click-through Markdown, câu trả lời AI soạn sẵn | Giữ cả hai cho vòng này. Vòng sau làm Next Change trên app của A |
| Cách test | Phiên thật với bạn cùng lớp | Phiên mô phỏng có nhãn rõ ràng | Vòng sau cả hai người đều điều phối phiên với người thật, dùng **cùng một bài học** cho A và B |
