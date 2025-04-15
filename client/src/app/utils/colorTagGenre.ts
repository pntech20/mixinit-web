export const colorTagGenre = (content, bgColor, color) => {
  return {
    backgroundColor: content?.bgColor || bgColor,
    color: content?.color || color,
  };
};
