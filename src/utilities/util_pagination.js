export const util_pagination = (rowsPerPage) => {
  return {
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage,
  };
};
