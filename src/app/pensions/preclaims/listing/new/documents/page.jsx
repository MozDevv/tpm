"use client";
import AddDocuments from "@/components/pensionsComponents/preclaims/documents/AddDocuments";
import preClaimsEndpoints, {
  apiService,
} from "@/components/services/preclaimsApi";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function Documents() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  console.log("id", id);
  const [awardDocuments, setAwardDocuments] = useState([]);
  useEffect(() => {
    const getAwardDocuments = async () => {
      try {
        const res = await apiService.get(
          preClaimsEndpoints.getAwardDocuments(id)
        );
        setAwardDocuments(res.data.data[0].pensionAward?.awardDocuments || []);
      } catch (error) {
        console.log(error);
      }
    };

    getAwardDocuments();
  }, [id]);

  return (
    <div>
      <p className="text-primary font-semibold mb-5 text-xl ml-1 mt-4">
        Upload all the Required Items
      </p>
      <AddDocuments id={id} />
    </div>
  );
}

export default Documents;
