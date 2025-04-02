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

  return newErrors;
};
