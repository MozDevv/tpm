"use client";
import React, { useState } from "react";
import { Dialog, Button, TextField } from "@mui/material";
import endpoints, { apiService } from "@/components/services/setupsApi";

function OpenMda({ mdaClicked, setMdaClicked, rowClicked }) {
  const [editMode, setEditMode] = useState(false);

  // State to track changes in form fields
  const [formData, setFormData] = useState({
    mda_id: rowClicked?.id || "",
    pension_cap_id: rowClicked?.pensionCapId || "",
    name: rowClicked?.name || "",
    description: rowClicked?.description || "",
    code: rowClicked?.code || "",
    official_email_address: rowClicked?.official_email_address || "",
    official_phone_number: rowClicked?.official_phone_number || "",
    location: rowClicked?.location || "",
    postal_address: rowClicked?.postal_address || "",
  });

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const res = await apiService.post(endpoints.updateMDA, {
        mda_id: rowClicked.mda_id, // Assuming rowClicked contains mda_id
        ...formData,
      });

      console.log("Update successful:", res.data); // Log response from API
      setEditMode(false); // Exit edit mode after successful save
    } catch (error) {
      console.log("formData", formData);
      console.error("Error updating MDA:", error);
      // Handle error as needed
    }
  };

  const handleClose = () => {
    setMdaClicked(false);
    setEditMode(false); // Ensure edit mode is reset when closing dialog
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            padding: "40px",
            maxWidth: "500px",
            width: "100%",
          },
        }}
        open={mdaClicked}
        onClose={handleClose}
      >
        <div className="flex w-full justify-between max-h-8 mb-3">
          <p className="text-base text-primary font-semibold mb-5">MDA</p>
          <Button variant="contained" color="primary">
            <p className="text-xs">Map to Document Type</p>
          </Button>
        </div>
        <form>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-xs font-medium text-[13px] text-gray-700"
            >
              Name
            </label>
            <TextField
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
              variant="outlined"
              size="small"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-xs font-medium text-[13px] text-gray-700"
            >
              Description
            </label>
            <TextField
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
              variant="outlined"
              size="small"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="code"
              className="block text-xs font-medium text-[13px] text-gray-700"
            >
              Code
            </label>
            <TextField
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
              variant="outlined"
              size="small"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="official_email_address"
              className="block text-xs font-medium text-[13px] text-gray-700"
            >
              Official Email Address
            </label>
            <TextField
              id="official_email_address"
              name="official_email_address"
              value={formData.official_email_address}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
              variant="outlined"
              size="small"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="official_phone_number"
              className="block text-xs font-medium text-[13px] text-gray-700"
            >
              Official Phone Number
            </label>
            <TextField
              id="official_phone_number"
              name="official_phone_number"
              value={formData.official_phone_number}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
              variant="outlined"
              size="small"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-xs font-medium text-[13px] text-gray-700"
            >
              Location
            </label>
            <TextField
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
              variant="outlined"
              size="small"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="postal_address"
              className="block text-xs font-medium text-[13px] text-gray-700"
            >
              Postal Address
            </label>
            <TextField
              id="postal_address"
              name="postal_address"
              value={formData.postal_address}
              onChange={handleChange}
              disabled={!editMode}
              fullWidth
              variant="outlined"
              size="small"
            />
          </div>

          <div className="flex justify-between w-full">
            {editMode ? (
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            ) : (
              <Button variant="outlined" onClick={handleEdit}>
                Edit
              </Button>
            )}
            <Button variant="contained" color="warning">
              Delete
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

export default OpenMda;
