"use client";

import { Box, Drawer, FormControl, TextField, Typography } from "@mui/material";

function AddLeaveDrawer({ openAddLeave, setOpenAddLeave }) {
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenAddLeave(open);
  };
  return (
    <div>
      <Box>
        <Drawer
          anchor="right"
          open={openAddLeave}
          onClose={toggleDrawer(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: 700,
              padding: 6,
            },
          }}
        >
          <Box>
            <Typography variant="h4">Add Leave</Typography>
            <Box
              p={4}
              sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 6 }}
            >
              <FormControl
                sx={{ display: "flex", flexDirection: "row", gap: 4 }}
              >
                <Box width={180}>
                  <Typography fontSize={13} fontWeight={600}>
                    EMPLOYEE NAME{" "}
                  </Typography>
                  <Typography fontSize={11} color="GrayText">
                    Enter Employee Name
                  </Typography>
                </Box>
                <TextField
                  name="employeeName"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                />
              </FormControl>
              <FormControl
                sx={{ display: "flex", flexDirection: "row", gap: 4 }}
              >
                <Box width={180}>
                  <Typography fontSize={13} fontWeight={600}>
                    EMPLOYEE NAME{" "}
                  </Typography>
                  <Typography fontSize={11} color="GrayText">
                    Enter Employee Name
                  </Typography>
                </Box>
                <TextField
                  name="employeeName"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                />
              </FormControl>
              <FormControl
                sx={{ display: "flex", flexDirection: "row", gap: 4 }}
              >
                <Box width={180}>
                  <Typography fontSize={13} fontWeight={600}>
                    EMPLOYEE NAME{" "}
                  </Typography>
                  <Typography fontSize={11} color="GrayText">
                    Enter Employee Name
                  </Typography>
                </Box>
                <TextField
                  name="employeeName"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                />
              </FormControl>
              <FormControl
                sx={{ display: "flex", flexDirection: "row", gap: 4 }}
              >
                <Box width={180}>
                  <Typography fontSize={13} fontWeight={600}>
                    EMPLOYEE NAME{" "}
                  </Typography>
                  <Typography fontSize={11} color="GrayText">
                    Enter Employee Name
                  </Typography>
                </Box>
                <TextField
                  name="employeeName"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                />
              </FormControl>
              <FormControl
                sx={{ display: "flex", flexDirection: "row", gap: 4 }}
              >
                <Box width={180}>
                  <Typography fontSize={13} fontWeight={600}>
                    EMPLOYEE NAME{" "}
                  </Typography>
                  <Typography fontSize={11} color="GrayText">
                    Enter Employee Name
                  </Typography>
                </Box>
                <TextField
                  name="employeeName"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                />
              </FormControl>
              <FormControl
                sx={{ display: "flex", flexDirection: "row", gap: 4 }}
              >
                <Box width={180}>
                  <Typography fontSize={13} fontWeight={600}>
                    EMPLOYEE NAME{" "}
                  </Typography>
                  <Typography fontSize={11} color="GrayText">
                    Enter Employee Name
                  </Typography>
                </Box>
                <TextField
                  name="employeeName"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                />
              </FormControl>
              <FormControl
                sx={{ display: "flex", flexDirection: "row", gap: 4 }}
              >
                <Box width={180}>
                  <Typography fontSize={13} fontWeight={600}>
                    EMPLOYEE NAME{" "}
                  </Typography>
                  <Typography fontSize={11} color="GrayText">
                    Enter Employee Name
                  </Typography>
                </Box>
                <TextField
                  name="employeeName"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                />
              </FormControl>
              <FormControl
                sx={{ display: "flex", flexDirection: "row", gap: 4 }}
              >
                <Box width={180}>
                  <Typography fontSize={13} fontWeight={600}>
                    EMPLOYEE NAME{" "}
                  </Typography>
                  <Typography fontSize={11} color="GrayText">
                    Enter Employee Name
                  </Typography>
                </Box>
                <TextField
                  name="employeeName"
                  variant="outlined"
                  size="small"
                  fullWidth
                  required
                />
              </FormControl>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </div>
  );
}

export default AddLeaveDrawer;
