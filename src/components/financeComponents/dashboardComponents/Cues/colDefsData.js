"use client";
import { faker } from "@faker-js/faker";

export const colDefsData = [
  { field: "no" },
  { field: "date" },
  { field: "paymentNarration" },
  { field: "paymode" },
  { field: "checkNumber" },
  { field: "recievedFrom" },
  { field: "createdBy" },
  { field: "postedBy" },
  { field: "postedDate" },
];
export const colDefsDataCharts = [
  { field: "no" },
  { field: "name" },
  { field: "netChange" },
  { field: "approved" },
  { field: "currentBalance" },
  { field: "commitment" },
  { field: "income" },
  { field: "accountSubcategory" },
  { field: "accountType" },
  { field: "cashType" },
];

export const generateDummyData = (count) => {
  const dummyData = [];
  for (let i = 0; i < count; i++) {
    dummyData.push({
      no: faker.number.int({ min: 1, max: 1000 }), // Updated
      date: faker.date.past().toLocaleDateString(),
      paymentNarration: faker.lorem.words(4),
      paymode: faker.helpers.arrayElement(["CASH", "CARD", "CHEQUE"]),
      checkNumber: faker.string.alphanumeric(8).toUpperCase(), // Updated
      recievedFrom: faker.person.fullName(), // Updated
      createdBy: faker.person.fullName(), // Updated
      postedBy: faker.person.fullName(), // Updated
      postedDate: faker.date.past().toLocaleDateString(),
    });
  }
  return dummyData;
};

export const rowDataDummy = generateDummyData(30);
