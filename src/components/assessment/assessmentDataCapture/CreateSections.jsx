"use client";
// import { useState } from "react";

// List of pension caps
const pensionCaps = [
  "CAP189",
  "CAP199",
  "CAP196",
  "APN/PK",
  "CAP190",
  "CAP195",
  "DSO/RK",
  "CAP195",
];

export const createSections = (
  filteredDesignations,
  countries,
  counties,
  constituencies,
  filteredPostalAddresses,
  filteredGrades,

  exitGroundOptions,
  pensionAwardOptions,
  activePensionCap,
  formData,
  rateOfInjury,
  mdaId
) => [
  {
    title: "Personal Information",
    // state: useState(true),
    fields: [
      {
        label: "Personal Number",
        name: "personal_number",
        type: "text",

        pensionCap: [
          "CAP189",

          "CAP196",
          "APN/PK",
          "CAP190",
          "CAP195",
          "DSO/RK",
          "CAP195",
        ],
      },

      {
        label: "First Name",
        name: "first_name",
        type: "text",
        pensionCap: [
          "CAP189",
          "CAP199",
          "CAP196",
          "APN/PK",
          "CAP190",
          "CAP195",
          "DSO/RK",
          "CAP195",
        ],
      },

      {
        label: "Middle Name",
        name: "middle_name",
        type: "text",
        pensionCap: [
          "CAP189",
          "CAP199",
          "CAP196",
          "APN/PK",
          "CAP190",
          "CAP195",
          "DSO/RK",
          "CAP195",
        ],
      },

      {
        label: "Other Name(s)",
        name: "other_name",
        type: "text",
        pensionCap: [
          "CAP189",
          "CAP199",
          "CAP196",
          "APN/PK",
          "CAP190",
          "CAP195",
          "DSO/RK",
          "CAP195",
        ],
      },
    ],
  },
];
