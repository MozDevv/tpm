"use client";

import CustomBreadcrumbsList from "@/components/CustomBreadcrumbs/CustomBreadcrumbsList";
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
      <h3 className="text-[18px] mt-3 ml-4 mb-[-15px] text-primary font-semibold">
        Terms Of Service
      </h3>

      <CustomBreadcrumbsList currentTitle="Terms of Service" />
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
