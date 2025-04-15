export const onlyShowNumber = async e => {
  if (
    !/[\d]/.test(e.key) && // Chỉ cho phép số
    e.key !== 'Backspace' && // Cho phép phím Backspace
    e.key !== 'Tab' && // Cho phép phím Tab
    e.key !== 'ArrowLeft' && // Cho phép các phím mũi tên
    e.key !== 'ArrowRight' && // Cho phép các phím mũi tên
    e.key !== 'Delete' // Cho phép phím Delete
  ) {
    e.preventDefault();
  }
};
