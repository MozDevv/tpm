import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAlert } from "@/context/AlertContext";
import endpoints, { apiService } from "@/components/services/setupsApi";
import preClaimsEndpoints from "@/components/services/preclaimsApi";
import { message } from "antd";

function AddBankDetails({ id, moveToNextTab, moveToPreviousTab }) {
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
  const router = useRouter();

  const [hasBankDetails, setHasBankDetails] = useState(false);

  // Function to fetch existing bank details if available
  const fetchExistingBankDetails = async (id) => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getProspectivePensioner(id)
      );
      const data = res?.data?.data[0];

      console.log("Data ********", res?.data?.data[0]);
      // Check if the retiree has bank details
      if (res?.data?.data[0]?.bankDetails?.length > 0) {
        setHasBankDetails(true);
        console.log("Existing bank details:", data.bankDetails);
      }

      setFormData({
        bankId: data.bankDetails[0]?.bankBranch?.bank?.name,
        branchId: data.bankDetails[0]?.bankBranch?.name,
        accountNumber: data.bankDetails[0]?.account_number,
        accountName: data.bankDetails[0]?.account_name,
      });
      console.log("Existing bank details:", data.bankDetails);
    } catch (error) {
      console.log("Error fetching existing bank details:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchExistingBankDetails(id);
    }

    // Fetch banks and branches
    fetchBanksAndBranches();
  }, [id]);

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
      console.log("Error fetching banks and branches:", error);
    }
  };

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
    if (hasBankDetails) {
      // router.push(`/pensions/preclaims/listing/new/add-work-history?id=${id}`);
      moveToNextTab();
      return;
    }
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
    // if (!data.accountNumber) {
    //   errors.accountNumber = "Account Number is required";
    // }
    return errors;
  };

  const submitFormData = async (formData) => {
    if (id) {
      moveToNextTab();
      // router.push(`/pensions/preclaims/listing/new/add-work-history?id=${id}`);
      return;
    }

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

      console.log("Bank details submitted successfully:", res.data);
      console.log("Data", data);
      message.success("Bank details submitted successfully");
      moveToNextTab();
      // router.push(`/pensions/preclaims/listing/new/add-work-history?id=${id}`);
    } catch (error) {
      console.log("Error submitting bank details:", error);
    }
  };
  g;
  const filteredBranches = selectedBank
    ? branches.filter((branch) => branch.bankId === selectedBank)
    : [];

  const handlePrevious = () => {
    moveToPreviousTab();
  };

  return (
    <form className="w-full p-2 mt-2">
      <div className="col-span-12 max-h-[100%] overflow-y-auto bg-white shadow-sm rounded-2xl pb-4">
        <div className="flex items-center justify-between px-6 py-3 w-[100%]">
          <div className="flex items-center gap-2">
            <h5 className="text-[17px] text-primary font-semibold">
              Add Bank Details
            </h5>
          </div>
          <div className="flex">
            {" "}
            <div className="flex gap-8 mr-4">
              <Button
                variant="outlined"
                onClick={handlePrevious}
                sx={{ maxHeight: "40px", mt: "5px" }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ maxHeight: "40px", mt: "5px" }}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        <hr className="border-[1px] border-black-900 my-2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 p-10">
          <div className="flex flex-col mb-4">
            <div className="flex flex-col mb-4">
              <label className="text-xs font-semibold text-gray-600">
                Bank
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.bankId}
                onChange={handleInputChange}
                className={`border bg-gray-100 border-gray-300 rounded-md p-2 text-sm ${
                  errors.accountNumber ? "border-red-500" : ""
                }`}
                required
              />
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-xs font-semibold text-gray-600">
              Branch
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.branchId}
              onChange={handleInputChange}
              className={`border bg-gray-100 border-gray-300 rounded-md p-2 text-sm ${
                errors.accountNumber ? "border-red-500" : ""
              }`}
              required
            />
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
              // required
            />
          </div>
        </div>
      </div>
    </form>
  );
}

export default AddBankDetails;
