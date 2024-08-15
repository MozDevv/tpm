import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Collapse,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { ExpandLess, KeyboardArrowRight } from "@mui/icons-material";

function EditBeneficiaryDialog({ open, onClose, beneficiary, isGuardian }) {
  const [formData, setFormData] = React.useState(beneficiary || {});
  const [openSections, setOpenSections] = React.useState({
    personalDetails: false,
    sections: false,
    paymentDetails: false,
  });

  React.useEffect(() => {
    setFormData(beneficiary || {});
    console.log("beneficiary", beneficiary);
  }, [beneficiary]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Add save logic here
    console.log("Saving data:", formData);
    onClose();
  };

  // Define fields based on provided column structure
  const fields = {
    personalDetails: [
      { label: "First Name", name: "first_name", type: "text" },
      { label: "Surname", name: "surname", type: "text" },
      { label: "Identification Number", name: "identifier", type: "text" },
      { label: "National ID", name: "national_id", type: "text" },
      { label: "Email Address", name: "email_address", type: "email" },
      { label: "Phone", name: "mobile_number", type: "text" },
      { label: "Address", name: "address", type: "text" },
      { label: "City", name: "city", type: "text" },
      { label: "Date of Birth", name: "dob", type: "date" },
      { label: "Percentage", name: "percentage", type: "number" },
      { label: "Date of Death", name: "date_of_death", type: "date" },
      {
        label: "Guardian Surname",
        name: ["guardian", "surname"],
        type: "text",
      },
      {
        label: "Guardian First Name",
        name: ["guardian", "first_name"],
        type: "text",
      },
      {
        label: "Guardian Identifier",
        name: ["guardian", "identifier"],
        type: "text",
      },
      {
        label: "Guardian Mobile Number",
        name: ["guardian", "mobile_number"],
        type: "text",
      },
      {
        label: "Guardian Address",
        name: ["guardian", "address"],
        type: "text",
      },
      {
        label: "Guardian Email Address",
        name: ["guardian", "email_address"],
        type: "email",
      },
      { label: "Guardian City", name: ["guardian", "city"], type: "text" },

      { label: "Timestamp", name: "timestamp", type: "text" },
      {
        label: "Birth Certificate Number",
        name: "birth_cert_no",
        type: "text",
      },
      // { label: "Preview URL", name: "preview_url", type: "text" },
      { label: "Share Percentage", name: "share_percentage", type: "number" },
      {
        label: "Identification Type",
        name: "identification_type",
        type: "text",
      },
      { label: "Display Name", name: "display_name", type: "text" },
      { label: "Other Name", name: "other_name", type: "text" },
      { label: "Postal Address", name: "postal_address", type: "text" },
      { label: "Postal Code", name: "postal_code", type: "text" },

      { label: "Postal Code Name", name: "postal_code_name", type: "text" },
      { label: "Gender", name: "gender", type: "number" },
      { label: "Parent Name", name: "parent_name", type: "text" },
      { label: "Relationship", name: "relationship", type: "text" },
      { label: "KRA PIN", name: "kra_pin", type: "text" },
      { label: "Is Guardian", name: "is_guardian", type: "text" },

      { label: "Deceased", name: "deceased", type: "text" },
    ],
    paymentDetails: [
      { label: "Bank", name: "bank", type: "text" },
      { label: "Bank Branch", name: "bank_branch", type: "text" },
      { label: "Account Name", name: "account_name", type: "text" },
      { label: "Account Number", name: "account_number", type: "text" },
    ],
  };

  const handleToggleSection = (section) => {
    setOpenSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ padding: "20px" }}
    >
      <div className="p-8">
        <DialogTitle>
          <p className="text-primary py-3 text-lg font-bold">
            {isGuardian ? "Guardian" : "Beneficiary"} Details
          </p>
        </DialogTitle>
        <DialogContent>
          {Object.keys(fields).map((sectionKey) => (
            <div key={sectionKey} className="p-2 ">
              <div className="flex items-center gap-2">
                <h6 className="font-semibold text-primary text-sm">
                  {sectionKey.replace(/([A-Z])/g, " $1").toUpperCase()}
                </h6>
                <IconButton
                  sx={{ ml: "-5px", zIndex: 1 }}
                  onClick={() => handleToggleSection(sectionKey)}
                >
                  {!openSections[sectionKey] ? (
                    <KeyboardArrowRight
                      sx={{ color: "primary.main", fontSize: "14px" }}
                    />
                  ) : (
                    <ExpandLess
                      sx={{ color: "primary.main", fontSize: "14px" }}
                    />
                  )}
                </IconButton>
                <hr className="flex-grow border-blue-500 border-opacity-20" />
              </div>
              <Collapse
                in={!openSections[sectionKey]}
                timeout="auto"
                unmountOnExit
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 p-6">
                  {fields[sectionKey].map((field, fieldIndex) => {
                    const fieldValue = Array.isArray(field.name)
                      ? field.name.reduce(
                          (acc, key) => acc && acc[key],
                          formData
                        )
                      : formData[field.name];

                    if (fieldValue === undefined || fieldValue === null) {
                      return null; // Skip rendering this field if its value is not present
                    }

                    return (
                      <div key={fieldIndex} className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600">
                          {field.label}
                        </label>
                        {field.type === "select" ? (
                          <TextField
                            select
                            variant="outlined"
                            size="small"
                            fullWidth
                            name={field.name}
                            value={fieldValue || ""}
                            onChange={handleChange}
                            // Add logic for options if needed
                          >
                            <MenuItem value="">Select {field.label}</MenuItem>
                            {/* Map options here if needed */}
                          </TextField>
                        ) : field.type === "autocomplete" ? (
                          <Autocomplete
                            options={field.children || []}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                              handleChange({
                                target: {
                                  name: field.name,
                                  value: newValue ? newValue.id : "",
                                },
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                fullWidth
                                name={field.name}
                              />
                            )}
                            value={
                              field.children?.find(
                                (option) => option.id === fieldValue
                              ) || null
                            }
                          />
                        ) : (
                          <TextField
                            type={field.type}
                            name={field.name}
                            variant="outlined"
                            size="small"
                            value={fieldValue || ""}
                            onChange={handleChange}
                            fullWidth
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </Collapse>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="error">
            Cancel
          </Button>
          {/* <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button> */}
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default EditBeneficiaryDialog;
