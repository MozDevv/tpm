import { useState } from "react";

export const sections = [
  {
    title: "General Information",
    state: useState(true),
    fields: [
      { label: "Personal Number", name: "personal_number", type: "text" },

      { label: "First Name", name: "first_name", type: "text" },
      { label: "Surname", name: "surname", type: "text" },
      { label: "Other Name", name: "other_name", type: "text" },
      { label: "Date of Birth", name: "dob", type: "date" },
      {
        label: "Type Of Identification",
        name: "identifier_type",
        type: "select",
        children: [
          {
            id: 0,
            name: "National ID",
          },
          {
            id: 1,
            name: "Passport No",
          },
        ],
      },

      { label: "National ID", name: "national_id", type: "text" },
      {
        label: "Designation and Grade",
        name: "designation_grade",
        type: "text",
      },

      {
        label: "Ministry/Department/Agency",
        name: "mda_id",
        type: "select",
        children: mdas.map((mda) => ({
          id: mda.id,
          name: mda.name,
        })),
      },
      {
        label: "Date of First Appointment",
        name: "date_of_first_appointment",
        type: "date",
      },
      {
        label: "Date of Which Pension will Commence/Date Of Death ",
        name: "date_from_which_pension_will_commence",
        type: "date",
      },
      {
        label: "Pension Award ID",
        name: "pension_award_id",
        type: "select",
        children: pensionAwards.map((award) => ({
          id: award.id,
          name: award.name,
        })),
      },
      { label: "KRA PIN", name: "kra_pin", type: "text" },
      {
        label: "Authority of retirement Ref No.",
        name: "authority_for_retirement_reference",
        type: "text",
      },
      {
        label: "Authority of retirement Date",
        name: "authority_for_retirement_dated",
        type: "date",
      },

      {
        label: "Date of confirmation into pensionable Office",
        name: "date_of_confirmation",
        type: "date",
      },

      {
        label: "Last Basic Salary Amount",
        name: "last_basic_salary_amount",
        type: "number",
      },
    ],
  },

  {
    title: "Contact Details",
    state: useState(true),
    fields: [
      { label: "Postal Address", name: "phone_number", type: "text" },
      { label: "County", name: "county", type: "text" },
      { label: "City/Town", name: "city", type: "text" },
      {
        label: "Country",
        name: "country_id",
        type: "select",
        children: countries.map((country) => ({
          id: country.id,
          name: country.country_name,
        })),
      },
      {
        label: "County",
        name: "county_id",
        type: "select",
        children: counties.map((county) => ({
          id: county.id,
          name: county.county_name,
        })),
      },
    ],
  },
];
