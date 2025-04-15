export const NumberIndex = (number, page, resultsPerPage) => {
  return number + (page - 1) * (resultsPerPage || 20);
};
