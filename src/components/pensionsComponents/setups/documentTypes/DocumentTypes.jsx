"use client";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { Add, ArticleOutlined } from "@mui/icons-material";
import { Button, Dialog, IconButton, List, ListItem } from "@mui/material";
import React, { useEffect } from "react";
import { Box, Grid, MenuItem, TextField } from "@mui/material";

function DocumentTypes() {
  const [openNotification, setOpenNotification] = React.useState(false);

  const documentExtensions = [
    { value: ".pdf", label: "PDF" },
    { value: ".doc", label: "DOC" },
    { value: ".docx", label: "DOCX" },
    { value: ".xls", label: "XLS" },
    { value: ".xlsx", label: "XLSX" },
    { value: ".ppt", label: "PPT" },
    { value: ".pptx", label: "PPTX" },
  ];
  const [documentTypes, setDocumentTypes] = React.useState([]);
  const fetchDocumentTypes = async () => {
    try {
      const res = await apiService.get(endpoints.documentTypes);

      console.log(res.data.data);

      setDocumentTypes(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [extension, setExtension] = React.useState("");

  const handleCreate = async () => {
    const data = {
      name: name,
      description: description,
      extenstions: extension,
    };

    try {
      const res = await apiService.post(endpoints.createDocumentType, data);
      console.log(res.data);
      fetchDocumentTypes();
      setOpenNotification(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-8">
      <Dialog
        open={openNotification}
        onClose={() => setOpenNotification(false)}
        fullWidth
        maxWidth="sm"
        sx={{
          padding: "20px",
        }}
      >
        <div className="p-8">
          {" "}
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-2">
              <h5 className="text-[17px] text-primary font-semibold">
                Create Document Type
              </h5>
            </div>
            <div className="flex gap-8 mr-4">
              <Button
                variant="outlined"
                onClick={() => setOpenNotification(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
              >
                Create
              </Button>
            </div>
          </div>
          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full p-3 bg-gray-100 rounded-md border-gray-600"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-xs font-medium text-gray-700"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full p-3 bg-gray-100 rounded-md border-gray-400"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="extension"
                  className="block text-xs font-medium text-gray-700"
                >
                  Document Extension
                </label>
                <TextField
                  select
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="extension"
                  value={extension}
                  onChange={(e) => setExtension(e.target.value)}
                  className="mt-1 block w-full bg-gray-100 rounded-md border-gray-400"
                >
                  <MenuItem value="">Select Extension</MenuItem>
                  {documentExtensions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </form>
          </Box>
        </div>
      </Dialog>
      <div className="mb-3 ml-4">
        <Button
          onClick={() => setOpenNotification(true)}
          variant="contained"
          sx={{
            color: "primary",
          }}
        >
          Add Document Type
        </Button>
      </div>
      <div className="px-3">
        <List>
          {documentTypes?.map((documentType) => (
            <ListItem
              key={documentType.id}
              sx={{
                backgroundColor: "white",
                width: "100%",
                borderRadius: 5,
                mb: 2,
                padding: 2,
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex justify-between w-full">
                {" "}
                <div className="px-3 flex flex-row gap-3">
                  <IconButton>
                    <ArticleOutlined sx={{ color: "gray" }} />
                  </IconButton>
                  <div className="flex flex-col ">
                    <p className="font-semibold text-base text-primary">
                      {documentType?.description}
                    </p>
                    <p className="text-gray-500 font-normal text-xs">
                      {documentType?.name.charAt(0).toUpperCase() +
                        documentType?.name.slice(1).toLowerCase()}
                    </p>
                  </div>
                </div>
                <div className="pr-8 mt-1">
                  <p className="text-gray-500">{documentType.extenstions}</p>
                </div>
              </div>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
}

export default DocumentTypes;
