import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, Collapse, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAlert } from "@/context/AlertContext";
import endpoints, { apiService } from "@/components/services/setupsApi";
import preClaimsEndpoints from "@/components/services/preclaimsApi";
import { message } from "antd";
import { ExpandLess, KeyboardArrowRight } from "@mui/icons-material";

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

  useEffect(() => {
    if (id) {
      fetchExistingBankDetails(id);
    }

    // Fetch banks and branches
    fetchBanksAndBranches();
  }, [id]);

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
      moveToNextTab();
      return;
    }
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      submitFormData(formData);
    } else {
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
    return errors;
  };

  const submitFormData = async (formData) => {
    if (id) {
      moveToNextTab();
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

      message.success("Bank details submitted successfully");
      moveToNextTab();
    } catch (error) {
      console.log("Error submitting bank details:", error);
    }
  };

  const filteredBranches = selectedBank
    ? branches.filter((branch) => branch.bankId === selectedBank)
    : [];

  const handlePrevious = () => {
    moveToPreviousTab();
  };

  const fields = [
    {
      type: "text",
      label: "Bank",
      name: "bankId",
      required: true,
      options: banks,
    },
    {
      type: "text",
      label: "Branch",
      name: "branchId",
      required: true,
    },
    {
      type: "text",
      label: "Account Number",
      name: "accountNumber",
      required: true,
    },
    {
      type: "text",
      label: "Account Name",
      name: "accountName",
      required: true,
    },
  ];

  const sectionKey = "bankDetails";
  const [openSections, setOpenSections] = useState({});
  const handleToggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <form className="w-full p-2" onSubmit={handleSubmit}>
      <div className="flex items-center">
        <p className="mt-3 ml-4 mb-5 text-primary text-[16px] font-montserrat font-semibold">
          Bank Details
        </p>
        <IconButton
          sx={{ ml: "5px", zIndex: 1, mt: "-6px" }}
          onClick={() => handleToggleSection(sectionKey)}
        >
          {!openSections[sectionKey] ? (
            <KeyboardArrowRight
              sx={{ color: "primary.main", fontSize: "14px" }}
            />
          ) : (
            <ExpandLess sx={{ color: "primary.main", fontSize: "14px" }} />
          )}
        </IconButton>
        <hr className="flex-grow border-blue-500 border-opacity-20 mt-[-6px]" />
      </div>
      <Collapse in={!openSections[sectionKey]} timeout="auto" unmountOnExit>
        <div className="col-span-12 max-h-[100%] overflow-y-auto bg-white shadow-sm rounded-2xl pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5">
            {fields.map((field, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600">
                  {field.label}
                </label>

                <TextField
                  type={field.type}
                  name={field.name}
                  variant="outlined"
                  size="small"
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  required={field.required}
                  fullWidth
                  disabled={hasBankDetails}
                />
              </div>
            ))}
          </div>
        </div>
      </Collapse>
    </form>
  );
}

export default AddBankDetails;
