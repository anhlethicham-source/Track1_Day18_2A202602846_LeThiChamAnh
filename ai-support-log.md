# AI Support Log

> Ghi minh bạch những việc có dùng AI trong Day 18: AI làm gì, sai ở đâu, mình kiểm chứng và sửa thế nào.

| Giai đoạn | Công cụ | AI đã giúp gì | Điểm sai / hời hợt của AI | Mình đã kiểm chứng / tự sửa thế nào |
|---|---|---|---|---|
| Code prototype A | Claude Code | Viết máy chủ Node, giao diện tô màu, phần gọi AI và prompt tổng hợp | Có màn chờ ("AI đang đọc bài học…") nhưng chưa đủ nổi bật: trong phiên thử, người thử không nhận ra AI đang tổng hợp | Phát hiện nhờ quan sát người thử thật, không phải nhờ đọc code; ghi vào phiếu ghi chép để cân nhắc ở Next Change |
| Chọn model AI cho prototype A | Claude Code | Đo thử các model trên vyceai, đổi mặc định sang `agnes-3.0-flash` | Model ban đầu (`claude-sonnet-4-6`) bị vyceai ngắt sau ~20 giây nên bản tổng hợp lỗi `timeout` | Chạy thử lại bản tổng hợp với `agnes-3.0-flash`: chữ đầu hiện sau khoảng 11 giây, xong sau khoảng 35 giây, không còn lỗi `timeout` |
| Three-option design sheet | Claude Code | Đề xuất trục so sánh (AI can thiệp lúc nào, học sinh tốn bao nhiêu công sức) và khung mô tả option B, C | AI đề xuất 3 option, không biết nhóm chỉ có 2 người | Bỏ option C, giữ 2 option A và B cho khớp với số người trong nhóm |
| Khung phiếu ghi chép và bản tổng hợp nhóm | Claude Code | Soạn khung bảng, kịch bản phiên thử, nhiệm vụ cho người thử | Không thể tự điền kết quả phiên; mọi ô quan sát để trống cho mình điền | `[…]` |
| README | Claude Code | Sắp xếp README thành 6 mục và chuyển phần kỹ thuật xuống phụ lục | `[…]` | `[…]` |
| `[Thêm dòng nếu dùng AI ở việc khác]` | | | | |

## Điều mình học được về cách dùng AI hôm nay

`[2–3 câu: lúc nào AI giúp nhanh thật, lúc nào phải tự làm vì AI không có dữ liệu]`
