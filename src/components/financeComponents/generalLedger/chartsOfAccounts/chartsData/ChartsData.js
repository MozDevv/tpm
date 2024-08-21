"use client";
import { faker } from "@faker-js/faker";

export const colDefsDataCharts = [
  { field: "no" },
  { field: "name" },
  { field: "netChange" },
  { field: "approvedBudget" },
  { field: "commitment" },
  { field: "balanceAtDate" },
  { field: "currentBalance" },
  { field: "incomeBalance" },
  { field: "accountSubcategory" },
  { field: "accountType" },
  { field: "totaling" },
  { field: "genPostingType" },
  { field: "genBusPostingGroup" },
  { field: "genProdPostingGroup" },
  { field: "costTypeNo" },
  { field: "defaultDeferralTemplate" },
];

const mainCategories = [
  "Current Assets",
  "Bank and Cash Accounts",
  "Receivables",
  "Income Receivables",
  "Liabilities",
  "Equity",
  "Revenue",
  "Expenses",
];

const subCategories = {
  "Current Assets": ["Cash", "Accounts Receivable", "Inventory"],
  "Bank and Cash Accounts": ["Bank Account 1", "Bank Account 2"],
  Receivables: ["Customer A", "Customer B"],
  "Income Receivables": ["Interest Income", "Dividend Income"],
  Liabilities: ["Accounts Payable", "Loans Payable"],
  Equity: ["Common Stock", "Retained Earnings"],
  Revenue: ["Sales", "Service Income"],
  Expenses: ["Rent", "Utilities", "Salaries"],
};

const generateNestedData = (
  mainCategories,
  subCategories,
  countPerSubCategory,
) => {
  return mainCategories.map((mainCategory) => ({
    no: `${faker.number.int({ min: 100, max: 999 })}`,
    name: mainCategory,
    children: subCategories[mainCategory].map((subCategory) => ({
      no: `${faker.number.int({ min: 100, max: 999 })}-${faker.number.int({ min: 1000, max: 9999 })}`,
      name: subCategory,
      children: Array.from({ length: countPerSubCategory }).map(() => ({
        no: `${faker.number.int({ min: 100, max: 999 })}-${faker.number.int({ min: 1000, max: 9999 })}`,
        name: faker.company.name(),
        netChange: faker.finance.amount({ min: -1000, max: 1000, dec: 2 }),
        approvedBudget: faker.finance.amount({ min: 0, max: 10000, dec: 2 }),
        commitment: faker.finance.amount({ min: 0, max: 5000, dec: 2 }),
        balanceAtDate: faker.finance.amount({ min: 0, max: 7000, dec: 2 }),
        currentBalance: faker.finance.amount({ min: 0, max: 10000, dec: 2 }),
        incomeBalance: faker.finance.amount({ min: 0, max: 7000, dec: 2 }),
        accountSubcategory: subCategory,
        accountType: mainCategory,
        totaling: faker.helpers.arrayElement(["Begin-Total", "End-Total"]),
        genPostingType: faker.helpers.arrayElement(["Purchase", "Sale"]),
        genBusPostingGroup: faker.helpers.arrayElement(["Domestic", "Export"]),
        genProdPostingGroup: faker.helpers.arrayElement([
          "Retail",
          "Wholesale",
        ]),
        costTypeNo: faker.number.int({ min: 1, max: 100 }),
        defaultDeferralTemplate: faker.lorem.word(),
      })),
    })),
  }));
};

export const rowDataCharts = generateNestedData(
  mainCategories,
  subCategories,
  5,
);
