import dayjs from 'dayjs';

const defaultDatePattern = 'MM/dd/yyyy HH:MM';

export const formatTime = (totalSeconds: number): string => {
  const dataConfig = +totalSeconds.toFixed(0);
  let seconds: any = dataConfig % 60;
  let minutes: any = Math.floor(dataConfig / 60);
  seconds = `0${seconds}`.slice(-2);
  minutes = `0${minutes}`.slice(-2);
  return `${minutes}:${seconds}`;
};

export const currentDate = () => {
  const date = new Date();
  let month = `0${date.getMonth() + 1}`.slice(-2);
  return `${date.getFullYear()}-${month}-${date.getDate()}`;
};

export const formatPostDate = (
  date?: string,
  pattern: string = defaultDatePattern,
) => {
  const dateToFormat = date ? new Date(date) : new Date();
  return dayjs(dateToFormat).format(pattern);
};

export const formatDate = (date: string) => {
  return dayjs(date).format('MM/DD/YYYY');
};
