import { path } from 'ramda';

export const getErrorMsgResponse = error => {
  const errMsg =
    path<string>(['response', 'data', 'message'], error) || 'Something wrong!';

  return errMsg;
};
