import endpoints, { apiService } from "@/components/services/setupsApi";
import { useAlert } from "@/context/AlertContext";
import { Button, Dialog, MenuItem, TextField } from "@mui/material";
import React from "react";

function CreatePermission({ createPermission, setCreatePermission, tables }) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [tableId, setTableId] = React.useState("none");

  const { alert, setAlert } = useAlert();

  const handleCreatePermissions = async () => {
    const data = {
      name,
      description,
      tableId,
    };

    if (!name || !description || !tableId) {
      setAlert({
        open: true,
        message: "All fields are required",
        severity: "error",
      });
      return;
    }

    console.log(tables);
    try {
      const res = await apiService.post(endpoints.createPermissions, data);

      if (res.status === 200) {
        console.log(res.data);
        setAlert("Permission created successfully!");
      }
    } catch (error) {
      console.log(name, description, tableId);
      console.log(error.response);
    }
  };

  return (
    <div>
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            padding: "40px",
            maxWidth: "500px",
            width: "100%",
          },
        }}
        open={createPermission}
        onClose={() => setCreatePermission(false)}
      >
        <div className="flex w-full justify-between max-h-8 mb-3">
          {" "}
          <p className="text-base text-primary font-semibold mb-5">
            Permission Setups
          </p>
        </div>
        <form>
          <div className="mb-4">
            <label
              htmlFor="end_date"
              className="block text-xs font-medium text-[13px] text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="end_date"
              name="end_date"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 bg-white border border-gray-400 text-[13px] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="end_date"
              className="block text-xs font-medium text-[13px] text-gray-700"
            >
              Description
            </label>
            <input
              type="text"
              id="end_date"
              name="end_date"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full p-2 bg-white border border-gray-400 text-[13px] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="">
            <label
              htmlFor="end_date"
              className="block text-xs font-medium text-[13px] text-gray-700"
            >
              Table
            </label>
            <TextField
              select
              variant="outlined"
              size="small"
              fullWidth
              // name="extension"
              sx={{
                my: 1,
              }}
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="mt-1 block w-full  rounded-md border-gray-400"
            >
              <MenuItem value="none">Select Table</MenuItem>
              {Array.isArray(tables) &&
                tables.map((option) => (
                  <MenuItem key={option.tableId} value={option.tableId}>
                    {option.name}
                  </MenuItem>
                ))}
            </TextField>
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreatePermissions}
          >
            <p className="text-xs">Create Permission</p>
          </Button>
        </form>
      </Dialog>
    </div>
  );
}

export default CreatePermission;
