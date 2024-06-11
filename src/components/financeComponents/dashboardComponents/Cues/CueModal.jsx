import { Box, Divider, IconButton, Modal, Typography } from "@mui/material";
import React from "react";
import CuesTable from "./CuesTable";
import CueOptions from "./CueOptions";
import { ArrowBackIos, KeyboardBackspaceRounded } from "@mui/icons-material";

function CueModal({ openCue, setOpenCue }) {
  return (
    <Modal
      open={openCue}
      onClose={() => setOpenCue(false)}
      disableAutoFocus={true}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        outline: "none",
      }}
    >
      <div className="h-[98vh] w-[95vw] border-none bg-white px-12 outline-none">
        <Box my={2}>
          <div className="flex items-center gap-2">
            <IconButton
              onClick={() => setOpenCue(false)}
              sx={{
                borderRadius: "50%",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
              }}
            >
              <ArrowBackIos color="primary" />
            </IconButton>
            <Typography color="primary" fontSize={15} fontWeight={500}>
              Normal Reciepts
            </Typography>
          </div>
          <Box sx={{ mt: 3 }}>
            <CueOptions />
          </Box>{" "}
          <Divider sx={{ p: 1, mb: 1 }} />
        </Box>
        <CuesTable />
      </div>
    </Modal>
  );
}

export default CueModal;
