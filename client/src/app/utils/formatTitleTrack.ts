export function formatTitle(title: string): string {
  // Regular expression để tìm tất cả các phần "type" nằm trong dấu []
  const typeRegex = /\[.*?\]/g;

  // Lấy tất cả các phần "type" (trong dấu []) và giữ nguyên định dạng
  const types = title.match(typeRegex) || [];
  let mainTitle = title.replace(typeRegex, '').trim();

  // Hàm viết hoa chữ cái đầu tiên của mỗi từ (Title Case) với xử lý cho dấu '
  const toTitleCase = (str: string): string =>
    str.toLowerCase().replace(/\b\w/g, (match, offset, s) => {
      // Nếu ký tự đứng ngay trước match là dấu ', giữ nguyên (chữ thường)
      return offset > 0 && s[offset - 1] === "'"
        ? match.toLowerCase()
        : match.toUpperCase();
    });

  // Format phần chính của tiêu đề
  mainTitle = toTitleCase(mainTitle);

  // Kết hợp lại phần chính và tất cả các type giữ nguyên định dạng
  types.forEach(type => {
    mainTitle += ` ${type}`;
  });

  return mainTitle.trim();
}
