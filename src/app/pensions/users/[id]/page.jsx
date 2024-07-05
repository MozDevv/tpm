"use client";
import RecordCard from "@/components/pensionsComponents/recordCard/RecordCard";
import UserDetailCard from "@/components/pensionsComponents/recordCard/UserDetailCard";
import UserDetails from "@/components/pensionsComponents/user-table/UserDetails";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function page({ params }) {
  const router = useRouter();
  const { id } = params;
  const [userData, setUserData] = useState(null);

  console.log(id);
  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(
        `https://pmis.agilebiz.co.ke/api/UserManagement/GetUsers?documentID=${id}`
      );

      console.log(res.data.data);
      setUserData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div>
      <RecordCard clickedItem={userData} />
    </div>
  );
}

export default page;
