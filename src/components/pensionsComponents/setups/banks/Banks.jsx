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
    dataIndex: "name",
    key: "branch_name",
  },
];

const Banks = () => {
  const [data, setData] = useState([]);

  const [rowData, setRowData] = useState([]);

  const fetchBanksAndBranches = async () => {
    try {
      const res = await apiService.get(endpoints.getBanks);
      const rawData = res.data.data;
      setRowData(rawData);
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
      </div>
      <Table
        columns={columns}
        dataSource={rowData}
        pagination={false}
        rowClassName="parent-row"
        className="parent-table"
        expandable={{
          expandedRowRender: (record) => (
            <Table
              columns={childColumns}
              dataSource={record.branches}
              pagination={false}
              rowKey="id"
              className="child-table"
              rowClassName="child-row"
            />
          ),
          rowExpandable: (record) =>
            record.branches && record.branches.length > 0,
        }}
        rowKey="id"
      />
    </div>
  );
};

export default Banks;
