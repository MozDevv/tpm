"use client";
import React, { useState, useEffect } from "react";
import { Table } from "antd";
import "./Banks.css";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { Button } from "@mui/material";

const columns = [
  {
    title: "Bank Code",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Bank Type",
    dataIndex: ["bankType", "type"],
    key: "bankType",
  },
];

const childColumns = [
  {
    title: "Branch Code",
    dataIndex: "branch_code",
    key: "branch_code",
  },
  {
    title: "Branch Name",
    dataIndex: "branch_name",
    key: "branch_name",
  },
];

const Banks = () => {
  const [data, setData] = useState([]);

  const fetchBanksAndBranches = async () => {
    try {
      const res = await apiService.get(endpoints.getBankBranches);
      const rawData = res.data.data;

      if (Array.isArray(rawData)) {
        const groupedData = rawData.reduce((acc, item) => {
          const bankId = item.bank.id;
          if (!acc[bankId]) {
            acc[bankId] = {
              key: bankId,
              name: item.bank.name,
              code: item.bank.code,
              bank_type_id: item.bank.bank_type_id,
              bankType: item.bank.bankType,
              children: [],
            };
          }
          acc[bankId].children.push({
            key: item.id,
            branch_code: item.branch_code,
            branch_name: item.name,
          });
          return acc;
        }, {});

        setData(Object.values(groupedData));
        console.log("Grouped Data:");
        console.log(Object.values(groupedData));
      } else {
        console.error("Fetched data is not an array:", rawData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBanksAndBranches();
  }, []);

  const rowClassName = (record) => {
    return record.children ? "parent-row" : "child-row";
  };

  return (
    <div className="p-3">
      <p className="text-[22px] text-primary font-semibold my-3">Banks</p>{" "}
      <div className="flex w-[100%] justify-between mr-6 mb-4">
        <Button variant="contained" color="primary">
          Create Bank
        </Button>
        <Button variant="contained" color="secondary" sx={{ color: "white" }}>
          Create Branch
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowClassName={rowClassName}
        expandable={{
          expandedRowRender: (record) =>
            record.children && record.children.length > 0 ? (
              <Table
                columns={childColumns}
                dataSource={record.children}
                pagination={false} // Consider disabling pagination for child tables if not needed
                rowClassName="child-table-row"
                className="child-table"
              />
            ) : null,
        }}
      />
    </div>
  );
};

export default Banks;
