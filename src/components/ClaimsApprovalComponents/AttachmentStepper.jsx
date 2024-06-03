import React from "react";
import { Stepper, Step, StepLabel, Typography, Box } from "@mui/material";

function AttachmentStepper() {
  const steps = ["Claim.pdf", "Payment Voucher.pdf", "Invoice", "Receipt"];
  const activeStepIndex = 0; // Set the active step index here

  return (
    <Box p={1} sx={{ width: "100%" }}>
      <Typography variant="h6">Attachments</Typography>
      <Stepper orientation="vertical" pt={0} activeStep={activeStepIndex}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>
              <Typography sx={{ textDecoration: "underline" }} fontSize={12}>
                {step}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default AttachmentStepper;
