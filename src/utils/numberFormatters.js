export const formatInThousands = (value) => {
  if (value == null) return "0.00";
  return (value / 1000).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
