"use client";
import {
  ArrowBack,
  ArrowBackIos,
  ExpandLess,
  ExpandMore,
  Launch,
  Phone,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Icon,
  IconButton,
} from "@mui/material";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

import UserDetailCard from "./UserDetailCard";
import AssignRole from "../Roles/assignRoles/AssignRole";
import { useAuth } from "@/context/AuthContext";
import { BASE_CORE_API } from "@/utils/constants";

function RecordCard({ id }) {
  const [clickedItem, setClickedItem] = useState(null);
  console.log(id);
  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(
        `https://pmis.agilebiz.co.ke/api/UserManagement/GetUsers?documentID=${id}`
      );

      console.log(res.data.data);
      setClickedItem(res.data.data);

      console.log("clickedItem", res.data.data.roleId);
      const roleName = fetchData(res.data.data.roleId);
      console.log("roleName", roleName);
      // alert(roleName);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleOpenRejectModal = () => {
    setOpenRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setOpenRejectModal(false);
  };

  const handleSubmitRejection = () => {
    console.log("Rejection Reason:", rejectionReason);
    setOpenRejectModal(false);
  };
  const [openBio, setOpenBio] = useState(true);
  const [openOverview, setOpenOverview] = useState(true);
  const [openRole, setOpenRole] = useState(true);
  const [openPermissions, setOpenPermissions] = useState(false);
  const { auth, login, logout } = useAuth();

  const [role, setRole] = useState("");

  const fetchData = async (id) => {
    try {
      const res = await axios.get(`${BASE_CORE_API}GetRoles?documentId=${id}`);
      setRole(res.data.data.name);

      console.log("role", role);
      console.log("res", res.data);

      return res.data.data.name;

      //setRole(res.data.data.name);
    } catch (error) {
      console.log("error", error);
    }
  };

  const [openDialog, setOpenDialog] = useState(false);

  const router = useRouter();
  const handleConfirmDialog = () => {
    router.push("/pensions/users/");
    setOpenDialog(false);
  };
  return (
    <div className="p-2 mt-3 mr-1 h-[75vh] grid grid-cols-12 gap-2">
      <AssignRole
        openPermissions={openPermissions}
        setOpenPermissions={setOpenPermissions}
        userId={id}
      />
      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p className="my-3 text-gray-700 text-base">
              {" "}
              Are you sure you want to cancel and go back to the previous page?
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div className=" w-full flex justify-between px-4 pb-3">
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              color="primary"
            >
              No
            </Button>
            <Button
              onClick={handleConfirmDialog}
              variant="contained"
              color="error"
            >
              Yes
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <div className="col-span-9 bg-white shadow-md rounded-2xl p-4">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <h5 className="text-xl text-black font-semibold">Edit User</h5>
          </div>
          <div className="flex gap-8 mr-4">
            <Button
              startIcon={<Launch />}
              onClick={() => setOpenPermissions(true)}
            >
              View User Permissions
            </Button>
            <button
              className="bg-gray-200 text-primary text-sm font-medium  px-4 py-2 rounded-md"
              onClick={() => setOpenDialog(true)}
            >
              Cancel
            </button>
            <button className="bg-primary text-sm font-medium  text-white px-4 py-2 rounded-md">
              Save Changes
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className=" gap-3 my-3 ">
            {/************ Bio ********************* */}
            <div className=" flex items-center gap-2 ">
              <h6 className="font-semibold text-primary text-sm">Bio</h6>
              <IconButton
                sx={{ ml: "-5px" }}
                onClick={() => setOpenBio((prevOpenBio) => !prevOpenBio)}
              >
                {openBio ? (
                  <ExpandMore
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
            <Collapse in={openBio} timeout="auto" unmountOnExit>
              <div className="flex gap-4  mt-2 p-2">
                <div className="flex flex-col w-1/3">
                  <label className="text-xs font-semibold  text-gray-600">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={clickedItem?.firstName}
                    className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col w-1/3">
                  <label className="text-xs font-semibold text-gray-600">
                    Middle Name
                  </label>
                  <input
                    value={clickedItem?.middleName}
                    type="text"
                    className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col w-1/3">
                  <label className="text-xs font-semibold text-gray-600">
                    Surname
                  </label>
                  <input
                    type="text"
                    value={clickedItem?.lastName}
                    placeholder="National Treasury"
                    className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm"
                    required
                  />
                </div>
              </div>
            </Collapse>
          </div>

          {/************ Overview ********************* */}

          <div className="flex flex-col gap-3 my-3 ">
            <div className="flex items-center gap-1">
              <h6 className="font-semibold text-primary text-sm">Overview</h6>
              <IconButton
                sx={{ ml: "-5px" }}
                onClick={() =>
                  setOpenOverview((prevOpenOverview) => !prevOpenOverview)
                }
              >
                {openOverview ? (
                  <ExpandMore
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
            <Collapse in={openOverview} timeout="auto" unmountOnExit>
              <div className="flex gap-4 p-2">
                <div className="flex flex-col w-1/3">
                  <label className="text-xs font-semibold text-gray-600">
                    Contacts
                  </label>
                  <input
                    value={clickedItem?.phoneNumber}
                    type="text"
                    placeholder="0122 28821 28"
                    className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col w-1/3">
                  <label className="text-xs font-semibold text-gray-600">
                    Email
                  </label>
                  <input
                    value={clickedItem?.email}
                    type="text"
                    placeholder="123@io.com"
                    className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col w-1/3">
                  <label className="text-xs font-semibold text-gray-600">
                    Department
                  </label>
                  <input
                    value={clickedItem?.department?.name}
                    type="text"
                    placeholder="National Treasury"
                    className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm"
                    required
                  />
                </div>
              </div>
            </Collapse>
          </div>
          {/************ Role ********************* */}
          <div className=" flex flex-col gap-3 my-3 ">
            <div className="flex  items-center ">
              <h6 className="font-semibold text-primary text-sm">Role</h6>
              <IconButton
                sx={{ ml: "-5px" }}
                onClick={() => setOpenRole((prevOpenRole) => !prevOpenRole)}
              >
                {openRole ? (
                  <ExpandMore
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
            <Collapse in={openRole} timeout="auto" unmountOnExit>
              <div className="flex gap-4  p-2 ">
                <div className="flex flex-col w-1/3">
                  <label className="text-xs  font-semibold text-gray-600">
                    Employee Numer
                  </label>
                  <input
                    type="text"
                    value={clickedItem?.employeeNumber}
                    //placeholder="Policy"
                    className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col w-1/3">
                  <label className="text-xs font-semibold text-gray-600">
                    Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    placeholder="MDA HRM"
                    className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm"
                    required
                  />
                </div>
              </div>{" "}
            </Collapse>
          </div>
        </div>
      </div>
      <div className="col-span-3 bg-white shadow-md rounded-2xl p-4 ml-3 mr-1">
        <UserDetailCard clickedItem={clickedItem} />
      </div>
    </div>
  );
}

export default RecordCard;
