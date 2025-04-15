import getBlobDuration from 'get-blob-duration';

export const formatTime = (
  totalSeconds: number,
  noZeroAtMin?: boolean,
): string => {
  const dataConfig = +totalSeconds?.toFixed(0);
  const seconds = dataConfig % 60;
  const minutes = Math.floor(dataConfig / 60);
  const seconds_str = `0${seconds}`.slice(-2);
  const minutes_str = `${noZeroAtMin ? '' : '0'}${minutes}`.slice(-2);

  return `${minutes_str}:${seconds_str}`;
};

const currentYear = new Date().getFullYear() - 13;
const old = new Date().getFullYear() - 100;
export const years: any = [];
for (let i = currentYear; i >= old; i -= 1) {
  years.push(i);
}
export const days: any = [];
for (let i = 1; i <= 31; i += 1) {
  days.push(i < 10 ? `0${i}` : i);
}

export const months: any = [];
for (let i = 1; i <= 12; i += 1) {
  months.push(i < 10 ? `0${i}` : i);
}

export const getDurationFile = async file => {
  try {
    return await getBlobDuration(window.URL.createObjectURL(file));
  } catch (err) {
    return err;
  }
};
