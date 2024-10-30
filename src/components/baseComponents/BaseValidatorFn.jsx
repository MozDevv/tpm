import dayjs from 'dayjs';

export const baseValidatorFn = {
  date: (value) => {
    if (!dayjs(value).isValid()) return 'use YYYY-MM-DD';
    return null;
  },
  phone_number: (value) => {
    const phoneRegex = /^[0-9]{10}$/; // Example: 10-digit phone number
    if (!phoneRegex.test(value)) return ' Phone number must be 10 digits';
    return null;
  },
  kra_pin: (value) => {
    const kraPinRegex = /^[A-Z0-9]{13}$/; // Example: 13-character KRA PIN
    if (!kraPinRegex.test(value))
      return ' KRA pin should have a format of A1234567890A';
    return null;
  },
  id_number: (value) => {
    const idNumberRegex = /^[0-9]{7,8}$/; // Example: 7-8 digit ID number
    if (!idNumberRegex.test(value)) return 'Check the ID number and try again';
    return null;
  },
  email: (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Example: email address
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return null;
  },
  email_address: (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Example: email address
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return null;
  },
  national_id: (value) => {
    const nationalIdRegex = /^[0-9]{7,8}$/; // Example: 7-8 digit national ID
    if (!nationalIdRegex.test(value))
      return ' Please enter a valid national ID';
    return null;
  },
  password: (value) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; // Example: password with at least 1 digit, 1 lowercase letter, 1 uppercase letter, and 8 characters
    if (!passwordRegex.test(value)) return 'Invalid password';
    return null;
  },
  postal_code: (value) => {
    const postalCodeRegex = /^[0-9]{5}$/; // Example: 5-digit postal code
    if (!postalCodeRegex.test(value)) return 'Please enter a valid postal code';
    return null;
  },
  name: (value) => {
    const nameRegex = /^[a-zA-Z\s]+$/; // Example: name
    if (!nameRegex.test(value)) return 'Please enter a valid name';
    return null;
  },
  number: (value) => {
    const numberRegex = /^[0-9]+$/; // Example: number
    if (!numberRegex.test(value)) return 'Please enter a valid number';
    return null;
  },
  permanent_postal_address: (value) => {
    const permanentPostalAddressRegex = /^[0-9]+$/; // Example: permanent postal address
    if (!permanentPostalAddressRegex.test(value))
      return 'Please enter a valid permanent postal address, e.g. 123456';
    return null;
  },
  temporary_postal_address: (value) => {
    const temporaryPostalAddressRegex = /^[0-9]+$/; // Example: temporary postal address
    if (!temporaryPostalAddressRegex.test(value))
      return 'Please enter a valid temporary postal address, e.g. 123456';
    return null;
  },
  // amount: (value) => {
  //   const amountRegex = /^[0-9]+$/; // Example: amount
  //   if (!amountRegex.test(value)) return "Please enter a valid amount";
  //   return null;
  // },

  endDate: (endDate, startDate) => {
    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      return 'End date should not be earlier than start date';
    }
    return null;
  },
  // account_number: (value) => {
  //   const accountNumberRegex = /^[0-9]{10}$/;
  //   if (!accountNumberRegex.test(value))
  //     return "Please enter a valid account number";
  //   return null;
  // },
};
