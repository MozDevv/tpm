import React from "react";
import { Stepper, Step, StepLabel, Typography, Box } from "@mui/material";

function BaseWorkFlow({ steps, activeStep }) {
  return (
    <Box p={1} sx={{ width: "100%" }}>
      <p className="py-2 text-primary text-base font-semibold font-montserrat mb-5">
        Document Workflows
      </p>
      <Stepper orientation="vertical" pt={0} activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel
              sx={{
                color: index > activeStep ? "gray" : "inherit", // Grays out steps after activeStep
              }}
            >
              <Typography
                sx={{
                  textDecoration: index > activeStep ? "none" : "underline",
                  color: index > activeStep ? "gray" : "inherit", // Grays out text after activeStep
                }}
                fontSize={12}
              >
                {step}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default BaseWorkFlow;
