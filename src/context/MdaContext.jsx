"use client";
import { AuthApiService } from "@/components/services/authApi";
import { useAuth } from "./AuthContext";
import authEndpoints from "@/components/services/authApi";
import { createContext, useContext, useEffect, useState } from "react";
import endpoints, { apiService } from "@/components/services/setupsApi";

const MdaContext = createContext();

export const useMda = () => useContext(MdaContext);

export const MdaProvider = ({ children }) => {
  const [mdas, setMdas] = useState([]);
  const { auth } = useAuth();
  const userId = auth?.user?.userId;
  const [mdaId, setMdaId] = useState("");
  const [activePensionCap, setActivePensionCap] = useState("");

  const [activeCapName, setActiveCapName] = useState("");

  const fetchUserDetails = async () => {
    try {
      const res = await AuthApiService.get(authEndpoints.getUsers, {
        documentID: userId,
      });
      if (res.status === 200) {
        console.log("mdata", res.data.data.mdaId);

        if (typeof window !== "undefined" && res.data.data.mdaId) {
          const savedItem = localStorage.setItem("mdaId", res.data.data.mdaId);
          setMdaId(savedItem || null);
        }

        fetchMdas(res.data.data.mdaId);
      }

      console.log("User details fetched successfully:", res.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchMdas = async (mdaId) => {
    try {
      const res = await apiService.get(endpoints.mdas, {
        "paging.pageSize": 100,
      });

      const userMda = res.data.data.find((mda) => mda.id === mdaId);

      const currentCap = userMda?.pensionCap?.id;
      const currentCapName = userMda?.pensionCap?.name;
      setActiveCapName(currentCapName);

      console.log("Current MDA: ********", userMda);

      console.log("Current CAP: ********", currentCap);

      console.log("MDA ID: ********", mdaId);
      // setCurrentMda(userMda);

      setActivePensionCap(currentCap);

      console.log("Current MDA: ********", currentCap);
    } catch (error) {
      console.error("Error fetching MDAs:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]); // Added userId as a dependency to refetch when userId changes

  return (
    <MdaContext.Provider
      value={{
        mdaId,
        activePensionCap,
        setActivePensionCap,
        activeCapName,
      }}
    >
      {children}
    </MdaContext.Provider>
  );
};
