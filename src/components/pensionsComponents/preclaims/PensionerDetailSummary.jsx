import { Avatar, Divider, IconButton } from "@mui/material";
import { EmailOutlined, PhoneOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { notificationStatusMap } from "./Preclaims";
import { message } from "antd";
import preClaimsEndpoints, {
  apiService,
} from "@/components/services/preclaimsApi";

function PensionerDetailSummary({ clickedItem }) {
  const id = clickedItem?.id;

  const [awardDocuments, setAwardDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAwardDocuments = async () => {
      try {
        const res = await apiService.get(
          preClaimsEndpoints.getAwardDocuments(id)
        );
        console.log("Award documents:", res.data?.data[0]);
        const documents =
          res.data?.data[0]?.prospectivePensionerDocumentSelections?.map(
            (selection) => ({
              id: selection.id,
              name: selection.documentType.name,
              description: selection.documentType.description,
              extensions: selection.documentType.extenstions,
              required: selection.required,
              pensioner_upload: selection.pensioner_upload,
            })
          );

        // Filter documents to upload based on pensioner_upload: false
        // const uploadableDocuments = !documents.filter(
        //   (doc) => !doc.pensioner_upload
        // );

        setAwardDocuments(documents);
      } catch (error) {
        console.log("Error fetching award documents:", error);
        // message.error("Failed to fetch award documents.");
      } finally {
        setLoading(false);
      }
    };

    getAwardDocuments();
  }, [id]);

  return (
    <div className="mt-5">
      <div className="flex items-center flex-col justify-center p-2 gap-2">
        <Avatar sx={{ height: "100px", width: "100px" }} />
        <div className="flex flex-col mt-5 gap-2 items-center justify-center">
          <h5 className="font-semibold text-primary text-base">{`${clickedItem?.first_name} ${clickedItem?.surname}`}</h5>
        </div>
      </div>
      <Divider />
      <div className="mt-4 p-2">
        <div className="flex items-center gap-2">
          <IconButton>
            <PhoneOutlined />
          </IconButton>
          <h6 className="font-medium text-primary text-xs">
            {clickedItem?.phone_number}
          </h6>
        </div>
        <div className="flex items-center gap-2">
          <IconButton>
            <EmailOutlined />
          </IconButton>
          <h6 className="font-medium text-primary text-xs">
            {clickedItem?.email_address}
          </h6>
        </div>
      </div>
      <Divider />
      <div className="mt-8 p-2 flex gap-3 flex-col">
        <div className="flex items-center gap-2">
          <h6 className="font-medium text-primary text-xs">Personal Number</h6>
          <span className="text-xs">{clickedItem?.personal_number}</span>
        </div>
        <div className="flex items-center gap-2">
          <h6 className="font-medium text-primary text-xs">Pension Award: </h6>
          <span className="text-xs">{clickedItem?.pension_award}</span>
        </div>
        <div className="flex items-center gap-2">
          <h6 className="font-medium text-primary text-xs">Status</h6>
          <span className="text-xs">
            {notificationStatusMap[clickedItem?.notification_status]?.name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PensionerDetailSummary;
