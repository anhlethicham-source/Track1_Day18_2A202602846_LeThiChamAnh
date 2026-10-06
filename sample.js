// Tài liệu mẫu được tạo khi máy chủ chạy lần đầu.
export const SAMPLE = {
  title: 'Design the Experiment: prototype nhiều phương án',
  lesson: 'AI in Action · Day 18 · Track 1',
  teacher: 'Giảng viên Track 1',
  text: `# 1. Vì sao phải đưa prototype ra sớm
Một ý tưởng sản phẩm AI chỉ là giả thuyết cho đến khi người dùng thật chạm vào nó. Prototype là cách rẻ nhất để biến giả thuyết thành bằng chứng: ta quan sát người dùng làm gì, chứ không chỉ nghe họ nói gì.

Prototype không cần đẹp. Một bản phác trên giấy, một màn hình Figma hay một prompt chạy trong notebook đều đủ, miễn là nó trả lời được câu hỏi ta đang muốn kiểm chứng.

# 2. Parallel prototype
Thay vì làm một phương án rồi sửa dần, nhóm làm song song hai đến ba phương án khác nhau rõ rệt và đưa cho người dùng thử cùng lúc. Nghiên cứu của Dow và cộng sự (2010) cho thấy các nhóm làm prototype song song đạt kết quả thiết kế tốt hơn và ít bị "dính" vào ý tưởng đầu tiên hơn so với các nhóm làm tuần tự.

Khi chỉ có một phương án, người dùng thường lịch sự khen. Khi có nhiều phương án, họ so sánh và nói thật điều họ thích hay không thích.

# 3. Các phương án phải khác nhau thế nào
- Khác về cách AI tham gia: AI làm thay, AI gợi ý để người dùng chọn, hay AI chỉ kiểm tra lại kết quả.
- Khác về cách hiển thị độ tin cậy: hiện điểm số, hiện nguồn trích dẫn, hoặc không hiện gì.
- Khác về thời điểm người dùng có thể sửa sai: trước khi AI chạy, trong lúc chạy, hay sau khi có kết quả.

Nếu hai phương án chỉ khác màu nút hoặc vị trí menu, đó là biến thể giao diện, không phải phương án thiết kế.

# 4. Thí nghiệm không phải trình diễn
Mục tiêu của buổi thử nghiệm là học, không phải thuyết phục. Trước khi thử, viết ra giả thuyết và tiêu chí thất bại. Ví dụ: "Nếu quá 3 trên 5 người dùng không nhận ra AI đã trả lời sai, phương án B không đạt."

Ghi lại hành vi quan sát được, thời gian hoàn thành nhiệm vụ và những chỗ người dùng do dự. Tránh câu hỏi dẫn dắt như "Bạn thấy tính năng này hữu ích chứ?".

# 5. Thiết kế khi AI sai
Mọi mô hình AI đều có lúc sai. Thiết kế lấy con người làm trung tâm bắt đầu bằng việc chấp nhận điều đó và trả lời ba câu hỏi: người dùng có nhận ra AI sai không, họ có sửa được không, và cái giá của một lỗi là bao nhiêu.

Khoảng cách giữa mô hình tư duy của người dùng và cách AI thực sự hoạt động là nguồn gốc của nhiều lỗi nghiêm trọng. Người dùng nghĩ AI "hiểu" yêu cầu, trong khi mô hình chỉ dự đoán câu trả lời có xác suất cao nhất.`,
};
