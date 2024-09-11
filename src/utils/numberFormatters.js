export const formatInThousands = (value) => {
  if (value == null) return "0.00";
  return (value / 1000).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Formats to two decimal places && adds commas e.g. 1,000.00
export const formatNumber = (value) => {
  const number = value || "0.00";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};
