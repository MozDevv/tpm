import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import { ArrowBack, OpenInFull } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import PensionerDetailSummary from "../pensionsComponents/preclaims/PensionerDetailSummary";
import { Divider, message } from "antd";
import ListNavigation from "./ListNavigation";
import UserDetailCard from "../pensionsComponents/recordCard/UserDetailCard";
import SendForApproval from "../pensionsComponents/preclaims/SendForApproval";
import CreateBranch from "./CreateBranch";
import endpoints, { apiService } from "../services/setupsApi";
import BaseInputCard from "./BaseInputCard";
import CreateClaim from "../pensionsComponents/preclaims/CreateClaim";
import BaseDeleteDialog from "./BaseDeleteDialog";

function BaseCard({
  openBaseCard,
  setOpenBaseCard,
  children,
  title,
  status,
  clickedItem,
  handlers,
  isUserComponent,
  setOpenCreateClaim,
  openAction,
  setOpenAction,
  fetchAllPreclaims,
  fields,
  postApiFunction,
  apiEndpoint,
  inputTitle,
  idLabel,
  useRequestBody,
  secondaryFields,
  secondaryApiEndpoint,
  secondaryPostApiFunction,
  secondaryInputTitle,
  dialogType,
  deleteApiEndpoint,
  deleteApiService,
  isSecondaryCard,
  glAccountName,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDetailsVisible, setDetailsVisible] = useState(true);

  const expandSizes = {
    default: {
      minHeight: "95vh",
      maxHeight: "75vh",
      minWidth: "55vw",
      maxWidth: "75vw",
    },
    expanded: {
      minHeight: "95vh",
      maxHeight: "95vh",
      minWidth: "95vw",
      maxWidth: "95vw",
    },
    secondary: {
      minHeight: "85vh",
      maxHeight: "75vh",
      minWidth: "40vw",
      maxWidth: "70vw",
    },
  };

  const currentSize = isSecondaryCard
    ? expandSizes.secondary
    : isExpanded
    ? expandSizes.expanded
    : expandSizes.default;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { auth } = useAuth();
  const permissions = auth?.user?.permissions;

  const updatedHandlers = {
    ...handlers,
    openDetails: () => setDetailsVisible(!isDetailsVisible),
    delete: () => setIsDialogOpen(true),
  };

  const handleDeleteItem = async () => {
    try {
      const res = await deleteApiService(deleteApiEndpoint);

      if (res.status === 200 || res.status === 201 || res.data.succeeded) {
        //  fetchAllPreclaims();
        message.success(`${title} deleted successfully`);
        setIsDialogOpen(false);
        setOpenBaseCard(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      open={openBaseCard}
      onClose={() => setOpenBaseCard(false)}
      fullWidth
      maxWidth="xl"
      sx={{
        "& .MuiPaper-root": {
          minHeight: currentSize.minHeight,
          maxHeight: currentSize.maxHeight,
          minWidth: currentSize.minWidth,
          maxWidth: currentSize.maxWidth,
          transition: "all 0.3s ease",
          overflowY: "hidden",
        },
      }}
    >
      <BaseDeleteDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onDelete={handleDeleteItem}
        itemName={clickedItem?.name}
      />

      <Dialog
        open={openAction && (status === 3 || status === 7 || status === 5)}
        onClose={() => setOpenCreateClaim(false)}
        sx={{
          "& .MuiDialog-paper": {
            height: "300px",
            width: "500px",
          },
          p: 4,
        }}
      >
        {status === 3 ? (
          <SendForApproval
            fetchAllPreclaims={fetchAllPreclaims}
            setOpenPreclaimDialog={setOpenBaseCard}
            setOpenCreateClaim={setOpenAction}
            clickedItem={clickedItem}
          />
        ) : status === 7 ? (
          <CreateClaim
            setOpenPreclaimDialog={setOpenBaseCard}
            setOpenCreateClaim={setOpenAction}
            clickedItem={clickedItem}
            fetchAllPreclaims={fetchAllPreclaims}
          />
        ) : status === 5 ? (
          <CreateClaim
            setOpenPreclaimDialog={setOpenBaseCard}
            setOpenCreateClaim={setOpenAction}
            clickedItem={clickedItem}
            fetchAllPreclaims={fetchAllPreclaims}
          />
        ) : null}
      </Dialog>
      {/* <Dialog
        maxWidth="lg"
        maxHeight="lg"
        sx={{
          "& .MuiDialog-paper": {
            minHeight: "200px",
            minWidth: "600px",
          },
        }}
        open={openAction && status === "createBranch"}
        onClose={() => setOpenAction(false)}
      >
        <CreateBranch clickedItem={clickedItem} setOpenAction={setOpenAction} />
      </Dialog> */}
      <Dialog
        maxWidth="lg"
        maxHeight="lg"
        sx={{
          "& .MuiDialog-paper": {
            minHeight: "250px",
            minWidth: "600px",
            pt: 5,
          },
        }}
        open={
          openAction &&
          status === "createConstituency" &&
          dialogType === "branch"
        }
        onClose={() => setOpenAction(false)}
      >
        <BaseInputCard
          inputTitle={inputTitle}
          fields={fields}
          apiEndpoint={apiEndpoint}
          postApiFunction={postApiFunction}
          setOpenAction={setOpenAction}
          //clickedItem={clickedItem.id}
          id={clickedItem?.id}
          idLabel={idLabel}
          setOpenBaseCard={setOpenBaseCard}
          useRequestBody={useRequestBody}
        />
      </Dialog>
      <Dialog
        maxWidth="lg"
        maxHeight="lg"
        sx={{
          "& .MuiDialog-paper": {
            minHeight: "250px",
            minWidth: "600px",
            pt: 5,
          },
        }}
        open={openAction && status === "numberSeriesLine"}
        onClose={() => setOpenAction(false)}
      >
        <BaseInputCard
          inputTitle={inputTitle}
          fields={fields}
          apiEndpoint={apiEndpoint}
          postApiFunction={postApiFunction}
          setOpenAction={setOpenAction}
          //clickedItem={clickedItem.id}
          id={clickedItem?.id}
          idLabel={idLabel}
          setOpenBaseCard={setOpenBaseCard}
          useRequestBody={useRequestBody}
        />
      </Dialog>
      <Dialog
        maxWidth="lg"
        maxHeight="lg"
        sx={{
          "& .MuiDialog-paper": {
            minHeight: "250px",
            minWidth: "600px",
            pt: 5,
          },
        }}
        open={
          openAction && status === "createBranch" && dialogType === "branch"
        }
        onClose={() => setOpenAction(false)}
      >
        <BaseInputCard
          inputTitle={inputTitle}
          fields={fields}
          apiEndpoint={apiEndpoint}
          postApiFunction={postApiFunction}
          setOpenAction={setOpenAction}
          //clickedItem={clickedItem.id}
          id={clickedItem?.id}
          idLabel={idLabel}
          setOpenBaseCard={setOpenBaseCard}
          useRequestBody={useRequestBody}
          isBranch={true}
        />
      </Dialog>
      <Dialog
        maxWidth="lg"
        maxHeight="lg"
        sx={{
          "& .MuiDialog-paper": {
            minHeight: "250px",
            minWidth: "600px",
            pt: 5,
          },
        }}
        open={
          openAction && status === "createBranch" && dialogType === "bankType"
        }
        onClose={() => setOpenAction(false)}
      >
        <BaseInputCard
          inputTitle={secondaryInputTitle}
          fields={secondaryFields}
          apiEndpoint={secondaryApiEndpoint}
          postApiFunction={secondaryPostApiFunction}
          setOpenAction={setOpenAction}
          //clickedItem={clickedItem.id}
          //  id={clickedItem?.id}
          // idLabel={idLabel}
          setOpenBaseCard={setOpenBaseCard}
          useRequestBody={useRequestBody}
        />
      </Dialog>

      <div className="overflow-y-hidden p-5">
        <div className="flex items-center justify-between w-full px-3 sticky top-0 z-[99999999] bg-white">
          <div className="flex items-center gap-1 mt-10">
            <IconButton
              sx={{
                border: "1px solid #006990",
                borderRadius: "50%",
                padding: "3px",
                marginRight: "10px",
                color: "#006990",
              }}
              onClick={() => setOpenBaseCard(false)}
            >
              <ArrowBack sx={{ color: "#006990" }} />
            </IconButton>
            <p className="text-lg text-primary font-semibold">
              {glAccountName || title}
            </p>
          </div>
          <div className="flex items-center">
            <IconButton onClick={() => setIsExpanded(!isExpanded)}>
              <Tooltip title={isExpanded ? "Shrink" : "Expand"}>
                <OpenInFull
                  color="primary"
                  sx={{
                    fontSize: "18px",
                    mt: "4px",
                  }}
                />
              </Tooltip>
            </IconButton>
          </div>
        </div>
        <div className="w-full flex flex-col ">
          <ListNavigation
            handlers={updatedHandlers}
            permissions={permissions}
            status={status}
          />
          <Divider />
        </div>
        <div
          // className={`grid gap-2 ${
          //   isUserComponent
          //     ? "grid-cols-12" // Full width if isUserComponent is true
          //     : !isDetailsVisible
          //     ? "grid-cols-12" // Full width if details are not visible
          //     : "grid-cols-9" // Default layout
          // }`}
          className="grid gap-2 grid-cols-12 mt-[-20px]"
        >
          {" "}
          <div
            className={`col-span-${isDetailsVisible ? "12" : "9"}`}
            // className="col-span-9"
          >
            {children}
          </div>
          {!isDetailsVisible && (
            <div className="col-span-3 flex flex-col mt-10">
              {isUserComponent ? (
                <>
                  <UserDetailCard clickedItem={clickedItem} />
                </>
              ) : (
                <></>
                // <div className="flex items-center flex-col justify-center p-2 gap-2">
                //   <Avatar sx={{ height: "100px", width: "100px" }} />
                // </div>

                // <>
                //   <PensionerDetailSummary clickedItem={clickedItem} />
                //   <Divider sx={{ mt: 3 }} />
                // </>
              )}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}

export default BaseCard;
