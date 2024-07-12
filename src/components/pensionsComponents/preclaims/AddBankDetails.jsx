"use client";
import { useAlert } from "@/context/AlertContext";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

import endpoints, { apiService } from "@/components/services/setupsApi";
import { useRouter } from "next/navigation";

function AddBankDetails({ id }) {
  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [formData, setFormData] = useState({
    bankId: "",
    branchId: "",
    accountNumber: "",
    accountName: "",
  });

  const [errors, setErrors] = useState({});

  const { alert, setAlert } = useAlert();

  const fetchBanksAndBranches = async () => {
    try {
      const res = await apiService.get(endpoints.getBanks);
      const rawData = res.data.data;

      const banksData = rawData.map((bank) => ({
        id: bank.id,
        name: bank.name,
      }));

      const branchesData = rawData.flatMap((bank) =>
        bank.branches.map((branch) => ({
          ...branch,
          bankId: bank.id,
        }))
      );

      setBanks(banksData);
      setBranches(branchesData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBanksAndBranches();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "bankId") {
      setSelectedBank(value);
      setFormData((prevData) => ({
        ...prevData,
        branchId: "", // Clear the branch selection when bank changes
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, proceed with submitting data (e.g., API call)
      submitFormData(formData);
    } else {
      // Set errors for invalid fields
      setErrors(validationErrors);
    }
  };

  const validateForm = (data) => {
    let errors = {};
    if (!data.bankId) {
      errors.bankId = "Bank is required";
    }
    if (!data.branchId) {
      errors.branchId = "Branch is required";
    }
    if (!data.accountNumber) {
      errors.accountNumber = "Account Number is required";
    }
    return errors;
  };

  const router = useRouter();

  const submitFormData = async (formData) => {
    const data = {
      prospective_pensioner_id: id,
      bank_branch_id: formData.branchId,
      account_number: formData.accountNumber,
      account_name: formData.accountName,
    };

    try {
      const res = await apiService.post(endpoints.createBankforPensioner, data);

      if (res.status === 200) {
        setAlert({
          open: true,
          message: "Bank details submitted successfully",
          severity: "success",
        });
      }
      router.push(`/pensions/preclaims/listing/new/add-work-history?id=${id}`);
      //router.push(`/pensions/preclaims/listing`);

      console.log("Data", res.data);
    } catch (error) {
      console.log(error);

      console.log(data);
    }
  };

  const filteredBranches = selectedBank
    ? branches.filter((branch) => branch.bankId === selectedBank)
    : [];

  return (
    <form onSubmit={handleSubmit} className="w-full p-2 mt-8">
      <div className="col-span-12 max-h-[100%] overflow-y-auto bg-white shadow-sm rounded-2xl pb-4">
        <div className="flex items-center justify-between px-6 py-3 w-[100%]">
          <div className="flex items-center gap-2">
            <h5 className="text-[17px] text-primary font-semibold">
              Add Bank Details
            </h5>
          </div>
          <div className="flex ">
            {" "}
            <div className="flex gap-8 mr-4">
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenCreate(false);
                  setErrors({});
                }}
                sx={{ maxHeight: "40px", mt: "5px" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                // onClick={handleSubmit}
                type="submit"
                sx={{ maxHeight: "40px", mt: "5px" }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
        <hr className="border-[1px] border-black-900 my-2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 p-10">
          <div className="flex flex-col mb-4">
            <label className="text-xs font-semibold text-gray-600">
              Bank Name
            </label>
            <select
              name="bankId"
              value={formData.bankId}
              onChange={handleInputChange}
              className={`border bg-gray-100 border-gray-300 rounded-md p-2 text-sm ${
                errors.bankId ? "border-red-500" : ""
              }`}
              required
            >
              <option value="">Select Bank Name</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
            {errors.bankId && (
              <span className="text-xs text-red-500">{errors.bankId}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-xs font-semibold text-gray-600">
              Branch Name
            </label>
            <select
              name="branchId"
              value={formData.branchId}
              onChange={handleInputChange}
              className={`border bg-gray-100 border-gray-300 rounded-md p-2 text-sm ${
                errors.branchId ? "border-red-500" : ""
              }`}
              required
              disabled={!selectedBank}
            >
              <option value="">Select Branch Name</option>
              {filteredBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {errors.branchId && (
              <span className="text-xs text-red-500">{errors.branchId}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-xs font-semibold text-gray-600">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              className={`border bg-gray-100 border-gray-300 rounded-md p-2 text-sm ${
                errors.accountNumber ? "border-red-500" : ""
              }`}
              required
            />
            {errors.accountNumber && (
              <span className="text-xs text-red-500">
                {errors.accountNumber}
              </span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-xs font-semibold text-gray-600">
              Account Name
            </label>
            <input
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={handleInputChange}
              className={`border bg-gray-100 border-gray-300 rounded-md p-2 text-sm ${
                errors.accountName ? "border-red-500" : ""
              }`}
              required
            />
          </div>
        </div>
      </div>
    </form>
  );
}

export default AddBankDetails;
