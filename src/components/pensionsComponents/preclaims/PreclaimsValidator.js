import 'dayjs/locale/en-au';
import dayjs from 'dayjs';
export const validateField = (name, value, formData) => {
  let error = '';
  if (name === 'date_of_first_appointment' && value && formData.dob) {
    const dobDate = dayjs(formData.dob);
    const appointmentDate = dayjs(value); // Using `value` for the current input

    // Debugging: Check if the dates are valid
    if (!dobDate.isValid() || !appointmentDate.isValid()) {
      error = 'Invalid date format';
      return error;
    }

    console.log('DOB:', dobDate.format('YYYY-MM-DD'));
    console.log('Appointment Date:', appointmentDate.format('YYYY-MM-DD'));
    console.log(
      '15 Years After DOB:',
      dobDate.add(15, 'years').format('YYYY-MM-DD')
    );

    if (appointmentDate.isBefore(dobDate.add(15, 'years'))) {
      error =
        'Date of first appointment must be at least 15 years after date of birth';
    }
  }

  if (name === 'retirement_date' && value && formData.date_of_confirmation) {
    const confirmationDate = dayjs(formData.date_of_confirmation);
    const retirementDate = dayjs(value);

    if (retirementDate.isBefore(confirmationDate)) {
      error = 'Retirement date cannot be before date of confirmation';
    }
  }
  /**change tax exempt certificate date to tax exempt certificate expiry date */

  if (
    name === 'tax_exempt_certificate_date' &&
    value &&
    formData.retirement_date
  ) {
    const retirementDate = dayjs(formData.retirement_date);
    const taxExemptCertificateDate = dayjs(value);

    if (taxExemptCertificateDate.isAfter(retirementDate)) {
      error = 'Tax Exempt Certificate Date cannot be after retirement date';
    }
  }
  if (name === 'last_pay_date' && value && formData.date_of_confirmation) {
    const confirmationDate = dayjs(formData.date_of_confirmation);
    const lastPayDate = dayjs(value);

    if (lastPayDate.isBefore(confirmationDate)) {
      error = 'Last pay date cannot be before date of confirmation';
    }
  } else if (name === 'tax_exempt_certificate_number' && value) {
    const regex = /^NCPWD\/\d{1,8}$/; // Starts with 'NCPWD/', followed by up to 8 digits

    if (!regex.test(value)) {
      error = 'Tax Exempt Certificate Number is not valid';
    }
  }

  if (
    name === 'email_address' &&
    value &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  ) {
    error = 'Invalid email format';
    // } else if (name === "phone_number" && value && !/^\d+$/.test(value)) {
    //   error = "Must be a valid phone number";
  } else if (name === 'dob' && value) {
    const dobDate = dayjs(value);
    const age = dayjs().diff(dobDate, 'year');
    const year = dobDate.year();
    if (dobDate.isAfter(dayjs())) {
      error = 'Date of birth cannot be in the future';
    } else if (age < 18) {
      error = 'User must be at least 18 years old';
    } else if (year < 1900) {
      error = 'Birth Year cannot be earlier than 1900';
    }
  } else if (name === 'national_id' && value && !/^\d+$/.test(value)) {
    error = 'Must be a valid National ID';
  } else if (name === 'kra_pin' && value && !/^[A-Z]\d{9}[A-Z]$/.test(value)) {
    error = 'Must be a valid KRA PIN';
  } else if (name === 'last_basic_salary_amount' && value && isNaN(value)) {
    error = 'Must be a valid number';
    // } else if (
    //   name === "phone_number" &&
    //   value &&
    //   !/^(?:\+254|0)([17][0-9]|1[0-1])[0-9]{7}$/.test(value)
    // ) {
    //   error = "Must be a valid phone number";
  } else if (
    name.includes('date') &&
    name !== 'date_from_which_pension_will_commence' &&
    name !== 'retirement_date' &&
    name !== 'last_pay_date' &&
    value
  ) {
    const inputDate = dayjs(value);
    const year = inputDate.year();

    if (inputDate.isAfter(dayjs())) {
      error = 'Date cannot be in the future';
    } else if (year < 1900) {
      error = 'Date cannot be earlier than the year 1900';
    }
  } else if (
    name === 'date_of_confirmation' &&
    value &&
    formData.date_of_first_appointment
  ) {
    const appointmentDate = dayjs(formData.date_of_first_appointment);
    const confirmationDate = dayjs(value);
    const year = confirmationDate.year();
    const confirmationYear = confirmationDate.year();

    if (confirmationDate.isAfter(dayjs())) {
      error = 'Date of confirmation cannot be in the future';
    } else if (year < 1900) {
      error = 'Date of confirmation cannot be earlier than the year 1900';
    }
    if (confirmationDate.isBefore(appointmentDate)) {
      error = 'Date of confirmation cannot be before date of first appointment';
    }
  } else if (name === 'retirement_date' && value) {
    //do not allow dates before 1900
    if (value && dayjs(value).year() < 1900) {
      error = 'Date cannot be earlier than the year 1900';
    }
  } else if (name === 'last_pay_date' && value) {
    if (value && dayjs(value).year() < 1900) {
      error = 'Date cannot be earlier than the year 1900';
    }
  } else if (name === 'tax_exempt_certificate_number' && value === '') {
    if (formData.pwd === 0 && value === '') {
      error = 'Tax Exempt Certificate Number is required';
    }
  } else if (name === 'tax_exempt_certificate_date' && value === '') {
    if (formData.pwd === 0 && value === '') {
      error = 'Tax Exempt Certificate Date is required';
    }
  } else if (
    ['surname', 'first_name', 'middle_name', 'other_name'].includes(name) &&
    value &&
    !/^[a-zA-Z'-\s]+$/.test(value)
  ) {
    error =
      "Only alphabetic characters, spaces, apostrophes ('), and hyphens (-) are allowed";
  } else if (name === 'phone_number' && value && !/^\+2547\d{8}$/.test(value)) {
    error = 'Phone number must be a valid Kenyan phone number';
  } else if (name === 'phone_number' && value.length !== 13) {
    error = 'Phone number must be exactly 13 digits long';
  } else if (name === 'date_of_death' && value) {
    const deathDate = dayjs(value);
    const dobDate = formData.dob ? dayjs(formData.dob) : null;

    if (deathDate.isAfter(dayjs())) {
      error = 'Date of death cannot be in the future';
    } else if (dobDate && deathDate.isBefore(dobDate)) {
      error = 'Date of death cannot be before the date of birth';
    }
  } else if (name === 'national_id' && value) {
    if (!/^\d+$/.test(value)) {
      error = 'National ID must contain only numeric values';
    } else if (value.length < 7 || value.length > 9) {
      error = 'National ID must be between 7 and 9 digits';
    }
  } else if (name === 'passport_number' && value) {
    if (!/^[A-Za-z][K]\d+$/.test(value)) {
      error = 'Passport number must be valid';
    }
  } else if (name === 'passport_no' && value) {
    if (!/^[A-Za-z][K]\d+$/.test(value)) {
      error = 'Passport number must be valid';
    }
  } else if (name === 'death_certificate_number' && value) {
    if (!/^[\d/]+$/.test(value)) {
      error = 'Death certificate must be valid.';
    }
  }

  return error;
};
