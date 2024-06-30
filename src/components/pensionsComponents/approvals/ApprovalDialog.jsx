"use client";
import { useIsLoading } from "@/context/LoadingContext";
import {
  ArrowBack,
  Edit,
  IosShare,
  KeyboardArrowDown,
  KeyboardArrowRight,
  OpenInFull,
} from "@mui/icons-material";
import { Dialog, TextField } from "@mui/material";
import React, { useState } from "react";
import ProspectivePensionersDocs from "../preclaims/ProspectivePensionersDocs";
import { IconButton, Button, Collapse, MenuItem, Tooltip } from "@mui/material";
import {
  Add,
  DeleteOutlineOutlined,
  FilterAlt,
  ForwardToInbox,
} from "@mui/icons-material";
import "./ag-theme.css";

import CreateClaim from "./CreateClaim";

function ApprovalDialog({
  openPreclaimDialog,
  setOpenPreclaimDialog,
  fetchAllPreclaims,
  clickedItem,
}) {
  const { isLoading, setIsLoading } = useIsLoading();
  const [formData, setFormData] = useState({
    surname: "",
    first_name: "",
    other_name: "",
    kra_pin: "",
    date_of_confirmation: "",
    dob: "",
    national_id: "",
    email_address: "",
    phone_number: "",
    gender: "",
    personal_number: "",
    last_basic_salary_amount: "",
    retirement_date: "",
    pension_award_id: "",
    mda_id: "",
  });

  const sections = [
    {
      title: "General Information",
      state: useState(true),
      fields: [
        {
          label: "Surname",
          name: "surname",
          type: "text",
          value: clickedItem?.surname,
        },
        {
          label: "First Name",
          name: "first_name",
          type: "text",
          value: clickedItem?.first_name,
        },
        {
          label: "Other Name",
          name: "other_name",
          type: "text",
          value: clickedItem?.other_name,
        },
        {
          label: "KRA PIN",
          name: "kra_pin",
          type: "text",
          value: clickedItem?.kra_pin,
        },
        {
          label: "Date of Confirmation",
          name: "date_of_confirmation",
          type: "date",

          value: clickedItem?.date_of_confirmation
            ? new Date(clickedItem?.date_of_confirmation)
                .toISOString()
                .split("T")[0]
            : "",
        },
        {
          label: "Date of Birth",
          name: "dob",
          type: "date",

          value: clickedItem?.dob
            ? new Date(clickedItem.dob).toISOString().split("T")[0]
            : "",
        },
        {
          label: "National ID",
          name: "national_id",
          type: "text",
          value: clickedItem?.national_id,
        },
      ],
    },
    {
      title: "Contact Details",
      state: useState(true),
      fields: [
        {
          label: "Email Address",
          name: "email_address",
          type: "email",
          value: clickedItem?.email_address,
        },
        {
          label: "Phone Number",
          name: "phone_number",
          type: "text",
          value: clickedItem?.phone_number,
        },
        {
          label: "Gender",
          name: "gender",
          type: "select",
          value: clickedItem?.gender === 1 ? "Male" : "Female",
        },
        {
          label: "Personal Number",
          name: "personal_number",
          type: "text",
          value: clickedItem?.personal_number,
        },
      ],
    },
    {
      title: "Payment Details",
      state: useState(true),
      fields: [
        {
          label: "Last Basic Salary Amount",
          name: "last_basic_salary_amount",
          type: "number",
          value: clickedItem?.last_basic_salary_amount,
        },
        {
          label: "Retirement Date",
          name: "retirement_date",
          type: "date",
          value: clickedItem?.retirement_date,
        },
        {
          label: "Pension Award ",
          name: "pension_award_id",
          type: "select",
          value: clickedItem?.pensionAward_description,
        },
        {
          label: "MDA",
          name: "mda_id",
          type: "select",
          value: clickedItem?.mda_description,
        },
      ],
    },
  ];

  console.log("clickedItem", clickedItem);

  const [openCreateClaim, setOpenCreateClaim] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const expandSizes = {
    default: {
      minHeight: "55vh",
      maxHeight: "75vh",
      minWidth: "55vw",
      maxWidth: "75vw",
    },
    expanded: {
      minHeight: "95vh",
      maxHeight: "95vh",
      minWidth: "95vw",
      maxWidth: "95vw",
    },
  };
  const currentSize = isExpanded ? expandSizes.expanded : expandSizes.default;

  const [openCreateWorkHistory, setOpenCreateWorkHistory] = useState(false);

  const [disabled, setDisabled] = useState(true);

  return (
    <Dialog
      open={openPreclaimDialog}
      onClose={() => setOpenPreclaimDialog(false)}
      fullWidth
      maxWidth="xl"
      sx={{
        "& .MuiPaper-root": {
          minHeight: currentSize.minHeight,
          maxHeight: currentSize.maxHeight,
          minWidth: currentSize.minWidth,
          maxWidth: currentSize.maxWidth,
        },
      }}
    >
      <Dialog
        open={openCreateClaim && clickedItem?.notification_status === 5}
        onClose={() => setOpenCreateClaim(false)}
        sx={{
          "& .MuiDialog-paper": {
            height: "300px",
            width: "400px",
          },
          p: 4,
        }}
      >
        <CreateClaim
          setOpenPreclaimDialog={setOpenPreclaimDialog}
          setOpenCreateClaim={setOpenCreateClaim}
          clickedItem={clickedItem}
          fetchAllPreclaims={fetchAllPreclaims}
        />
        {/** <CreateClaim
          setOpenPreclaimDialog={setOpenPreclaimDialog}
          setOpenCreateClaim={setOpenCreateClaim}
          clickedItem={clickedItem}
        /> */}
      </Dialog>

      <div className="w-full p-2 mt-3 mr-1 h-[100%] grid grid-cols-12 gap-2">
        <IconButton
          sx={{
            ml: "auto",
            position: "fixed",
            zIndex: 899999999,
            right: 1,
            top: "3px",
          }}
        >
          <Tooltip title="Expand">
            {" "}
            <OpenInFull sx={{ color: "primary.main", fontSize: "18px" }} />
          </Tooltip>{" "}
        </IconButton>
        <div className="col-span-9 max-h-[100%] overflow-y-auto bg-white shadow-sm rounded-2xl pb-4">
          <div className="pt-6 sticky top-0 bg-inherit z-50 pb-2">
            <div className="flex items-center justify-between px-6 w-[100%]">
              <div className="flex items-center">
                <IconButton
                  sx={{
                    border: "1px solid #006990",
                    borderRadius: "50%",
                    padding: "3px",
                    marginRight: "10px",
                    color: "#006990",
                  }}
                  onClick={() => setOpenPreclaimDialog(false)}
                >
                  <ArrowBack sx={{ color: "#006990" }} />
                </IconButton>
                <p className="text-base text-primary font-semibold ">
                  Prospective Pensioner Information
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex items-center">
                  {clickedItem?.notification_status === 5 && (
                    <Button
                      onClick={() => setOpenCreateClaim(true)}
                      sx={{ mb: -1, maxHeight: "25px" }}
                    >
                      <IconButton>
                        <IosShare
                          sx={{ fontSize: "18px", mb: "2px" }}
                          color="primary"
                        />
                      </IconButton>
                      <p className="font-normal text-gray -ml-1 text-[13px]">
                        Create Claim
                      </p>
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setDisabled(false)}
                    sx={{ mb: -1, maxHeight: "24px" }}
                  >
                    <IconButton>
                      <Edit
                        sx={{ fontSize: "18px", mr: "2px" }}
                        color="primary"
                      />
                    </IconButton>
                    <p className="font-normal text-gray -ml-2 text-[13px]">
                      Edit
                    </p>
                  </Button>
                </div>
                <div className="flex items-center">
                  <Button sx={{ mb: -1, maxHeight: "24px" }}>
                    <IconButton>
                      <DeleteOutlineOutlined
                        sx={{ fontSize: "18px" }}
                        color="primary"
                      />
                    </IconButton>
                    <p className="font-normal text-gray -ml-2 text-[13px]">
                      Delete
                    </p>
                  </Button>
                </div>
                <IconButton onClick={() => setIsExpanded(!isExpanded)}>
                  <Tooltip title={isExpanded ? "Shrink" : "Expand"}>
                    <OpenInFull
                      color="primary"
                      sx={{
                        fontSize: "18px",
                        mt: "4px",
                      }}
                    />
                  </Tooltip>
                </IconButton>
              </div>
            </div>
            <hr className="border-[1px] border-black-900 my-2" />
          </div>
          <div className="p-6 mt-[-15px]">
            {sections.map((section, index) => {
              const [open, setOpen] = section.state;
              return (
                <div key={index} className="gap-3 my-3">
                  <div className="flex items-center gap-2">
                    <h6 className="font-semibold text-primary text-sm">
                      {section.title}
                    </h6>
                    <IconButton
                      sx={{ ml: "-5px", zIndex: 1 }}
                      onClick={() => setOpen((prevOpen) => !prevOpen)}
                    >
                      {!open ? (
                        <KeyboardArrowRight
                          sx={{ color: "primary.main", fontSize: "14px" }}
                        />
                      ) : (
                        <KeyboardArrowDown
                          sx={{ color: "primary.main", fontSize: "14px" }}
                        />
                      )}
                    </IconButton>
                    <hr className="flex-grow border-blue-500 border-opacity-20" />
                  </div>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 p-2">
                      {section.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="flex flex-col">
                          <label className="text-xs font-semibold text-gray-600">
                            {field.label}
                          </label>

                          <TextField
                            type={field.type}
                            name={field.name}
                            variant="outlined"
                            size="small"
                            value={field.value}
                            required
                            fullWidth
                            sx={{ fontWeight: 600 }}
                            disabled={disabled}
                          />
                        </div>
                      ))}
                    </div>
                  </Collapse>
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-span-3">
          <ProspectivePensionersDocs />
        </div>
      </div>
    </Dialog>
  );
}

export default ApprovalDialog;
