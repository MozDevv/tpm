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
  Divider,
} from "@mui/material";
import { message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function NewUserCard({ data, setSuccess, setOpenBaseCard }) {
  const { alert, setAlert } = useAlert();
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedAdminType, setSelectedAdminType] = useState("");
  const [selectedMDA, setSelectedMDA] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const { isLoading, setIsLoading } = useIsLoading();

  const validateForm = (userData) => {
    let formErrors = {};

    if (!userData.firstName) formErrors.firstName = "First Name is required";
    if (!userData.lastName) formErrors.lastName = "Last Name is required";
    if (!userData.employeeNumber)
      formErrors.employeeNumber = "Employee Number is required";
    if (!userData.phoneNumber)
      formErrors.phoneNumber = "Phone Number is required";
    if (!userData.email) formErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(userData.email))
      formErrors.email = "Email is invalid";

    return formErrors;
  };

  const router = useRouter();

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
      firstName: formData.get("firstName"),
      middleName: formData.get("middleName"),
      lastName: formData.get("lastName"),
      ...(selectedAdminType === "Treasury" && {
        department: selectedDepartment,
        role: selectedRole,
      }),
      employeeNumber: formData.get("employeeNumber"),
      phoneNumber: formData.get("phoneNumber"),
      email: formData.get("email"),
      mdaid: selectedMDA, // Include the MDA ID in the user data
      //adminType: selectedAdminType, // Include the admin type in the user data
      isMDA: selectedAdminType === "MDA" ? true : false,
    };
    console.log(userData);

    const formErrors = validateForm(userData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

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

        setOpenBaseCard(false);
        // router.push("/pensions/users");
      }

      if (res.data.isSuccess === false) {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error.response);

      message.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [departments, setDepartments] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [mdas, setMDAs] = useState([]); // State to store MDA options

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
        "paging.pageNumber": 1,
        "paging.pageSize": 200,
      });
      setDepartments(res.data.data);

      console.log("departments", res.data.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchMDAs = async () => {
    try {
      const res = await apiService.get(endpoints.mdas, {
        "paging.pageNumber": 1,
        "paging.pageSize": 200,
      });
      setMDAs(res.data.data);
      console.log("mdas", res.data.data);
    } catch (error) {
      console.error("Error fetching MDAs:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchRoles();
    fetchMDAs(); // Fetch MDA options on component mount
  }, []);

  return (
    <div className="p-2 mt-1 h-[75vh] grid grid-cols-12 gap-2">
      <div className="col-span-12 bg-white  rounded-2xl px-4">
        <div className="px-6">
          <form id="new-user-form" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between p-2 mb-3">
              <div className="flex items-center gap-2">
                <h5 className="text-xl font-semibold ml-4 text-primary"></h5>
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

            <div className="pb-4 ">
              <div className="mb-4 flex items-center gap-2">
                <h6 className="font-semibold text-primary text-sm">
                  User Type
                </h6>
                <hr className="flex-grow border-blue-500 border-opacity-20" />
              </div>
              <div className="flex justify-evenly gap-4 px-8">
                <div className="flex flex-col flex-1">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                    Select User Type
                    <div className="text-red-600 text-base mt-[3px]">*</div>
                  </label>
                  <select
                    name="adminType"
                    value={selectedAdminType}
                    onChange={(e) => setSelectedAdminType(e.target.value)}
                    className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm w-full"
                    required
                  >
                    <option value="">Select User Type</option>

                    <option value="MDA">MDA</option>
                    <option value="Treasury">Treasury</option>
                    <option value="Treasury">Other</option>
                  </select>
                </div>
              </div>
            </div>
            {selectedAdminType && (
              <>
                {selectedAdminType === "MDA" && (
                  <div className="pb-4 mb-2">
                    <div className="mb-4 flex items-center gap-2">
                      <h6 className="font-semibold text-primary text-sm">
                        MDA
                      </h6>
                      <hr className="flex-grow border-blue-500 border-opacity-20" />
                    </div>
                    <div className="flex justify-evenly gap-4 px-8">
                      <div className="flex flex-col flex-1">
                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                          Select MDA
                          <div className="text-red-600 text-base mt-[3px]">
                            *
                          </div>
                        </label>
                        <select
                          name="mda"
                          value={selectedMDA}
                          onChange={(e) => setSelectedMDA(e.target.value)}
                          className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm w-full"
                          required
                        >
                          <option value="">Select MDA</option>
                          {mdas.map((mda) => (
                            <option key={mda.id} value={mda.id}>
                              {mda.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                {selectedAdminType === "Treasury" && (
                  <div className="pb-4">
                    <div className="mb-4 flex items-center gap-2">
                      <h6 className="font-semibold text-primary text-sm">
                        Roles & Departments
                      </h6>
                      <hr className="flex-grow border-blue-500 border-opacity-20" />
                    </div>
                    <div className="flex px-3 ">
                      <div className="flex justify-evenly w-1/3 px-5 ml-1">
                        <div className="flex flex-col flex-1">
                          <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                            Department
                            <div className="text-red-600 text-base mt-[3px]">
                              *
                            </div>
                          </label>
                          <select
                            name="role"
                            value={selectedDepartment}
                            onChange={(e) =>
                              setSelectedDepartment(e.target.value)
                            }
                            className="border border-gray-300 text-gray-600 rounded-md p-2 text-sm bg-gray-100 "
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
                      </div>
                      <div className="flex justify-evenly w-1/3 px-5 pr-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                            Role
                            <div className="text-red-600 text-base mt-[3px]">
                              *
                            </div>
                          </label>
                          <select
                            name="role"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="border border-gray-300 text-gray-600 rounded-md p-2 text-sm bg-gray-100"
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
                    </div>
                  </div>
                )}
                <div className="pb-4">
                  <div className="mb-4 flex items-center gap-2">
                    <h6 className="font-semibold text-primary text-sm">Bio</h6>
                    <hr className="flex-grow border-blue-500 border-opacity-20" />
                  </div>
                  <div className="flex justify-evenly gap-4 px-4">
                    <div className="flex justify-evenly w-1/3 px-3 ml-1">
                      <div className="flex flex-col flex-1">
                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                          First Name
                          <div className="text-red-600 text-base mt-[3px]">
                            *
                          </div>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm w-full"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-evenly w-1/3 px-3 ml-1 mt-3">
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
                    </div>
                    <div className="flex justify-evenly w-1/3 px-3 ml-1">
                      <div className="flex flex-col flex-1">
                        <label className="text-xs font-semibold text-gray-600  flex items-center gap-[4px]">
                          Last Name
                          <div className="text-red-600 text-base mt-[3px]">
                            *
                          </div>
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
                </div>
                <div className="pb-4">
                  <div className="mb-4 flex items-center gap-2">
                    <h6 className="font-semibold text-primary text-sm">
                      Contact
                    </h6>
                    <hr className="flex-grow border-blue-500 border-opacity-20" />
                  </div>
                  <div className="flex justify-evenly gap-4 px-4">
                    <div className="flex justify-evenly w-1/3 px-3 ml-1">
                      <div className="flex flex-col flex-1">
                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                          Email Address
                          <div className="text-red-600 text-base mt-[3px]">
                            *
                          </div>
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm w-full"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-evenly w-1/3 px-3 ml-1">
                      <div className="flex flex-col flex-1">
                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                          Employee Number
                          <div className="text-red-600 text-base mt-[3px]">
                            *
                          </div>
                        </label>
                        <input
                          type="text"
                          name="employeeNumber"
                          className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm w-full"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-evenly w-1/3 px-3 ml-1">
                      <div className="flex flex-col flex-1">
                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                          Phone Number
                          <div className="text-red-600 text-base mt-[3px]">
                            *
                          </div>
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
              </>
            )}
          </form>
        </div>
      </div>
      {/* <div className="col-span-3 bg-white  rounded-2xl p-4 ml-3 mr-2">
        <div className="flex items-center justify-center gap-2 pt-5">
          <Avatar sx={{ height: "100px", width: "100px" }} />
        </div>
      </div> */}
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
