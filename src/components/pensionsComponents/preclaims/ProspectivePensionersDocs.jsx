import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  List,
  ListItem,
} from "@mui/material";

function ProspectivePensionersDocs() {
  const steps = ["Id.pdf", "GP178.pdf", "BankDetails.pdf"];
  const activeStepIndex = 0; // Set the active step index here

  return (
    <Box p={1} sx={{ width: "100%", mt: 2, pl: 3 }}>
      <Typography variant="h6" sx={{ color: "primary.main" }} mb={1}>
        Submitted Documents
      </Typography>

      <List sx={{ display: "flex", gap: "5px", flexDirection: "column" }}>
        {steps.map((step, index) => (
          <ListItem key={index} sx={{ pl: 3 }}>
            <p className="text-sm text-gray-700 text-medium underline">
              {step}
            </p>
          </ListItem>
        ))}
      </List>

      {/** 
      <Stepper
        sx={{ pl: 3 }}
        orientation="vertical"
        pt={0}
        activeStep={activeStepIndex}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>
              <Typography sx={{ textDecoration: "underline" }} fontSize={12}>
                {step}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>*/}
    </Box>
  );
}

export default ProspectivePensionersDocs;
