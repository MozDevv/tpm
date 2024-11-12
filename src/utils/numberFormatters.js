export const formatInThousands = (value) => {
  if (value == null) return '0.00';
  return (value / 1000).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Formats to two decimal places && adds commas e.g. 1,000.00
export const formatNumber = (value) => {
  const number = value || '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

// formats a string to proper case e.g. "hello world" => "Hello World"
export const toProperCase = (str) => {
  return str
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());
};

export function numberToWords(num) {
  const singleDigits = [
    'Zero',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
  ];
  const teenNumbers = [
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = [
    'Ten',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];
  const thousands = ['Thousand', 'Million', 'Billion'];

  if (num === 0) return 'Zero';

  let word = '';

  // Helper to convert numbers less than 1000
  function convertHundred(num) {
    let res = '';
    if (num > 99) {
      res += singleDigits[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    if (num > 10 && num < 20) {
      res += teenNumbers[num - 11] + ' ';
    } else {
      if (num >= 10) {
        res += tens[Math.floor(num / 10) - 1] + ' ';
      }
      if (num % 10 > 0) {
        res += singleDigits[num % 10] + ' ';
      }
    }
    return res.trim();
  }

  let place = 0;

  while (num > 0) {
    let chunk = num % 1000;
    if (chunk > 0) {
      let chunkWords = convertHundred(chunk);
      if (place > 0 && chunkWords) {
        chunkWords += ' ' + thousands[place - 1];
      }
      word = chunkWords + ' ' + word;
    }
    num = Math.floor(num / 1000);
    place++;
  }

  return word.trim();
}

// Converts a paymentAmount to words (Shilling and Cents)
export function amountToWords(paymentAmount) {
  const [shillings, cents] = paymentAmount.toFixed(2).split('.').map(Number); // split into whole number and fractional part

  const shillingsInWords = numberToWords(shillings) + ' Shilling Only';
  const centsInWords = cents > 0 ? ` AND ${numberToWords(cents)} Cents` : '';

  return `${shillingsInWords}${centsInWords}`.toUpperCase();
}
// Formats a bank account number into groups (default grouping of 4 digits)
export const formatBankAccount = (
  accountNumber,
  groupSize = 4,
  separator = ' '
) => {
  // Ensure accountNumber is a string
  const accountStr = accountNumber.toString();

  // Use regex to split the account number into groups
  const regex = new RegExp(`.{1,${groupSize}}`, 'g');

  // Join the groups with the specified separator (e.g., space or dash)
  return accountStr.match(regex).join(separator);
};
