export const generateArray = (quantity: number) => {
  return Array.from(Array(quantity).keys());
};

export const formatCountNumber = (total: number = 0): string => {
  if (total < 100) {
    return `${total}`;
  }

  return '99+';
};

const SI_SYMBOL = ['', 'K', 'M', 'G', 'T', 'P', 'E'];

export const abbreviateNumber = (value: number = 0): string => {
  // what tier? (determines SI symbol)
  const tier = (Math.log10(Math.abs(value)) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier === 0) return value.toString();

  // get suffix and determine scale
  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);

  // scale the number
  const scaled = value / scale;

  // format number and add suffix
  return Number(scaled.toFixed(1)) + suffix;
};

export const formatPrice = (value: number = 0): string => {
  if (!value) return '0';

  return parseFloat(value.toString()).toFixed(0);
};

export const formatCash = (data: string | number, fixed = 0) => {
  return Number(+data)
    .toFixed(fixed)
    .replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
};

export const formatNumber = number => {
  const formattedNumber = parseFloat(number).toFixed(2);
  return formattedNumber;
};
