"use client";

import endpoints, { apiService } from "@/components/services/setupsApi";
import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";

function TermsOfService() {
  const [termsOfService, setTermsOfService] = useState([]); // [1
  const getTermsOfService = async () => {
    try {
      const response = await apiService.get(endpoints.termsOfService);

      console.log("response", response.data.data);

      setTermsOfService(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTermsOfService();
  }, []);

  return (
    <div className="p-3">
      <h3 className="text-24 mt-2 text-primary font-semibold">Pension Caps</h3>
      <h6 className="text-gray-500 text-sm mt-2 mb-5">
        List of pension caps with details.
      </h6>
      <Box sx={{ flexGrow: 1, mt: 2 }}>
        <Grid container spacing={2}>
          {termsOfService?.map((row) => (
            <Grid item xs={12} sm={6} md={3} mb={1} key={row.id}>
              <div className="bg-white p-4 rounded-md shadow-sm flex flex-col gap-3 items-center justify-center">
                <p className="font-semibold text-base pt-2 text-primary">
                  {row?.description}
                </p>
                <p className="text-gray-500 font-normal text-xs">
                  {row?.name.charAt(0).toUpperCase() +
                    row?.name.slice(1).toLowerCase()}
                </p>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default TermsOfService;
