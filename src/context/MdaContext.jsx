"use client";
import { AuthApiService } from "@/components/services/authApi";
import { useAuth } from "./AuthContext";
import authEndpoints from "@/components/services/authApi";
import { createContext, useContext, useEffect, useState } from "react";

const MdaContext = createContext();

export const useMda = () => useContext(MdaContext);

export const MdaProvider = ({ children }) => {
  const [mdas, setMdas] = useState([]);
  const { auth } = useAuth();
  const userId = auth?.user?.userId;
  const [mdaId, setMdaId] = useState("");

  const fetchUserDetails = async () => {
    try {
      const res = await AuthApiService.get(authEndpoints.getUsers, {
        documentID: userId,
      });
      if (res.status === 200) {
        console.log("mdata", res.data.data.mdaId);
        setMdas(res.data.data.mdaId);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]); // Added userId as a dependency to refetch when userId changes

  return (
    <MdaContext.Provider value={{ mdaId }}>{children}</MdaContext.Provider>
  );
};
