"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";
import NewUserCard from "@/components/pensionsComponents/recordCard/NewUserCard";
import { Alert } from "@mui/material";

const Page = () => {
  return (
    <div>
      <NewUserCard />
    </div>
  );
};

Page.propTypes = {
  // Define your prop types here
};

export default Page;
