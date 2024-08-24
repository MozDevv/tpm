export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const dateFormatter = (dateS) => {
  const date = new Date(dateS);

  // Format to a nice UX-friendly date, e.g., "July 30, 1985"
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formattedDate;
};
