import React from "react";
import { Stepper, Step, StepLabel, Typography, Box } from "@mui/material";

function WorkflowStepper() {
  const steps = [
    { label: "Claims Initiation", description: "John Doe" },
    { label: "Claim Approval", description: "John Doe" },
    { label: "Claims Review", description: "John Doe" },
  ];

  const activeStepIndex = 1; // Set the active step index here

  return (
    <Box p={1} sx={{ width: "100%" }}>
      <Typography mb={1} variant="h6">
        Workflow
      </Typography>
      <Stepper orientation="vertical" activeStep={activeStepIndex}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>
              <Typography variant="h6" fontSize={13}>
                {step.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "gray", fontSize: "12px" }}
              >
                {step.description}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default WorkflowStepper;
