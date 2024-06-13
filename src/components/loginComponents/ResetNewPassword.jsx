import { ArrowForward, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

function ResetNewPassword() {
  const [errors, setErrors] = useState({
    status: false,
    message: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {" "}
      <FormControl>
        <FormLabel sx={{ fontSize: "13px", fontWeight: "700", color: "gray" }}>
          New Password
        </FormLabel>
        <TextField
          // value={password}
          //  onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: errors.status ? "crimson" : "grey",
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {!showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          type={!showPassword ? "password" : "text"}
          inputProps={{ style: { height: "12px" } }}
          fullWidth
          required
        />
      </FormControl>
      <FormControl>
        <FormLabel sx={{ fontSize: "13px", fontWeight: "700", color: "gray" }}>
          Confirm New Password
        </FormLabel>
        <TextField
          // value={password}
          //  onChange={(e) => setPassword(e.target.value)}
          placeholder="Confirm New Password"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: errors.status ? "crimson" : "grey",
              },
            },
          }}
          inputProps={{ style: { height: "12px" } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {!showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          type={!showPassword ? "password" : "text"}
          fullWidth
          required
        />
      </FormControl>{" "}
      <Button
        fullWidth
        sx={{
          backgroundColor: "primary.main",
          "&:hover": { backgroundColor: "#006990" },
          pl: "20px",
          display: "flex",
          color: "white",
          justifyContent: "space-between",
          textTransform: "none",
          mt: "10px",
        }}
      >
        Reset Password
        <ArrowForward />
      </Button>
    </Box>
  );
}

export default ResetNewPassword;
