# Link Micro-Prototype A / B

> Thiết kế chi tiết của từng option: [`three-option-design-sheet.md`](three-option-design-sheet.md)

| Option | Tên | Link truy cập | Loại prototype | Ghi chú |
|---|---|---|---|---|
| A | Tô màu rồi AI tổng hợp | Chưa deploy. Trong phiên thử chạy trên máy của mình tại `http://localhost:3000` (cách chạy ở bên dưới) | App chạy thật (Node.js + AI) | Châm Anh build. Mã nguồn chính là repo này |
| B | Gọi AI khi cần | [prototype-link.md#b0 (repo của Linh)](https://github.com/linhmoimoi/Track1_Day18_2A202602480_NguyenNgocLinh/blob/main/prototype-link.md#b0) | Click-through Markdown, câu trả lời AI soạn sẵn | Linh build. Mở trên GitHub, bấm các liên kết để đi qua màn B0 → B1 → B2 → lưu / để mở / bỏ |

---

## Cách mở Option A trên máy

Cần Node.js 22.9 trở lên và một khoá AI theo chuẩn OpenAI.

```bash
npm install
cp .env.example .env      # điền OPENAI_API_KEY, OPENAI_BASE_URL
npm start                 # mở http://localhost:3000
```

1. Nhập tên bất kỳ rồi bấm **Vào học** (vai trò học sinh).
2. Chọn bài mẫu **Design the Experiment: prototype nhiều phương án**.
3. Bôi đen một đoạn, chọn **Quan trọng** (xanh) hoặc **Chưa hiểu** (đỏ, có thể ghi câu hỏi).
4. Bấm **AI tổng hợp kiến thức bài này** và chờ bản tổng hợp hiện dần.

Muốn người thử dùng trên máy khác cùng mạng: mở `http://<IP-máy-chạy-server>:3000`.

## Tài khoản dùng khi thử

| Vai trò | Cách vào |
|---|---|
| Học sinh | Nhập tên bất kỳ |
| Giáo viên (chỉ để đăng thêm bài) | Mã trong `TEACHER_CODE` của `.env`, mặc định `giaovien` |

---

## Cách mở Option B

1. Mở [prototype-link.md trong repo của Linh](https://github.com/linhmoimoi/Track1_Day18_2A202602480_NguyenNgocLinh/blob/main/prototype-link.md#start) và đọc màn **Bắt đầu** (context, đoạn handout mẫu, câu hỏi còn mở, nguồn).
2. Chọn **B** → **Mở dấu vết** → đọc giới hạn của AI → **Yêu cầu AI soạn nháp**.
3. Đối chiếu bản nháp với đoạn nguồn, rồi chọn: sửa rồi lưu, lưu như đang thấy, để câu hỏi mở, hoặc bỏ nháp và tự làm tiếp.
4. Bấm **Đặt lại** để về màn Bắt đầu.

Bản Markdown không có ô nhập và không lưu gì. Khi muốn viết hoặc sửa, người thử nói thành lời. Repo của Linh có thêm phương án A "Tự biên soạn" và C "AI gợi ý khi mở dấu vết"; nhóm chỉ lấy B làm option B chính thức.
