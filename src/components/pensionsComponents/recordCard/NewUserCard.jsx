"use client";
import { useAlert } from "@/context/AlertContext";
import { ArrowBack, ArrowBackIos } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";

function NewUserCard({ data, setSuccess }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
      firstName: formData.get("firstName"),
      middleName: formData.get("middleName"),
      lastName: formData.get("lastName"),
      department: formData.get("department"),
      role: formData.get("role"),
      employeeNumber: formData.get("employeeNumber"),
      email: formData.get("email"),
    };
    console.log(userData);

    const token = localStorage.getItem("token");

    try {
      const res = await AuthApiService.post(authEndpoints.register(userData));

      console.log(res.data);
    } catch (error) {
      console.log(error.response);
    } finally {
      setDrawerOpen(false);
    }
  };
  const [selectedRole, setSelectedRole] = useState("Admin");

  const { alert, setAlert } = useAlert();
  const handleClickSave = () => {
    setAlert({
      open: true,
      message: "User added successfully",
      severity: "success",
    });
  };

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="p-2 mt-12 h-[75vh] grid grid-cols-12 gap-2">
      <div className="col-span-9 bg-white shadow-md rounded-2xl p-4">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <h5 className="text-xl text-black font-semibold ml-4">New User</h5>
          </div>
          <div className="flex gap-8 mr-4">
            <button
              className="bg-gray-200 text-primary text-sm font-medium px-4 py-2 rounded-md"
              onClick={() => setOpenDialog(true)}
            >
              Cancel
            </button>
            <button
              onClick={handleClickSave}
              className="bg-primary text-sm font-medium text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="pb-4">
            <div className="mb-4 flex items-center gap-2">
              <h6 className="font-semibold text-primary text-sm">Bio</h6>
              <hr className="flex-grow border-blue-500 border-opacity-20" />
            </div>
            <div className="flex justify-evenly gap-4 px-4">
              <div className="flex flex-col flex-1">
                <label className="text-xs font-semibold text-gray-600">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm w-full"
                  required
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-xs font-semibold text-gray-600">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm w-full"
                  required
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-xs font-semibold text-gray-600">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm w-full"
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="mb-2 flex items-center gap-2">
              <h6 className="font-semibold text-primary text-sm">Overview</h6>
              <hr className="flex-grow border-blue-500 border-opacity-20" />
            </div>
            <div className="flex justify-evenly gap-4 px-4 mb-3">
              <div className="flex flex-col flex-1">
                <label className="text-xs font-semibold text-gray-600">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm w-full"
                  required
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-xs font-semibold text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm w-full"
                  required
                />
              </div>

              <div className="flex flex-col flex-1">
                <label className="text-xs font-semibold text-gray-600">
                  Employee Number
                </label>
                <input
                  type="text"
                  name="employeeNumber"
                  className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm w-full"
                  required
                />
              </div>
            </div>
          </div>
          <div className="my-3 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <h6 className="font-semibold text-primary text-sm">
                Additional Details
              </h6>
              <hr className="flex-grow border-blue-500 border-opacity-20" />
            </div>
            <div className="flex justify-evenly  w-1/3 px-3 ml-1">
              <div className="flex flex-col flex-1">
                <label className="text-xs font-semibold text-gray-600">
                  Role
                </label>
                <select
                  name="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="border border-gray-300 text-gray-600 rounded-md p-2 text-sm bg-gray-100 w-full"
                  required
                >
                  <option value="Admin">Admin</option>
                  <option value="Business Admin">Business Admin</option>
                  <option value="Support">Support</option>
                  <option value="Board Member">Board Member</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-3 bg-white shadow-md rounded-2xl p-4 ml-3 mr-2">
        <div className="flex items-center justify-center gap-2 pt-5">
          <Avatar sx={{ height: "100px", width: "100px" }} />
        </div>
      </div>
      <Dialog
        sx={{ p: 1 }}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>
          <h4 className="text-primary font-semibold text-base">
            Confirm Cancellation
          </h4>
        </DialogTitle>
        <DialogContent>
          <p className="font-medium text-sm ">
            Are you sure you want to cancel? Any unsaved changes will be lost.
          </p>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
        >
          <Button
            onClick={() => setOpenDialog(false)}
            size="small"
            variant="contained"
            color="primary"
          >
            No, Continue
          </Button>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            size="small"
            color="error"
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NewUserCard;
