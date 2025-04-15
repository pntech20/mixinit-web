const validURL = (url: string) => {
  try {
    const arrProtocol = ['http:', 'https:'];
    return arrProtocol.includes(new URL(url).protocol);
  } catch {
    return false;
  }
};
export { validURL };
