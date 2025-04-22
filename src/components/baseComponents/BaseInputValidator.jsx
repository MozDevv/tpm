import dayjs from 'dayjs';

export const baseInputValidator = (field, value, formData) => {
  const newErrors = {};

  // Validation for Initiator Name
  if (field.name === 'initiatorName' && value) {
    if (value.trim() === '') {
      newErrors[field.name] = `${field.label} is required`;
    } else if (!/^[a-zA-Z\s]+$/.test(value)) {
      newErrors[
        field.name
      ] = `${field.label} must contain only letters and spaces`;
    }
  }

  // Validation for Initiator Email
  if (field.name === 'initiatorEmail' && value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      newErrors[field.name] = `${field.label} is not a valid email`;
    }
  }

  // Validation for Initiator Phone
  if (field.name === 'initiatorPhone' && value) {
    const phonePattern = /^\+?[0-9]{10,13}$/; // Adjust pattern for your locale
    if (!phonePattern.test(value)) {
      newErrors[field.name] = `${field.label} is not a valid phone number`;
    }
  }

  // Validation for Appointment Start
  if (field.name === 'appointmentStart' && value) {
    const startDate = dayjs(value);
    if (!startDate.isValid()) {
      newErrors[field.name] = `${field.label} must be a valid date`;
    } else if (startDate.isBefore(dayjs())) {
      newErrors[field.name] = `${field.label} cannot be in the past`;
    }
  }

  // Validation for Appointment End
  if (field.name === 'appointmentEnd' && value) {
    const endDate = dayjs(value);
    const startDate = dayjs(formData.appointmentStart);
    if (!endDate.isValid()) {
      newErrors[field.name] = `${field.label} must be a valid date`;
    } else if (endDate.isBefore(startDate)) {
      newErrors[
        field.name
      ] = `${field.label} cannot be earlier than Appointment Start`;
    }
  }

  // Additional validations for specific fields
  if (field.name === 'referenceNo' && value) {
    if (value.trim().length < 5) {
      newErrors[
        field.name
      ] = `${field.label} must be at least 5 characters long`;
    }
  }

  if (field.name === 'receivedAt' && value) {
    const receivedDate = dayjs(value);
    if (!receivedDate.isValid()) {
      newErrors[field.name] = `${field.label} must be a valid date`;
    } else if (receivedDate.isAfter(dayjs())) {
      newErrors[field.name] = `${field.label} cannot be in the future`;
    }
  }

  if (field.name === 'pensionerNationalID' && value) {
    if (!/^\d{6,10}$/.test(value)) {
      newErrors[
        field.name
      ] = `${field.label} must be a valid National ID (6-10 digits)`;
    }
  }

  if (field.name === 'partyEmail' && value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      newErrors[field.name] = `${field.label} is not a valid email`;
    }
  }

  // Validation for phone number fields
  if (field.name === 'partyPhone' && value) {
    const phonePattern = /^\+?[0-9]{10,13}$/; // General phone number pattern
    if (!phonePattern.test(value)) {
      newErrors[field.name] = `${field.label} is not a valid phone number`;
    } else if (value.startsWith('+254') && value.length !== 13) {
      newErrors[
        field.name
      ] = `${field.label} must be a valid Kenyan phone number`;
    }
    if (field.name === 'pensionerNumber' && value) {
      const pensionerPattern = /^[a-zA-Z0-9/]+$/; // Matches alphanumeric characters and /
      if (!pensionerPattern.test(value)) {
        newErrors[
          field.name
        ] = `${field.label} must contain only alphanumeric characters or '/'`;
      }
    }
  }
  if (field.name === 'partyName' && value) {
    const namePattern = /^[a-zA-Z\s'&-]+$/; // Allows letters, spaces, ', &, and -
    if (!namePattern.test(value)) {
      newErrors[
        field.name
      ] = `${field.label} must contain only letters, spaces, and the special characters (' - &)`;
    }
  }
  if (field.name === 'nature' && value) {
    const naturePattern = /^[a-zA-Z\s]+$/; // Allows only letters and spaces
    if (!naturePattern.test(value)) {
      newErrors[
        field.name
      ] = `${field.label} must contain only letters and spaces`;
    }
  }

  return newErrors;
};
