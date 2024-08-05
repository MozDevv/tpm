"use client";
import React, { useState, useEffect } from "react";
import { Table, message } from "antd";
import "./Banks.css";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { Button, Dialog, MenuItem, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";

const columns = [
  {
    title: "County Code",
    dataIndex: "county_code",

    key: "code",
  },
  {
    title: "County Name",
    dataIndex: "county_name",
    key: "name",
  },
];

const childColumns = [
  {
    title: "Contituency Name",
    dataIndex: "constituency_name",
    key: "contituency_name",
  },
];

const Counties = () => {
  const [data, setData] = useState([]);

  const [rowData, setRowData] = useState([]);

  const [countries, setCountries] = useState([]);

  const [countyName, setCountyName] = useState("");
  const [countryId, setCountryId] = useState("");

  const fetchCountiesAndContituencies = async () => {
    try {
      const res = await apiService.get(endpoints.getCounties);
      const rawData = res.data.data;
      setRowData(rawData);

      console.log("first", rawData);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCountries = async () => {
    try {
      const res = await apiService.get(endpoints.getCountries);

      setCountries(res.data.data);

      console.log("countries", res.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchCountiesAndContituencies();
    fetchCountries();
  }, []);

  const rowClassName = (record) => {
    return record.children ? "parent-row" : "child-row";
  };

  const handleCreateCounty = async () => {
    const data = {
      country_id: countryId,
      county_code: countyCode,
      county_name: countyName,
    };
    try {
      const res = await apiService.post(endpoints.createCounty, data);

      setCreateCounty(false);
      fetchCountiesAndContituencies();
      message.success("County Created Successfully");
    } catch (error) {
      console.log(error);
    }
  };
  const [createCounty, setCreateCounty] = useState(false);
  const [countyCode, setCountyCode] = useState("");
  const [createContituency, setCreateContituency] = useState(false);

  const [openConstituency, setOpenConstituency] = useState(false);

  const handleCreateConstituency = async () => {
    const data = {
      // countyI
      constituency_name: countyName,
      county_id: countryId,
    };
    try {
      const res = await apiService.post(endpoints.createConstituency, data);

      setOpenConstituency(false);
      fetchCountiesAndContituencies();
      message.success("County Created Successfully");
    } catch (error) {
      console.log(error);
    } finally {
      // setCreateContituency(false)
      setCountyName("");
      setCountryId("");
    }
  };

  return (
    <div className="p-3">
      <p className="text-[18px] text-primary font-semibold my-3">
        Counties & Contituencies
      </p>
      <div className="flex w-[100%]  gap-5 mr-6 mb-4 mt-7">
        <Button
          variant="text"
          color="primary"
          startIcon={<Add />}
          onClick={() => setCreateCounty(true)}
        >
          Add County
        </Button>
        <Button
          variant="text"
          color="primary"
          onClick={() => setOpenConstituency(true)}
          startIcon={<Add />}
        >
          Add Constituency
        </Button>
      </div>

      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            padding: "40px",
            maxWidth: "500px",
            width: "100%",
          },
        }}
        open={openConstituency}
        onClose={() => setOpenConstituency(false)}
      >
        <div className="flex w-full justify-between max-h-8 mb-3">
          {" "}
          <p className="text-base text-primary font-semibold mb-5">
            Create Constituency
          </p>
        </div>
        <form>
          <div className="mb-4">
            <label
              htmlFor="end_date"
              className="block text-xs font-medium text-[13px] text-gray-700"
            >
              Constituency Name
            </label>
            <input
              type="text"
              id="end_date"
              name="end_date"
              value={countyName}
              onChange={(e) => setCountyName(e.target.value)}
              className="mt-1 block w-full p-2 bg-white border border-gray-400 text-[13px] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="">
            <label
              htmlFor="end_date"
              className="block text-xs font-medium text-[13px] text-gray-700"
            >
              County
            </label>
            <TextField
              select
              variant="outlined"
              size="small"
              fullWidth
              // name="extension"
              sx={{
                my: 1,
              }}
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
              className="mt-1 block w-full  rounded-md border-gray-400"
            >
              <MenuItem value="none">Select Country</MenuItem>
              {Array.isArray(countries) &&
                rowData.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.county_name}
                  </MenuItem>
                ))}
            </TextField>
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateConstituency}
          >
            <p className="text-xs">Create Constistuency</p>
          </Button>
        </form>
      </Dialog>
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            padding: "40px",
            maxWidth: "500px",
            width: "100%",
          },
        }}
        open={createCounty}
        onClose={() => setCreateCounty(false)}
      >
        <div className="flex w-full justify-between max-h-8 mb-3">
          <p className="text-base text-primary font-semibold mb-5">
            Create County
          </p>
        </div>
        <form>
          <div className="mb-4">
            <label
              htmlFor="end_date"
              className="block text-xs font-medium text-[13px] text-gray-700"
            >
              County Name
            </label>
            <input
              type="text"
              id="end_date"
              name="end_date"
              value={countyName}
              onChange={(e) => setCountyName(e.target.value)}
              className="mt-1 block w-full p-2 bg-white border border-gray-400 text-[13px] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="end_date"
              className="block text-xs font-medium text-[13px] text-gray-700"
            >
              County Code
            </label>
            <input
              type="text"
              id="end_date"
              name="end_date"
              value={countyCode}
              onChange={(e) => setCountyCode(e.target.value)}
              className="mt-1 block w-full p-2 bg-white border border-gray-400 text-[13px] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="">
            <label
              htmlFor="end_date"
              className="block text-xs font-medium text-[13px] text-gray-700"
            >
              Country
            </label>
            <TextField
              select
              variant="outlined"
              size="small"
              fullWidth
              // name="extension"
              sx={{
                my: 1,
              }}
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
              className="mt-1 block w-full  rounded-md border-gray-400"
            >
              <MenuItem value="none">Select Country</MenuItem>
              {Array.isArray(countries) &&
                countries.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.country_name}
                  </MenuItem>
                ))}
            </TextField>
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateCounty}
          >
            <p className="text-xs">Create County</p>
          </Button>
        </form>
      </Dialog>
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
              dataSource={record.constituencies}
              pagination={false}
              rowKey="id"
              className="child-table"
              rowClassName="child-row"
            />
          ),
          rowExpandable: (record) =>
            record.constituencies && record.constituencies.length > 0,
        }}
        rowKey="id"
      />
    </div>
  );
};

export default Counties;
