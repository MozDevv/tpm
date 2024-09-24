// Truncate message to a certain length and add "..." at the end
export const truncateMessage = (message, maxLength) => {
  return message.length > maxLength
    ? message.substring(0, maxLength) + "..."
    : message;
};
