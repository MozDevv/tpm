"use client";
import { ExpandLess, KeyboardArrowRight } from "@mui/icons-material";
import { Collapse, IconButton } from "@mui/material";
import React, { useState } from "react";

import Attachments from "./Attachments";

function DataCapture() {
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

  const sections = [
    {
      title: "General Information",
      state: useState(true),
      fields: [
        {
          label: "Claim ID",
          placeholder: "Autogenerated",
          type: "text",
          readOnly: true,
        },

        { label: "MDA Code", placeholder: "", type: "text" },
        { label: "Personal Number", placeholder: "", type: "text" },
        { label: "First Name", placeholder: "", type: "text" },
        { label: "Middle Name", placeholder: "", type: "text" },
        { label: "Other Name", placeholder: "", type: "text" },
        {
          label: "Gender",
          placeholder: "",
          type: "select",
          options: ["Male", "Female"],
        },
        { label: "County", placeholder: "", type: "text" },
        { label: "Constituency", placeholder: "", type: "text" },
        { label: "Location", placeholder: "", type: "text" },
      ],
    },
    {
      title: "Contact Details",
      state: useState(true),
      fields: [
        { label: "Phone Number", placeholder: "", type: "text" },
        { label: "Email Address", placeholder: "", type: "email" },
        { label: "Postal Address", placeholder: "", type: "text" },
      ],
    },
    {
      title: "Next Of Kin Details",
      state: useState(true),
      fields: [
        { label: "Type of Identification", placeholder: "", type: "text" },
        { label: "Identification Number", placeholder: "", type: "text" },
        { label: "First Name", placeholder: "", type: "text" },
        { label: "Middle Name", placeholder: "", type: "text" },
        { label: "Other Name", placeholder: "", type: "text" },
        { label: "Date of Birth", placeholder: "", type: "date" },
        { label: "Contact Details", placeholder: "", type: "text" },
        { label: "Type of Next of Kin", placeholder: "", type: "text" },
      ],
    },
    {
      title: "Guardianship Details",
      state: useState(true),
      fields: [
        { label: "Type of Identification", placeholder: "", type: "text" },
        { label: "ID Number", placeholder: "", type: "text" },
        { label: "First Name", placeholder: "", type: "text" },
        { label: "Middle Name", placeholder: "", type: "text" },
        { label: "Other Name", placeholder: "", type: "text" },
        { label: "Date of Birth", placeholder: "", type: "date" },
        { label: "Contact Details", placeholder: "", type: "text" },
        { label: "Type of Next of Kin", placeholder: "", type: "text" },
        { label: "Relationship", placeholder: "", type: "text" },
        { label: "Phone Number", placeholder: "", type: "text" },
        { label: "Email Address", placeholder: "", type: "email" },
        { label: "Postal Address", placeholder: "", type: "text" },
        { label: "Bank Details", placeholder: "", type: "text" },
        { label: "KRA Pin", placeholder: "", type: "text" },
      ],
    },
    {
      title: "Work History",
      state: useState(true),
      fields: [
        { label: "Employment From", placeholder: "", type: "date" },
        { label: "Employment To", placeholder: "", type: "date" },
        {
          label: "Type of Employment",
          placeholder: "Temporary, Contract, Permanent",
          type: "text",
        },
        { label: "Employer No.", placeholder: "", type: "text" },
        { label: "Employer Name", placeholder: "", type: "text" },
        { label: "Section/Place Deployed", placeholder: "", type: "text" },
      ],
    },
    {
      title: "Documents",
      state: useState(true),
      fields: [{ label: "Documents", placeholder: "", type: "file" }],
    },
    {
      title: "Retiree Payment Method",
      state: useState(true),
      fields: [
        { label: "Bank Branch Name", placeholder: "", type: "text" },
        { label: "Bank Code", placeholder: "", type: "text" },
        { label: "Bank Name", placeholder: "", type: "text" },
        { label: "Account Number", placeholder: "", type: "text" },
      ],
    },
  ];

  return (
    <div className="p-2 mt-3 mr-1 h-[75vh]  grid grid-cols-12 gap-2">
      <div className="col-span-9 max-h-[100%] overflow-y-auto bg-white shadow-sm rounded-2xl pb-4">
        <div className="pt-6  sticky top-0  bg-inherit z-50 pb-2">
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <h5 className="text-[17px] text-primary font-semibold">
                User Information
              </h5>
            </div>
            <div className="flex gap-8 mr-4">
              <button
                className="bg-gray-200 text-primary text-sm font-medium  px-4 py-2 rounded-md"
                onClick={handleOpenRejectModal}
              >
                Cancel
              </button>
              <button className="bg-primary text-sm font-medium  text-white px-4 py-2 rounded-md">
                Save Changes
              </button>
            </div>
          </div>{" "}
          <hr className="border-[1px] border-black-900 my-2 " />
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
                      <ExpandLess
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
                        {field.type === "select" ? (
                          <select
                            className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm"
                            required
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map((option, optionIndex) => (
                              <option key={optionIndex} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            //   placeholder={field.placeholder}
                            className="border bg-gray-100 border-gray-300 rounded-md p-2 text-sm"
                            required
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </Collapse>
              </div>
            );
          })}
        </div>
      </div>
      <div className="col-span-3 bg-white shadow-sm rounded-2xl p-4 ml-3 mr-1">
        <Attachments />
      </div>
    </div>
  );
}

export default DataCapture;
