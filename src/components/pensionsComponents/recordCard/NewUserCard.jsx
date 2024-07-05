"use client";
import authEndpoints, { AuthApiService } from "@/components/services/authApi";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { useAlert } from "@/context/AlertContext";
import { useIsLoading } from "@/context/LoadingContext";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";

function NewUserCard({ data, setSuccess }) {
  const { alert, setAlert } = useAlert();
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const { isLoading, setIsLoading } = useIsLoading();

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
      firstName: formData.get("firstName"),
      middleName: formData.get("middleName"),
      lastName: formData.get("lastName"),
      department: selectedDepartment,
      role: selectedRole,
      employeeNumber: formData.get("employeeNumber"),
      phoneNumber: formData.get("phoneNumber"),
      email: formData.get("email"),
    };
    console.log(userData);

    try {
      const res = await AuthApiService.post(authEndpoints.register, userData);
      console.log(res.data);
      if (res.data.isSuccess === true) {
        setAlert({
          open: true,
          message: "User added successfully",
          severity: "success",
        });
        event.target.reset();
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setIsLoading(false);
    }
  };

  const [departments, setDepartments] = useState([]);
  const [rolesList, setRolesList] = useState([]);

  const fetchRoles = async () => {
    try {
      const res = await apiService.get(endpoints.getRoles);
      if (res.status === 200) {
        setRolesList(res.data.data);
      }
      console.log("roles", res.data.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await apiService.get(endpoints.getDepartments, {
        paging: { pageNumber: 1, pageSize: 200 },
      });
      setDepartments(res.data.data);

      console.log("departments", res.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchRoles();
  }, []);

  return (
    <div className="p-2 mt-12 h-[75vh] grid grid-cols-12 gap-2">
      <div className="col-span-9 bg-white shadow-md rounded-2xl p-4">
        <div className="p-6">
          <form id="new-user-form" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <h5 className="text-xl text-black font-semibold ml-4">
                  New User
                </h5>
              </div>
              <div className="flex gap-8 mr-4">
                <button
                  className="bg-gray-200 text-primary text-sm font-medium px-4 py-2 rounded-md"
                  onClick={() => setOpenDialog(true)}
                >
                  Cancel
                </button>
                <button
                  className="bg-primary text-sm font-medium text-white px-4 py-2 rounded-md"
                  type="submit"
                  form="new-user-form"
                >
                  Save
                </button>
              </div>
            </div>
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
                  <select
                    name="department"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm w-full"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                      <option
                        key={department.departmentId}
                        value={department.departmentId}
                      >
                        {department.name}
                      </option>
                    ))}
                  </select>
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
              <div className="flex">
                <div className="flex justify-evenly w-1/3 px-3 ml-1">
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
                      <option value="">Select Role</option>
                      {rolesList.map((role) => (
                        <option key={role.roleId} value={role.roleId}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-evenly w-1/3 px-3 ml-1">
                  <div className="flex flex-col flex-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm w-full"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
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
