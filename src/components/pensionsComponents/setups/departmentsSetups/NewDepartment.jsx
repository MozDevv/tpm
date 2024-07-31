import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";

function NewDepartment() {
  const [openCreateDepartment, setOpenCreateDepartment] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isMda, setIsMda] = useState(false);

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          padding: "40px",
          maxWidth: "500px",
          width: "100%",
        },
      }}
      open={openCreateDepartment}
      onClose={() => setOpenCreateDepartment(false)}
    >
      <div className="flex w-full justify-between max-h-8 mb-3">
        <p className="text-base text-primary font-semibold mb-5">
          Departments Setups
        </p>
      </div>
      <form>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-xs font-medium text-[13px] text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 bg-white border border-gray-400 text-[13px] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-xs font-medium text-[13px] text-gray-700"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-2 bg-white border border-gray-400 text-[13px] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <FormControlLabel
            control={
              <Switch
                checked={isMda}
                onChange={(e) => setIsMda(e.target.checked)}
                name="is_mda"
                color="primary"
              />
            }
            label="Is MDA"
          />
        </div>
        <Button variant="contained" color="primary" onClick={createDepartment}>
          <p className="text-xs">Create Department</p>
        </Button>
      </form>
    </Dialog>
  );
}

export default NewDepartment;
