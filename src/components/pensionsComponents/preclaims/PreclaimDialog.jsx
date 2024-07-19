"use client";
import { useIsLoading } from "@/context/LoadingContext";
import {
  ArrowBack,
  AssignmentOutlined,
  Edit,
  IosShare,
  KeyboardArrowDown,
  KeyboardArrowRight,
  Launch,
  OpenInFull,
} from "@mui/icons-material";
import { Dialog, Divider, TextField } from "@mui/material";
import React, { useState } from "react";
import ProspectivePensionersDocs from "./ProspectivePensionersDocs";
import { IconButton, Button, Collapse, MenuItem, Tooltip } from "@mui/material";
import {
  Add,
  DeleteOutlineOutlined,
  FilterAlt,
  ForwardToInbox,
} from "@mui/icons-material";
import "./ag-theme.css";
import CreateClaim from "../approvals/CreateClaim";
import CreateWorkHistory from "./CreateWorkHistory";
import SendForApproval from "./SendForApproval";
import { notification } from "antd";
import RecordCard from "../recordCard/RecordCard";
import UserDetailCard from "../recordCard/UserDetailCard";
import { useRouter } from "next/navigation";
import PensionerDetailSummary from "./PensionerDetailSummary";

function PreclaimDialog({
  setOpenNotification,
  openPreclaimDialog,
  setOpenPreclaimDialog,
  fetchAllPreclaims,
  permissions,
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
          label: "Personal Number",
          name: "personal_number",
          type: "text",
          value: clickedItem?.personal_number,
        },
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
          label: "Employment Confirmation Date",
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
        {
          label: "Pension Commencement Date",
          name: "pension_commencement_date",
          type: "date",
        },

        {
          label: "Gender",
          name: "gender",
          type: "select",
          value: clickedItem?.gender === 0 ? "Male" : "Female",
        },

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
          value: clickedItem?.retirement_date
            ? new Date(clickedItem?.retirement_date).toISOString().split("T")[0]
            : "",
        },
        {
          label: "Date of Which Pension will Commence/Date Of Death ",
          name: "date_from_which_pension_will_commence",
          type: "date",
          value: clickedItem?.date_from_which_pension_will_commence
            ? new Date(clickedItem?.date_from_which_pension_will_commence)
                .toISOString()
                .split("T")[0]
            : "",
        },
        {
          label: "Authority of retirement Ref No.",
          name: "authority_for_retirement_reference",
          type: "text",
          value: clickedItem?.authority_for_retirement_reference,
        },
        {
          label: "Authority of retirement Date",
          name: "authority_for_retirement_dated",
          type: "date",
          value: clickedItem?.authority_for_retirement_dated
            ? new Date(clickedItem?.authority_for_retirement_dated)
                .toISOString()
                .split("T")[0]
            : "",
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
          label: "Postal Address",
          name: "postal_address",
          type: "text",
          value: clickedItem?.postal_address,
        },
        {
          label: "Phone Number",
          name: "phone_number",
          type: "text",
          value: clickedItem?.phone_number,
        },
        {
          label: "Country",
          name: "country",
          type: "text",
          value: "Kenya",
        },
        {
          label: "City/Town",
          name: "city",
          type: "text",
          value: clickedItem?.city_town,
        },
      ],
    },
    {
      title: "Bank Details",
      state: useState(true),
      fields: [
        {
          label: "Branch name",
          placeholder: "",
          type: "text",
          value: clickedItem?.branch_name,
        },
        {
          label: "Branch Code",
          placeholder: "",
          type: "text",
          value: clickedItem?.branch_code,
        },
        {
          label: "Bank code",
          placeholder: "",
          type: "text",
          value: clickedItem?.bank_code,
        },
        {
          label: "Bank Name",
          placeholder: "",
          type: "text",
          value: clickedItem?.bank_name,
        },
        {
          label: "Account Number",
          placeholder: "",
          type: "text",
          value: clickedItem?.account_number,
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

  const router = useRouter();
  const handleOpenWorkHistory = () => {
    router.push(
      `/pensions/preclaims/listing/new/add-work-history?id=${clickedItem?.id}&name=${clickedItem?.first_name}`
    );
  };

  const handleEdit = () => {
    router.push(`/pensions/preclaims/listing/new?id=${clickedItem?.id}`);
  };
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
        open={openCreateClaim}
        onClose={() => setOpenCreateClaim(false)}
        sx={{
          "& .MuiDialog-paper": {
            height: "300px",
            width: "400px",
          },
          p: 4,
        }}
      >
        {clickedItem?.notification_status === 3 && (
          <SendForApproval
            setOpenPreclaimDialog={setOpenPreclaimDialog}
            setOpenCreateClaim={setOpenCreateClaim}
            clickedItem={clickedItem}
          />
        )}
        {(clickedItem?.notification_status === 5 ||
          clickedItem?.notification_status === 7) && (
          <CreateClaim
            setOpenPreclaimDialog={setOpenPreclaimDialog}
            setOpenCreateClaim={setOpenCreateClaim}
            clickedItem={clickedItem}
          />
        )}
      </Dialog>
      <Dialog
        open={openCreateWorkHistory}
        onClose={() => setOpenCreateWorkHistory(false)}
        sx={{
          "& .MuiDialog-paper": {
            height: "550px",
            width: "500px",
          },
          p: 4,
        }}
      >
        <CreateWorkHistory
          setOpenPreclaimDialog={setOpenPreclaimDialog}
          setOpenCreateWorkHistory={setOpenCreateWorkHistory}
          clickedItem={clickedItem}
        />
      </Dialog>
      <div className="w-full p-2 mt-3 mr-1  grid grid-cols-12 gap-2 overflow-hidden">
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
        <div className="col-span-9 max-h-[100%] overflow-y-auto  bg-white shadow-sm rounded-2xl pb-4">
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
                  {clickedItem?.notification_status === 7 && (
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
                  {clickedItem?.notification_status === 3 && (
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
                        Submit For Approval
                      </p>
                    </Button>
                  )}

                  <Button
                    onClick={handleOpenWorkHistory}
                    sx={{ mb: -1, maxHeight: "25px" }}
                  >
                    <IconButton>
                      <Launch
                        sx={{ fontSize: "18px", mb: "2px" }}
                        color="primary"
                      />
                    </IconButton>
                    <p className="font-normal text-gray -ml-1 text-[13px]">
                      View Work History
                    </p>
                  </Button>
                </div>

                {clickedItem?.notification_status === 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setOpenNotification(true)}
                      sx={{ mb: -1, maxHeight: "24px" }}
                      disabled={
                        !permissions?.includes(
                          "preclaims.notify.prospective_pensioner"
                        )
                      }
                      startIcon={<ForwardToInbox />}
                    >
                      <p className="font-medium text-gray -ml-2 text-sm">
                        Notify Pensioner(s)
                      </p>
                    </Button>
                  </div>
                )}
                {/*
                <div className="flex items-center">
                  {clickedItem?.notification_status !== 7 && (
                    <Button
                      onClick={() => setOpenCreateWorkHistory(true)}
                      sx={{ mb: -1, maxHeight: "25px" }}
                      
                    >
                      <IconButton>
                        <Add sx={{ fontSize: "18px" }} color="primary" />
                      </IconButton>
                      <p className="font-normal text-gray -ml-2 text-[13px]">
                        Add work History
                      </p>
                    </Button>
                  )}
                </div> */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleEdit}
                    disabled={clickedItem?.notification_status !== 0}
                    sx={{ mb: -1, maxHeight: "24px" }}
                    startIcon={<Edit />}
                  >
                    <p className="font-normal text-gray -ml-2 text-[13px]">
                      Edit
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
          <div className="p-6 mt-[-15px] h-full overflow-y-auto">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 p-2 ">
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
                            sx={{
                              fontWeight: 600,
                              "& .MuiInputBase-input.Mui-disabled, & .MuiOutlinedInput-input.Mui-disabled":
                                {
                                  color: "rgba(0, 0, 0, 0.4)", // Darken text color
                                  fontWeight: 600, // Bold text
                                  WebkitTextFillColor: "rgba(0, 0, 0, 0.6)", // Ensures the color is applied in WebKit browsers
                                },
                            }}
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
        <div className="col-span-3 flex flex-col">
          <PensionerDetailSummary clickedItem={clickedItem} />

          <Divider sx={{ mt: 3 }} />
          <ProspectivePensionersDocs clickedItem={clickedItem} />
          {/**   {(clickedItem?.notification_status === 3 ||
            clickedItem?.notification_status === 4 ||
            clickedItem?.notification_status === 5 ||
            clickedItem?.notification_status === 6 ||
            clickedItem?.notification_status === 7) && <></>}*/}
        </div>
      </div>
    </Dialog>
  );
}

export default PreclaimDialog;
