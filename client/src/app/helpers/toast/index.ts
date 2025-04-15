import { toast } from 'react-toastify';

export const toastSuccess = (message: string): void => {
  if (message) {
    toast.success(message, {
      position: toast.POSITION.TOP_CENTER,
    });
  }
};

export const toastWarning = (message: string): void => {
  if (message) {
    toast.warning(message, {
      position: toast.POSITION.TOP_CENTER,
    });
  }
};

type ErrorMsg = Error | string | string[];

export const toastError = (error: ErrorMsg) => {
  let toastData: any = '';

  if (typeof error === 'string' || (error && error instanceof Array)) {
    toastData = error;
  } else if (typeof error === 'object' && error.message) {
    toastData = error.message;
  }

  if (toastData && typeof toastData === 'string' && toastData !== '') {
    toast.error(toastData, {
      position: toast.POSITION.TOP_CENTER,
    });
  } else if (toastData && toastData instanceof Array) {
    toastData.forEach(err => {
      toastError(err);
    });
  }
};
