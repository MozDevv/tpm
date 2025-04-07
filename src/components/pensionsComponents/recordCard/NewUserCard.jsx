'use client';
import authEndpoints, { AuthApiService } from '@/components/services/authApi';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { useAlert } from '@/context/AlertContext';
import { useIsLoading } from '@/context/LoadingContext';
import { de } from '@faker-js/faker';
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Popper,
  TextField,
} from '@mui/material';
import { message } from 'antd';
import MuiPhoneNumber from 'mui-phone-number';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { validateField } from '../preclaims/PreclaimsValidator';

function NewUserCard({ data, setSuccess, setOpenBaseCard }) {
  const { alert, setAlert } = useAlert();
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedAdminType, setSelectedAdminType] = useState('');
  const [selectedMDA, setSelectedMDA] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [errors, setErrors] = useState({});

  const [designationId, setDesignationId] = useState('');
  const [gradeId, setGradeId] = useState('');
  const { isLoading, setIsLoading } = useIsLoading();

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    employeeNumber: '',
    phoneNumber: '',
    email: '',
    id_number: '',
    passportNumber: '',
    is_department_head: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    //
    console.log(name, value);
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    const error = validateField(name, value, formData);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateForm = (userData) => {
    let formErrors = {};

    if (!userData.firstName) formErrors.firstName = 'First Name is required';
    if (!userData.lastName) formErrors.lastName = 'Last Name is required';
    if (!userData.employeeNumber) {
      formErrors.employeeNumber = 'Employee Number is required';
    } else if (isNaN(userData.employeeNumber)) {
      message.error('Employee Number must be a number');
      formErrors.employeeNumber = 'Employee Number must be a number';
    }

    // if (!userData.id_number) formErrors.id_number = "Id Number is required";
    if (!userData.phoneNumber)
      formErrors.phoneNumber = 'Phone Number is required';
    if (
      userData.phoneNumber &&
      !/^\+\d{1,4}\d{9}$|^0\d{9}$/.test(userData.phoneNumber)
    ) {
      message.error('Phone Number is invalid');
      formErrors.phoneNumber = 'Phone Number is invalid';
    }

    if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
      message.error('Email is invalid');
      formErrors.email = 'Email is invalid';
    }
    if (userData.id_number && !/^\d+$/.test(userData.id_number)) {
      message.error('Id Number is invalid');
      formErrors.id_number = 'Id Number is invalid';
    }
    if (!userData.email) formErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(userData.email))
      formErrors.email = 'Email is invalid';

    return formErrors;
  };

  const router = useRouter();

  const handleSubmit = async (event) => {
    // setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
      firstName: formData.get('firstName'),
      middleName: formData.get('middleName'),
      lastName: formData.get('lastName'),
      ...((selectedAdminType === 'Treasury' ||
        selectedAdminType === 'other') && {
        department: selectedDepartment,
        role: selectedRole,
      }),

      employeeNumber: formData.get('employeeNumber'),
      phoneNumber: formData.get('phoneNumber'),
      email: formData.get('email'),
      mdaid: selectedMDA, // Include the MDA ID in the user data
      //adminType: selectedAdminType, // Include the admin type in the user data
      isMDA: selectedAdminType === 'MDA' ? true : false,
      ...(identificationType === 1
        ? {
            idNumber: formData.get('id_number') * 1,
          }
        : {
            passportNumber: formData.get('passportNumber'),
          }),
    };
    console.log(userData);

    const formErrors = validateForm(userData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      // setIsLoading(false);
      return;
    }

    try {
      const res = await AuthApiService.post(authEndpoints.register, userData);
      console.log(res.data);
      if (res.data.isSuccess === true) {
        setAlert({
          open: true,
          message: 'User added successfully',
          severity: 'success',
        });
        event.target.reset();

        setOpenBaseCard(false);
        // router.push("/pensions/users");
      } else if (res.data.isSuccess === false && res.data.message !== null) {
        message.error(res.data.message);
      } else {
        message.error('An error occurred. Please try again.');
      }
    } catch (error) {
      console.log(error.response);

      if (error.response) {
        console.log('Error Response:', error.response);

        if (error.response.status === 400 && error.response.data.message) {
          message.error(error.response.data.message);
        } else if (error.response.data.errors) {
          const validationErrors = error.response.data.errors;
          const errorMessages = [];

          for (const field in validationErrors) {
            if (validationErrors.hasOwnProperty(field)) {
              errorMessages.push(
                `${field}: ${validationErrors[field].join(', ')}`
              );
            }
          }

          // Display all validation errors as a single message
          message.error(errorMessages.join(' | '));
        } else if (error.response.data.title) {
          // Display the general error message
          message.error(error.response.data.title);
        } else {
          message.error('An error occurred. Please try again.');
        }
      } else {
        message.error('An error occurred. Please try again.');
      }
    } finally {
    }
  };

  const [departments, setDepartments] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [mdas, setMDAs] = useState([]); // State to store MDA options
  const [identificationType, setIdentificationType] = useState(1);

  const fetchRoles = async () => {
    try {
      const res = await apiService.get(endpoints.getRoles);
      if (res.status === 200) {
        setRolesList(res.data.data);
      }
      console.log('roles', res.data.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await apiService.get(endpoints.getDepartments, {
        'paging.pageNumber': 1,
        'paging.pageSize': 200,
      });
      setDepartments(res.data.data);

      console.log('departments', res.data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchMDAs = async () => {
    try {
      const res = await apiService.get(endpoints.mdas, {
        'paging.pageNumber': 1,
        'paging.pageSize': 200,
      });
      setMDAs(res.data.data);
      console.log('mdas', res.data.data);
    } catch (error) {
      console.error('Error fetching MDAs:', error);
    }
  };
  const [grades, setGrades] = useState([]);
  const [designations, setDesignations] = useState([]);
  const fetchGrades = async () => {
    try {
      const res = await apiService.get(endpoints.getAllGrades, {
        'paging.pageSize': 1000,
      });
      if (res.status === 200) {
        setGrades(
          res.data.data.map((item, index) => ({ ...item, no: index + 1 }))
        );

        console.log(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };

  const fetchDesignations = async () => {
    try {
      const res = await apiService.get(endpoints.getDesignations, {
        'paging.pageSize': 1000,
      });
      setDesignations(res.data.data);
    } catch (error) {
      console.error('Error fetching Designations:', error);
    }
  };

  useEffect(() => {
    fetchDesignations();
    fetchGrades();
    fetchDepartments();
    fetchRoles();
    fetchMDAs(); // Fetch MDA options on component mount
  }, []);

  return (
    <div className="px-2 pb-6 mt-1 h-[75vh] grid grid-cols-12 gap-2 ">
      <div className="col-span-12 bg-white  rounded-2xl px-4 max-h-[95vh] overflow-y-auto">
        <div className="px-6">
          <form id="new-user-form" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between p-2 mb-3 sticky top-0 bg-white">
              <div className="flex items-center gap-2">
                <h5 className="text-xl font-semibold ml-4 text-primary"></h5>
              </div>
              <div className="flex gap-8 mr-4">
                <button onClick={() => setOpenDialog(true)}></button>
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
                    className="border bg-white border-gray-300 rounded-md p-2 text-sm w-full"
                    required
                  >
                    <option value="">Select User Type</option>

                    <option value="MDA">MDA</option>
                    <option value="Treasury">Treasury</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            {selectedAdminType && (
              <>
                {selectedAdminType === 'MDA' && (
                  <div className="pb-4 mb-2">
                    <div className="mb-4 flex items-center gap-2">
                      <h6 className="font-semibold text-primary text-sm">
                        MDA
                      </h6>
                      <hr className="flex-grow border-blue-500 border-opacity-20" />
                    </div>
                    <Autocomplete
                      options={mdas.sort(
                        (a, b) =>
                          -b.pensionCap.name.localeCompare(a.pensionCap.name)
                      )}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, newValue) => {
                        setSelectedMDA(newValue.id);
                      }}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{ width: '93%' }}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      )}
                      value={
                        mdas.find((option) => option.id === selectedMDA) || null
                      }
                      renderOption={(props, option, { selected }) => (
                        <div className="">
                          <li
                            {...props}
                            style={{
                              border: 'none',
                              boxShadow: 'none',
                              backgroundColor: selected ? '#B2E9ED' : 'white',
                            }}
                          >
                            <Box
                              sx={{
                                width: '100%',
                                pr: '40px',

                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  gap: 2,
                                }}
                              >
                                {' '}
                                <p
                                  className=" text-primary font-normal text-[12px] items-start"
                                  style={{ alignSelf: 'flex-start' }}
                                >
                                  {option.pensionCap.name}
                                </p>
                                <p
                                  className="text-[12px] items-center"
                                  style={{ alignSelf: 'flex-center' }}
                                >
                                  {option.name}
                                </p>
                              </Box>
                            </Box>
                          </li>
                        </div>
                      )}
                      ListboxProps={{
                        sx: {
                          padding: 0,
                          '& ul': {
                            padding: 0,
                            margin: 0,
                          },
                          // Additional styling for the listbox
                        },
                      }}
                      PopperComponent={(props) => (
                        <Popper {...props}>
                          {/* Header */}
                          <li className="flex items-center gap-[65px] px-3 py-2 bg-gray-100">
                            <p className="text-xs font-normal">Pension Cap</p>
                            <p className="text-xs font-normal">MDA Name</p>
                          </li>

                          {props.children}
                        </Popper>
                      )}
                    />
                  </div>
                )}
                {(selectedAdminType === 'Treasury' ||
                  selectedAdminType === 'other') && (
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
                            className="border border-gray-300 text-gray-600 rounded-md p-2 text-sm bg-white "
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
                            className="border border-gray-300 text-gray-600 rounded-md p-2 text-sm bg-white"
                            required
                          >
                            <option value="">Select Role</option>
                            {rolesList
                              .filter(
                                (role) =>
                                  role.departmentID === selectedDepartment
                              )
                              .map((role) => (
                                <option key={role.roleId} value={role.roleId}>
                                  {role.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-evenly w-1/3 px-5 pr-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                            Is Department Head
                            <div className="text-red-600 text-base mt-[3px]">
                              *
                            </div>
                          </label>
                          <select
                            name="is_department_head"
                            value={formData.is_department_head}
                            onChange={(e) =>
                              setFormData((prevFormData) => ({
                                ...prevFormData,
                                is_department_head: e.target.value === 'true',
                              }))
                            }
                            className="border border-gray-300 text-gray-600 rounded-md p-2 text-sm bg-white"
                            required
                          >
                            <option value="">Select Option</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
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
                  <div className="px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
                      <div className="flex flex-col mt-2">
                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                          Employee Number
                          <div className="text-red-600 text-base mt-[3px]"></div>
                        </label>
                        <input
                          onChange={handleInputChange}
                          type="text"
                          name="employeeNumber"
                          className={`border bg-white border-gray-300 rounded-md p-2 text-sm w-full ${
                            errors.employeeNumber ? 'input-error' : ''
                          }`}
                          required
                        />
                        {errors.employeeNumber && (
                          <div className="text-red-600 text-sm mt-[1px]">
                            {errors.employeeNumber}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                          First Name
                          <div className="text-red-600 text-base mt-[3px]">
                            *
                          </div>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          className={`border bg-white border-gray-300 rounded-md p-2 text-sm w-full ${
                            errors.firstName ? 'input-error' : ''
                          }`}
                          required
                          onChange={handleInputChange}
                        />
                        {errors.firstName && (
                          <div className="text-red-600 text-[12px] mt-[1px]">
                            {errors.firstName}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                          Surname
                          <div className="text-red-600 text-base mt-[3px]">
                            *
                          </div>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          className={`border bg-white border-gray-300 rounded-md p-2 text-sm w-full ${
                            errors.lastName ? 'input-error' : ''
                          }`}
                          required
                          onChange={handleInputChange}
                        />
                        {errors.lastName && (
                          <div className="text-red-600 text-[12px] mt-[1px]">
                            {errors.lastName}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col mb-2 ">
                        <label className="text-xs font-semibold text-gray-600 ">
                          Other Name
                        </label>
                        <input
                          type="text"
                          name="middleName"
                          className={`border bg-white border-gray-300 rounded-md p-2 text-sm w-full ${
                            errors.middleName ? 'input-error' : ''
                          }`}
                          onChange={handleInputChange}
                        />
                        {errors.middleName && (
                          <div className="text-red-600 text-[12px] mt-[1px]">
                            {errors.middleName}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col mb-2">
                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                          Choose Identification Type
                        </label>
                        <select
                          name="role"
                          value={identificationType}
                          onChange={(e) => {
                            setIdentificationType(parseInt(e.target.value));
                            console.log(identificationType);
                          }}
                          className="border border-gray-300 text-gray-600 rounded-md p-2 text-sm bg-white"
                          required
                        >
                          <option value={1}>National Id</option>
                          <option value={2}>Passport Number</option>
                        </select>
                      </div>

                      {identificationType === 1 ? (
                        <div className="flex flex-col mt-[-12px]">
                          <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                            Id Number
                            <div className="text-red-600 text-base ">*</div>
                          </label>
                          <input
                            type="text"
                            name="id_number"
                            className={`border bg-white border-gray-300 rounded-md p-2 text-sm w-full ${
                              errors.id_number ? 'input-error' : ''
                            }`}
                            required
                            onChange={handleInputChange}
                          />
                          {errors.id_number && (
                            <div className="text-red-600 text-[12px] mt-[1px]">
                              {errors.id_number}
                            </div>
                          )}
                        </div>
                      ) : identificationType === 2 ? (
                        <div className="flex flex-col mt-[-12px]">
                          <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                            Passport Number
                            <div className="text-red-600 text-base mt-[3px]">
                              *
                            </div>
                          </label>
                          <input
                            type="text"
                            name="passportNumber"
                            className={`border bg-white border-gray-300 rounded-md p-2 text-sm w-full ${
                              errors.passportNumber ? 'input-error' : ''
                            }`}
                            required
                            onChange={handleInputChange}
                          />
                          {errors.passportNumber && (
                            <div className="text-red-600 text-[12px] mt-[1px]">
                              {errors.passportNumber}
                            </div>
                          )}
                        </div>
                      ) : (
                        <></>
                      )}

                      <div className="flex flex-col mt-[-15px]">
                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                          Designation
                        </label>
                        <select
                          name="designation"
                          value={designationId}
                          onChange={(e) => setDesignationId(e.target.value)}
                          className="border bg-white border-gray-300 rounded-md p-2 text-sm w-full"
                        >
                          {' '}
                          <option value="">--------------</option>
                          {designations

                            .filter(
                              (designation) =>
                                designation.mda_id === selectedMDA
                            )
                            .map((designation) => (
                              <>
                                <option
                                  key={designation.id}
                                  value={designation.id}
                                >
                                  {designation.name}
                                </option>
                              </>
                            ))}{' '}
                        </select>
                      </div>
                      <div className="flex flex-col mt-[-15px]">
                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                          Grade
                        </label>
                        <select
                          name="grade"
                          value={gradeId}
                          onChange={(e) => setGradeId(e.target.value)}
                          className="border bg-white border-gray-300 rounded-md p-2 text-sm w-full"
                        >
                          <option value="">----------------</option>
                          {designations
                            .filter((d) => d.id === designationId)
                            .flatMap((designation) => designation.grades)
                            .map((grade) => (
                              <>
                                <option key={grade.id} value={grade.id}>
                                  {grade.grade}
                                </option>
                              </>
                            ))}
                        </select>
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
                  <div className="flex gap-4 px-4">
                    <div className="flex justify-evenly w-1/3 pl-4 pr-5 ml-1">
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
                          className={`border bg-white border-gray-300 rounded-md p-2 text-sm w-full ${
                            errors.email ? 'input-error' : ''
                          }`}
                          required
                          onChange={handleInputChange}
                        />
                        {errors.email && (
                          <div className="text-red-600 text-[12px] mt-[1px]">
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-evenly w-1/3 pl-2 pr-7">
                      <div className="flex flex-col flex-1">
                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-[4px]">
                          Phone Number
                          <div className="text-red-600 text-base mt-[3px]">
                            *
                          </div>
                        </label>

                        <MuiPhoneNumber
                          defaultCountry="ke" // Kenya as the default country
                          name="phoneNumber"
                          onChange={(value) =>
                            handleInputChange({
                              target: { name: 'phoneNumber', value },
                            })
                          }
                          error={errors.phoneNumber}
                          helperText={errors.phoneNumber}
                          variant="outlined"
                          size="small"
                          fullWidth
                          dropdownClass="custom-dropdown" // Custom class for the dropdown
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: '120px', // Set max height for the dropdown
                                overflowY: 'auto',
                              },
                            },
                            anchorOrigin: {
                              vertical: 'bottom',
                              horizontal: 'left',
                            },
                            transformOrigin: {
                              vertical: 'top',
                              horizontal: 'left',
                            },
                          }}
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
          sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}
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
