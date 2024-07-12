export const generalInfoFields = [
  {
    label: "First Name",
    name: "first_name",
    type: "text",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Middle Name",
    name: "middle_name",
    type: "text",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Surname",
    name: "surname",
    type: "text",
    visible: true,
  },
  {
    label: "Identification Number",
    name: "identification_number",
    type: "text",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Identification Type",
    placeholder: "",
    name: "identification_type",
    type: "select",
    options: ["------", "National Id", "Passport"],
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "Gender",
    name: "gender",
    placeholder: "",
    type: "select",
    options: ["------", "Male", "Female"],
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "Personal Number",
    name: "personal_number",
    type: "text",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Ministry/Department/Agency",
    name: "ministry_department",
    type: "text",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Designation and Grade",
    name: "designation_grade",
    type: "text",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "First Appointment",
    name: "appointment_date",
    type: "date",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "dateNotGreaterThanToday",
        message: "Please enter a valid date.",
      },
    ],
  },
  {
    label: "Date of Confirmation",
    name: "date_of_confirmation",
    type: "date",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "dateNotGreaterThanToday",
        message: "Please enter a valid date.",
      },
    ],
  },
  {
    label: "Retirement Date",
    name: "retirement_date",
    type: "date",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "dateNotGreaterThanToday",
        message: "Please enter a valid date.",
      },
    ],
  },
  {
    label: "Date Of Death",
    name: "date_of_death",
    type: "date",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "dateNotGreaterThanToday",
        message: "Please enter a valid date.",
      },
    ],
  },
  {
    label: "Retirement Reason",
    name: "cause_of_retirement",
    type: "select",
    options: ["------", "Retiremnt Rsn 1", "Retrirement Rsn 2"],
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "Pension Commencement Date",
    name: "commencement_date",
    type: "date",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "dateNotGreaterThanTomorrow",
        message: "Please enter a valid date.",
      },
    ],
  },
  {
    label: "Last Basic Salary Amount",
    name: "last_basic_salary_amount",
    type: "number",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "notLessThanZero",
        message: "Please enter valid amount",
      },
    ],
  },
  {
    label: "Date of Birth",
    name: "dob",
    type: "date",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "dateNotGreaterThanToday",
        message: "Please enter a valid date.",
      },
    ],
  },
  {
    label: "KRA PIN",
    name: "kra_pin",
    type: "text",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
];

export const contactDetailsFields = [
  {
    label: "Email Address",
    name: "email_address",
    type: "email",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "checkEmailIsValid",
        message: "Please enter a valid email",
        validatorFn: (name) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(name);
        },
      },
    ],
  },
  {
    label: "Phone Number",
    name: "phone_number",
    type: "text",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "minimumLength",
        message: "Please enter valid phone number",
        validatorFn: (name) => {
          if (name.length < 10) return false;
          return true;
        },
      },
      {
        error: "maximumLength",
        message: "Please enter valid phone number",
        validatorFn: (name) => {
          if (name.length > 10) return false;
          return true;
        },
      },
    ],
  },
  {
    label: "P.O. Box Address",
    name: "postal_address",
    placeholder: "",
    type: "text",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Country",
    name: "country",
    type: "select",
    options: ["------", "Country 1", "Country 2"],
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "County",
    name: "county",
    type: "select",
    options: ["------", "County 1", "County 2"],
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "Constituency",
    name: "constituency",
    type: "select",
    options: ["------", "Constituency 1", "Constituency 2"],
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "City/Town",
    name: "city_town",
    type: "text",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
];

export const bankDetailsFields = [
  {
    label: "Bank",
    name: "bank",
    type: "select",
    options: ["------", "Bank 1", "Bank 2"],
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "Bank Branch",
    name: "branch",
    type: "select",
    options: ["------", "Branch 1", "Branch 2"],
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "Account Name",
    name: "account_name",
    type: "text",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Account Number",
    name: "account_number",
    type: "text",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
];

export const beneficiaryFields = [
  {
    label: "Relationship",
    type: "select",
    name: "relationship",
    options: ["------", "Husband", "Wife", "Son", "Daughter"],
    required: true,
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "Deceased",
    type: "select",
    name: "deceased",
    options: ["------", "Yes", "No"],
    visible: false,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "Death Certificate Number",
    type: "text",
    name: "death_certificate_no",
    visible: false,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Identification Type",
    name: "identification_type",
    type: "select",
    options: ["------", "National ID", "Passport"],
    visible: false,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "Identification Number",
    type: "text",
    name: "identification_number",
    visible: false,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "First Name",
    type: "text",
    name: "first_name",
    required: true,
    visible: false,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Surname",
    type: "text",
    name: "surname",
    required: true,
    visible: false,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Other Name",
    type: "text",
    name: "other_name",
    visible: false,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Date Of Birth",
    type: "date",
    name: "date_of_birth",
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Email",
    type: "email",
    name: "email",
    visible: false,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Phone",
    type: "text",
    name: "phone",
    visible: false,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "KRA Pin",
    type: "text",
    name: "kra_pin",
    visible: false,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Postal Address",
    type: "text",
    name: "postal_address",
    visible: false,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
];

export const bankSectionFields = [
  {
    label: "Bank",
    type: "select",
    name: "bank",
    options: ["------", "Bank 1", "Bank 2"],
    required: true,
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "Bank Branch",
    type: "select",
    name: "bank_branch",
    options: ["------", "Branch 1", "Branch 2"],
    required: true,
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "Account Name",
    type: "text",
    name: "account_name",
    required: true,
    visible: true,
  },
  {
    label: "Account Number",
    type: "text",
    name: "account_number",
    required: true,
    visible: true,
  },
];

export const guardianFields = [
  {
    label: "Relationship",
    type: "select",
    name: "relationship",
    options: ["------", "Husband", "Brother", "Sister", "Friend"],
    required: true,
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "Identification Type",
    name: "identification_type",
    type: "select",
    options: ["------", "National ID", "Passport"],
    required: true,
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "Identification Number",
    type: "text",
    name: "identification_number",
    required: true,
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "First Name",
    type: "text",
    name: "first_name",
    required: true,
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Surname",
    type: "text",
    name: "surname",
    required: true,
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Other Name",
    type: "text",
    name: "other_name",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Email",
    type: "email",
    name: "email",
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Phone",
    type: "text",
    name: "phone",
    required: true,
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "KRA Pin",
    type: "text",
    name: "kra_pin",
    required: true,
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Postal Address",
    type: "text",
    name: "postal_address",
    required: true,
    visible: true,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  ...bankSectionFields,
];

export const childFields = [
  {
    label: "First Name",
    type: "text",
    name: "first_name",
    required: true,
    visible: true,
  },
  {
    label: "Surname",
    type: "text",
    name: "surname",
    required: true,
    visible: true,
  },
  {
    label: "Other Name",
    type: "text",
    name: "other_name",
    required: true,
    visible: true,
  },
  {
    label: "Date Of Birth",
    type: "date",
    name: "date_of_birth",
    required: true,
    visible: true,
  },
  {
    label: "Email",
    type: "email",
    name: "email",
    visible: true,
  },
  {
    label: "Phone",
    type: "text",
    name: "phone",
    visible: true,
  },
  {
    label: "KRA Pin",
    type: "text",
    name: "kra_pin",
    visible: true,
  },
  {
    label: "Identification Type",
    name: "identification_type",
    type: "select",
    options: ["------", "National ID", "Passport"],
    required: true,
    visible: false,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
  {
    label: "Identification Number",
    type: "text",
    name: "identification_number",
    required: true,
    visible: false,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
    ],
  },
  {
    label: "Guardian",
    type: "select",
    name: "guardian",
    options: ["------", "Guardian 1", "Guardian 2"],
    required: true,
    visible: false,
    validations: [
      {
        error: "required",
        message: "This field is required.",
      },
      {
        error: "invalidSelect",
        message: "Please select a valid option",
      },
    ],
  },
];
