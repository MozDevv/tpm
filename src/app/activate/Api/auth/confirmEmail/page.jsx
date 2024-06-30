"use client";
import authEndpoints, { AuthApiService } from "@/components/services/authApi";
import Spinner from "@/components/spinner/Spinner";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

function Activate() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  console.log("token", token);
  console.log("userId", userId);

  const activateEmail = async () => {
    try {
      const response = await AuthApiService.get(authEndpoints.activateEmail, {
        userId,
        token,
      });
      console.log(response);
      if (response.status === 200) {
        console.log("Email activated successfully");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    activateEmail();
  }, []);
  return (
    <div>
      <Spinner />
    </div>
  );
}

export default Activate;
