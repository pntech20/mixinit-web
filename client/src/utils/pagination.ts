import queryString from 'query-string';

interface paginationProps {
  page: number;
  pageSize: number;
  [key: string]: any;
}

export const getPaginationParams = ({
  page = 1,
  pageSize = 10,
}: paginationProps) => {
  const paginationObj = {
    // incase page = 0 => _start < 0 => wrong
    // page should be equal or greater than 1
    page,
    perPage: pageSize,
  };

  return queryString.stringify(paginationObj);
};
