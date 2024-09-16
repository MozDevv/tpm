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
import { ExpandLess, KeyboardArrowRight, Launch } from "@mui/icons-material";
import { message, Modal } from "antd";
import endpoints, { apiService } from "@/components/services/setupsApi";
import axios from "axios";

function EditBeneficiaryDialog({ open, onClose, beneficiary, isGuardian, id }) {
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
      { label: "Gender", name: "gender", type: "text" },
      { label: "Parent Name", name: "parent_name", type: "text" },
      { label: "Relationship", name: "relationship", type: "text" },
      { label: "KRA PIN", name: "kra_pin", type: "text" },
      // { label: "Is Guardian", name: "is_guardian", type: "text" },

      // { label: "Deceased", name: "deceased", type: "" },
      {
        label: "Birth Certificate Number",
        name: "birth_cert_no",
        type: "text",
      },
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

  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewContent, setPreviewContent] = React.useState(null);
  const [previewTitle, setPreviewTitle] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handlePreviewBirthCertificate = async () => {
    if (!formData.birth_cert_no) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `https://tntportalapi.agilebiz.co.ke/portal/birthCert/${id}/${formData.birth_cert_no}`,
        {
          responseType: "arraybuffer",
        }
      );
      const base64Data = res.data;
      console.log("base64Data", base64Data);
      if (base64Data) {
        setPreviewContent(new Blob([res.data], { type: "application/pdf" }));
        setPreviewTitle("Birth Certificate");
        setPreviewVisible(true);
      } else {
        message.error("No preview available for this document.");
      }
    } catch (error) {
      console.error("Error fetching birth certificate:", error);
      message.error("Failed to fetch birth certificate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              {isGuardian ? "Guardian" : "Beneficiary"} :{" "}
              {beneficiary?.relationship}
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
                              disabled={true}
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
                              disabled={true}
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
                              disabled={true}
                              variant="outlined"
                              size="small"
                              value={
                                (fieldValue === 2
                                  ? "Female"
                                  : fieldValue === 1
                                  ? "Male"
                                  : fieldValue) || ""
                              }
                              onChange={handleChange}
                              fullWidth
                            />
                          )}
                        </div>
                      );
                    })}

                    {formData.birth_cert_no &&
                      sectionKey === "personalDetails" && (
                        <Button
                          startIcon={<Launch />}
                          variant="outlined"
                          onClick={handlePreviewBirthCertificate}
                          size="small"
                          sx={{ mt: 2 }}
                        >
                          Preview Birth Certificate
                        </Button>
                      )}
                  </div>
                </Collapse>
              </div>
            ))}
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} variant="contained" color="error">
              Close
            </Button>
            {/* <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button> */}
          </DialogActions>
        </div>
      </Dialog>

      {/* <Dialog
        open={previewVisible}
        onClose={() => setPreviewVisible(false)}
        maxWidth="lg"
        fullWidth
        sx={{ padding: "20px", height: "500px" }}
      >
        <DialogTitle>{previewTitle}</DialogTitle>
        {previewContent}
      </Dialog> */}

      <Modal
        open={previewVisible}
        footer={null}
        title={previewTitle}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        height={600}
        bodyStyle={{ padding: 0, height: "75vh", top: 20, mt: 20 }}
        zIndex={2000}
      >
        {previewContent && (
          <iframe
            src={URL.createObjectURL(previewContent)}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </Modal>
    </>
  );
}

export default EditBeneficiaryDialog;
