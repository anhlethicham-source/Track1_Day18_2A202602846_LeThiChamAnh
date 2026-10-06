# AI Support Log

> Ghi minh bạch những việc có dùng AI trong Day 18: AI làm gì, sai ở đâu, mình kiểm chứng và sửa thế nào.

| Giai đoạn | Công cụ | AI đã giúp gì | Điểm sai / hời hợt của AI | Mình đã kiểm chứng / tự sửa thế nào |
|---|---|---|---|---|
| Code prototype A | Claude Code | Viết máy chủ Node, giao diện tô màu, phần gọi AI và prompt tổng hợp | Có màn chờ ("AI đang đọc bài học…") nhưng chưa đủ nổi bật: trong phiên thử, người thử không nhận ra AI đang tổng hợp | Phát hiện nhờ quan sát người thử thật, không phải nhờ đọc code; ghi vào phiếu ghi chép để cân nhắc ở Next Change |
| Chọn model AI cho prototype A | Claude Code | Đo thử các model trên vyceai, đổi mặc định sang `agnes-3.0-flash` | Model ban đầu (`claude-sonnet-4-6`) bị vyceai ngắt sau ~20 giây nên bản tổng hợp lỗi `timeout` | Chạy thử lại bản tổng hợp với `agnes-3.0-flash`: chữ đầu hiện sau khoảng 11 giây, xong sau khoảng 35 giây, không còn lỗi `timeout` |
| Three-option design sheet | Claude Code | Đề xuất trục so sánh (AI can thiệp lúc nào, học sinh tốn bao nhiêu công sức) và khung mô tả option B, C | AI đề xuất 3 option, không biết nhóm chỉ có 2 người | Bỏ option C, giữ 2 option A và B cho khớp với số người trong nhóm |
| Khung phiếu ghi chép và bản tổng hợp nhóm | Claude Code | Soạn khung bảng, kịch bản phiên thử, nhiệm vụ cho người thử | Không thể tự điền kết quả phiên; mọi ô quan sát để trống cho mình điền | Tự điền quan sát và lời nói của người thử từ phiên trực tiếp ngày 05/10/2026; những ô không ghi kịp trong phiên vẫn để trống, không để AI đoán |
| README | Claude Code | Sắp xếp README thành 6 mục và chuyển phần kỹ thuật xuống phụ lục | Ban đầu README mô tả option B là "Hỏi ngay tại chỗ", không khớp với prototype Linh thực sự build | Đọc lại repo của Linh, đổi option B thành "Gọi AI khi cần" ở README và design sheet |
| Tổng hợp nhóm (group feedback synthesis) | Claude Code | Đọc repo của Linh, ghép phiên của mình với phiên của Linh, đề xuất pattern, trạng thái giả định và Next Change | Phiên của Linh là phiên mô phỏng (tester do AI dựng); nếu không ghi nhãn sẽ bị đọc nhầm là dữ liệu người thật. Phương án A trong repo Linh ("Tự biên soạn") khác option A của nhóm, dễ bị so sánh nhầm | Ghi rõ phiên 2 là mô phỏng ở đầu bản tổng hợp; chỉ giữ pattern có ở cả 2 phiên; ghi rõ phiên 2 không thử option A của nhóm. Tự kiểm lại từng trích dẫn với phiếu ghi chép gốc |

## Điều mình học được về cách dùng AI hôm nay

AI giúp nhanh thật ở phần dựng code, đo thử model và sắp khung tài liệu. AI không thay được việc ngồi quan sát người thử: lỗi màn chờ và mong muốn "hỏi tiếp trên bản note" đều đến từ phiên thật, không từ AI. Khi tổng hợp, mình phải tự kiểm xem dữ liệu nào là thật, dữ liệu nào là mô phỏng, vì AI viết hai loại này trôi chảy như nhau.
