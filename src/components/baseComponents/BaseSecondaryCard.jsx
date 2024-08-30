// BaseSecondaryCard.jsx
import React, { useEffect } from "react";
import BaseCard from "./BaseCard";
import BaseInputCard from "./BaseInputCard";

const BaseSecondaryCard = ({
  openBaseCard,
  setOpenBaseCard,
  title,
  clickedItem,
  deleteApiEndpoint,
  deleteApiService,
  isSecondaryCard = true,
  fields,
  updateEndpoint,
  createEndpoint,
  postApiFunction,
  setPostedData,
  id,
  idLabel,
  useRequestBody = true,
  isBranch = true,
  setClickedItem,
}) => {
  return (
    <div className="relative">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={deleteApiEndpoint}
        deleteApiService={deleteApiService}
        isSecondaryCard={isSecondaryCard}
      >
        {clickedItem ? (
          <BaseInputCard
            fields={fields}
            apiEndpoint={updateEndpoint}
            postApiFunction={postApiFunction}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={useRequestBody}
          />
        ) : (
          <BaseInputCard
            setPostedData={setPostedData}
            id={id}
            idLabel={idLabel}
            fields={fields}
            apiEndpoint={createEndpoint}
            postApiFunction={postApiFunction}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={useRequestBody}
            isBranch={isBranch}
          />
        )}
      </BaseCard>
    </div>
  );
};

export default BaseSecondaryCard;
