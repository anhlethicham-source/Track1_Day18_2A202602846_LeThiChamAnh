# Link Micro-Prototype A / B

> Thiết kế chi tiết của từng option: [`three-option-design-sheet.md`](three-option-design-sheet.md)

| Option | Tên | Link truy cập | Loại prototype | Ghi chú |
|---|---|---|---|---|
| A | Tô màu rồi AI tổng hợp | Chưa deploy. Trong phiên thử chạy trên máy của mình tại `http://localhost:3000` (cách chạy ở bên dưới) | App chạy thật (Node.js + AI) | Mã nguồn chính là repo này |
| B | Hỏi ngay tại chỗ | `[dán link]` | `[Figma / HTML / app]` | |

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
