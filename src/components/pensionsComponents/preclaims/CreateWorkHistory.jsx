"use client";

import React, { useEffect, useState } from "react";
import { TextField, MenuItem, Box, Button } from "@mui/material";
import preClaimsEndpoints, {
  apiService,
} from "@/components/services/preclaimsApi";
import endpoints from "@/components/services/setupsApi";
import { useAlert } from "@/context/AlertContext";

function CreateWorkHistory({
  setOpenPreclaimDialog,
  setOpenCreateWorkHistory,
  clickedItem,
}) {
  const [prospectivePensionerId, setProspectivePensionerId] = useState("");
  const [termsOfServiceId, setTermsOfServiceId] = useState("");
  const [personalNumber, setPersonalNumber] = useState("");
  const [position, setPosition] = useState("");
  const [salaryAmount, setSalaryAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { alert, setAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      prospective_pensioner_id: clickedItem.id,
      terms_of_service_id: termsOfServiceId,
      personal_number: clickedItem.personal_number,
      position,
      salary_amount: salaryAmount,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
    };

    try {
      const res = await apiService.post(
        preClaimsEndpoints.createWorkHistory,
        data
      );

      console.log(res.data);
      console.log(data);
      setOpenCreateWorkHistory(false);
      setOpenPreclaimDialog(false);
      //setOpenPreclaimDialog(false);
      setAlert({
        open: true,
        message: "Work History Created Successfully",
        severity: "success",
      });
    } catch (error) {
      console.log(error);
      console.log(data);
    }
  };
  const [termsOfService, setTermsOfService] = useState([]); // [1
  const getTermsOfService = async () => {
    try {
      const response = await apiService.get(endpoints.termsOfService);

      console.log("response", response.data.data);

      setTermsOfService(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTermsOfService();
  }, []);

  return (
    <div className="p-10">
      <p className="text-base text-primary font-semibold mb-5">
        Add Work History
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="position"
            className="block text-xs font-medium text-gray-700"
          >
            Position
          </label>

          <TextField
            variant="outlined"
            size="small"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            fullWidth
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="salary_amount"
            className="block text-xs font-medium text-gray-700"
          >
            Salary Amount
          </label>

          <TextField
            variant="outlined"
            type="number"
            size="small"
            value={salaryAmount}
            onChange={(e) => setSalaryAmount(e.target.value)}
            required
            fullWidth
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="start_date"
            className="block text-xs font-medium text-gray-700"
          >
            Start Date
          </label>

          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="mt-1 block w-full p-2 text-[13px] bg-white border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="end_date"
            className="block text-xs font-medium text-[13px] text-gray-700"
          >
            End Date
          </label>
          <input
            type="datetime-local"
            id="end_date"
            name="end_date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full p-2 bg-white border border-gray-400 text-[13px] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="mb-1">
          <label
            htmlFor="extension"
            className="block text-xs font-medium text-gray-700"
          >
            Terms of Service
          </label>
          <TextField
            select
            variant="outlined"
            size="small"
            fullWidth
            name="extension"
            value={termsOfServiceId}
            onChange={(e) => setTermsOfServiceId(e.target.value)}
            className="mt-1 block w-full  rounded-md border-gray-400"
          >
            <MenuItem value="">Select Terms of Service</MenuItem>
            {termsOfService?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="flex w-full justify-between">
          <Button
            type="submit"
            sx={{ mt: 5 }}
            variant="outlined"
            color="primary"
            onClick={() => setOpenCreateWorkHistory(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            sx={{ mt: 5 }}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateWorkHistory;
