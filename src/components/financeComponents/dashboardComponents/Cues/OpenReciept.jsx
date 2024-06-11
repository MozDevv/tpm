import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { generateDummyData } from "./colDefsData";

export const colDefsData = [
  { field: "no", label: "No." },
  { field: "date", label: "Date" },
  { field: "paymentNarration", label: "Payment Narration" },
  { field: "paymode", label: "Pay Mode" },
  { field: "checkNumber", label: "Check Number" },
  { field: "recievedFrom", label: "Received From" },
  { field: "createdBy", label: "Created By" },
  { field: "postedBy", label: "Posted By" },
  { field: "postedDate", label: "Posted Date" },
];

function OpenReciept() {
  const dummyData = generateDummyData(1)[0];

  return (
    <div>
      <Box>
        <p className="mt-2 text-xl">DLH 2323</p>
      </Box>
      <Box mt={5}>
        <p className="text-sm font-semibold">General</p>
        <Divider sx={{ height: "5px" }} />
        <form className="flex h-3/5 flex-wrap overflow-auto p-2 pt-3">
          {colDefsData.map((col) => (
            <div
              key={col.field}
              className="mb-4 mt-2 flex w-1/2 flex-row items-center gap-2"
            >
              <div className="text-xs font-medium text-gray-500">
                {col.label}
              </div>
              <div className="flex-1 border-b-2 border-dotted border-gray-300"></div>
              <TextField
                type="text"
                sx={{ mr: 4 }}
                inputProps={{
                  placeholder: dummyData[col.field],
                  sx: {
                    width: "170px",
                    maxHeight: "15px",
                    p: 1,
                    backgroundColor: "#f4f4f6",
                    borderRadius: 0,
                    "::placeholder": {
                      fontSize: "10px",
                      fontWeight: 500,
                      color: "black",
                    },
                  },
                }}
                variant="outlined"
              />
            </div>
          ))}
        </form>
      </Box>
    </div>
  );
}

export default OpenReciept;
