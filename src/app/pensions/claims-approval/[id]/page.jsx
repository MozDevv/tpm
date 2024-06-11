"use client";
import { DummyData } from "@/components/ClaimsApprovalComponents/DummyData";
import ReviewDocument from "@/components/ClaimsApprovalComponents/ReviewDocument";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";

import React, { useState } from "react";

function SelectedRow() {
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const id = searchParams.get("id") || pathName.split("/").pop();

  const [dummyData, setDummyData] = useState(DummyData);

  const data = dummyData.find((data) => data.id === id);
  console.log(data, id);
  return (
    <div>
      <Box>
        <Box>
          <Typography variant="h3" mt={2} ml={1}>
            Review Document
          </Typography>
        </Box>
        <ReviewDocument data={data} />
      </Box>
    </div>
  );
}

export default SelectedRow;
