import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

function EditBeneficiaryDialog({ open, onClose, beneficiary }) {
  const [formData, setFormData] = React.useState(beneficiary || {});

  React.useEffect(() => {
    setFormData(beneficiary || {});
    console.log("beneficiary", beneficiary);
  }, [beneficiary]);

  console.log("beneficiary", beneficiary);

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
  const fields = [
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
    { label: "Guardian Surname", name: ["guardian", "surname"], type: "text" },
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
    { label: "Guardian Address", name: ["guardian", "address"], type: "text" },
    {
      label: "Guardian Email Address",
      name: ["guardian", "email_address"],
      type: "email",
    },
    { label: "Guardian City", name: ["guardian", "city"], type: "text" },
  ];

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
            Beneficiary Details
          </p>
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((field, index) => {
              // Extract value from formData based on field.name
              const fieldValue = Array.isArray(field.name)
                ? field.name.reduce((acc, key) => acc && acc[key], formData)
                : formData[field.name];

              // Only render field if value is present
              if (fieldValue || fieldValue === 0) {
                return (
                  <div key={index} className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600">
                      {field.label}
                    </label>
                    <TextField
                      type={field.type}
                      name={field.name}
                      variant="outlined"
                      size="small"
                      value={
                        field.render
                          ? field.render(fieldValue)
                          : fieldValue || ""
                      }
                      onChange={handleChange}
                      required
                      disabled
                      fullWidth
                      sx={{
                        fontWeight: 600,
                        "& .MuiInputBase-input.Mui-disabled, & .MuiOutlinedInput-input.Mui-disabled":
                          {
                            color: "rgba(0, 0, 0, 0.4)", // Darken text color
                            fontWeight: 600, // Bold text
                            WebkitTextFillColor: "rgba(0, 0, 0, 0.6)", // Ensures the color is applied in WebKit browsers
                          },
                      }}
                    />
                  </div>
                );
              }

              // Return null if the field is not to be displayed
              return null;
            })}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="error">
            Cancel
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default EditBeneficiaryDialog;
