"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  TextField,
  Typography,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import WorkflowStepper from "./WorkflowStepper";
import AttachmentStepper from "./AttachmentStepper";

function ReviewDocument({ data }) {
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

  return (
    <div>
      <Grid sx={{ height: "80vh", p: 2, mt: 3 }} container spacing={2}>
        <Grid
          item
          xs={8.5}
          sx={{
            backgroundColor: "#fff",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            backgroundColor: "white",
            borderRadius: "20px",
            height: "100%",
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
            }}
          >
            <Typography variant="h5">Review Application</Typography>
            <Box sx={{ display: "flex", gap: "30px", mr: 1 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#e6e8ea", color: "black" }}
                onClick={handleOpenRejectModal}
              >
                Reject
              </Button>
              <Button variant="contained" color="primary">
                Approve
              </Button>
            </Box>
          </Box>
          <Box p={3}>
            <Box pb={2}>
              <Box
                mb={2}
                sx={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <Typography fontWeight={600}>Bio</Typography>
                <Divider
                  sx={{
                    mt: "2px",
                    borderColor: "primary.main",
                    flexGrow: 1,
                    borderBottomWidth: "2px",
                    opacity: 0.2,
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                <FormControl>
                  <FormLabel
                    sx={{ fontSize: "11px", color: "gray", fontWeight: 600 }}
                  >
                    Name
                  </FormLabel>
                  <TextField
                    name="firstName"
                    variant="outlined"
                    placeholder={data.sender}
                    size="small"
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel
                    sx={{ fontSize: "11px", color: "gray", fontWeight: 600 }}
                  >
                    ID Number
                  </FormLabel>
                  <TextField
                    name="id"
                    variant="outlined"
                    placeholder={data.no}
                    size="small"
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel
                    sx={{ fontSize: "11px", color: "gray", fontWeight: 600 }}
                  >
                    Org Name
                  </FormLabel>
                  <TextField
                    name="firstName"
                    variant="outlined"
                    placeholder="National Treasury"
                    size="small"
                    required
                  />
                </FormControl>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
              <Box
                my={2}
                sx={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <Typography fontWeight={600}>Overview</Typography>
                <Divider
                  sx={{
                    mt: "2px",
                    borderColor: "primary.main",
                    flexGrow: 1,
                    borderBottomWidth: "2px",
                    opacity: 0.2,
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                <FormControl>
                  <FormLabel
                    sx={{ fontSize: "11px", color: "gray", fontWeight: 600 }}
                  >
                    Contacts
                  </FormLabel>
                  <TextField
                    name="contacts"
                    variant="outlined"
                    placeholder="0122 28821 28"
                    size="small"
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel
                    sx={{ fontSize: "11px", color: "gray", fontWeight: 600 }}
                  >
                    Email
                  </FormLabel>
                  <TextField
                    name="email"
                    variant="outlined"
                    placeholder="123@io.com"
                    size="small"
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel
                    sx={{ fontSize: "11px", color: "gray", fontWeight: 600 }}
                  >
                    Org Name
                  </FormLabel>
                  <TextField
                    name="firstName"
                    variant="outlined"
                    placeholder="National Treasury"
                    size="small"
                    required
                  />
                </FormControl>
              </Box>
            </Box>
            <Box
              my={3}
              sx={{ display: "flex", gap: 2, flexDirection: "column" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  mb: 2,
                }}
              >
                <Typography fontWeight={600}>Claim Request</Typography>
                <Divider
                  sx={{
                    mt: "2px",
                    borderColor: "primary.main",
                    flexGrow: 1,
                    borderBottomWidth: "2px",
                    opacity: 0.2,
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                <FormControl>
                  <FormLabel
                    sx={{ fontSize: "11px", color: "gray", fontWeight: 600 }}
                  >
                    Claim Type
                  </FormLabel>
                  <TextField
                    name="contacts"
                    variant="outlined"
                    placeholder="Policy"
                    size="small"
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel
                    sx={{ fontSize: "11px", color: "gray", fontWeight: 600 }}
                  >
                    Sum Ammount
                  </FormLabel>
                  <TextField
                    name="email"
                    variant="outlined"
                    placeholder="2212332"
                    size="small"
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel
                    sx={{ fontSize: "11px", color: "gray", fontWeight: 600 }}
                  >
                    Sum Ammount
                  </FormLabel>
                  <TextField
                    name="email"
                    variant="outlined"
                    placeholder=""
                    size="small"
                    required
                  />
                </FormControl>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            backgroundColor: "#fff",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            backgroundColor: "white",
            borderRadius: "20px",
            height: "100%",
            ml: 3,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <AttachmentStepper />
            <Divider />
            <WorkflowStepper />
          </Box>
        </Grid>
      </Grid>

      {/* Rejection Modal */}
      <Modal
        open={openRejectModal}
        onClose={handleCloseRejectModal}
        closeAfterTransition
      >
        <Fade in={openRejectModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 5,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2">
              Reason for Rejection
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitRejection}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseRejectModal}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default ReviewDocument;
