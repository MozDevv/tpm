"use client";
import React, { useEffect } from "react";
import { Box, Grid } from "@mui/material";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { useIsLoading } from "@/context/LoadingContext";

function PensionCaps() {
  const [rowData, setRowData] = React.useState([]);

  const fetchPensionCaps = async () => {
    try {
      const res = await apiService.get(endpoints.pensionCaps);
      if (res.status === 200) {
        setRowData(res.data.data);
        console.log(res.data.data);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    fetchPensionCaps();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="p-3">
      <h3 className="text-24 mt-2 text-primary font-semibold">Pension Caps</h3>
      <h6 className="text-gray-500 text-sm mt-2 mb-5">
        List of pension caps with details.
      </h6>
      <Box sx={{ flexGrow: 1, mt: 2 }}>
        <Grid container spacing={2}>
          {rowData?.map((row) => (
            <Grid item xs={12} sm={6} md={3} mb={1} key={row.id}>
              <div className="bg-white p-4 rounded-md shadow-md flex flex-col gap-3 items-center justify-center">
                <p className="font-semibold text-base pt-2">{row?.name}</p>
                <p className="text-gray-500 font-normal text-xs">
                  {row?.description}
                </p>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default PensionCaps;
