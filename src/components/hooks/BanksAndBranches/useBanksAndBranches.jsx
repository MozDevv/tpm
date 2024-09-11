import endpoints, { apiService } from "@/components/services/setupsApi";
import React, { useEffect } from "react";

function useBanksAndBranches() {
  const [banks, setBanks] = React.useState([]);
  const [branches, setBranches] = React.useState([]);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchBanksAndBranches = async () => {
      try {
        const res = await apiService.get(endpoints.getBanks);
        const rawData = res.data.data;

        const banksData = rawData.map((bank) => ({
          id: bank.id,
          name: bank.name,
        }));

        const branchesData = rawData.flatMap((bank) =>
          bank.branches.map((branch) => ({
            ...branch,
            bankId: bank.id,
          }))
        );

        setBanks(banksData);
        setBranches(branchesData);
      } catch (error) {
        console.log("Error fetching banks and branches:", error);
      }
    };
    fetchBanksAndBranches();
  }, []);

  return { banks, branches, error };
}

export default useBanksAndBranches;
