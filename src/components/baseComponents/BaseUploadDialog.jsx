import React from 'react';
import { Dialog, Divider, Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload'; // Assuming you're using Material UI icons
import { useDropzone } from 'react-dropzone';
import { CloudUpload, CloudUploadOutlined } from '@mui/icons-material';

const BaseUploadDialog = ({
  open,
  onClose,
  title = 'Upload File',
  selectedFile,
  handleUploadFile,
  setSelectedFile,
  clickedItem,
  fileTypes = '.xls, .xlsx',
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: '.xls, .xlsx',
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
    },
  });

  return (
    <Dialog
      open={open && clickedItem}
      onClose={onClose}
      fullWidth
      //   sx={{
      //     '& .MuiPaper-root': {
      //       minHeight: '400px',
      //       minWidth: '450px',
      //     },
      //   }}
    >
      <div className="p-8">
        <h2 className="text-[20px] font-semibold mb-4 text-primary">{title}</h2>
        <div
          {...getRootProps()}
          className="bg-gray-200 border-2 border-dashed border-gray-400 p-5 text-center cursor-pointer h-[250px] flex flex-col justify-center items-center"
        >
          <input {...getInputProps()} />
          <CloudUploadOutlined style={{ fontSize: 40, color: '#006990' }} />
          <p className="mt-4">
            Drag &apos;n&apos; drop some files here, or click to select files
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {fileTypes} files are allowed, up to 5MB
          </p>
        </div>
        {selectedFile && (
          <div className="mt-4 flex gap-2">
            Selected file:
            <p className="text-primary font-semibold">{selectedFile.name}</p>
          </div>
        )}

        <div className="flex justify-between w-full mt-6">
          <Button onClick={onClose} variant="outlined" className="mr-2">
            Cancel
          </Button>
          <Button
            onClick={handleUploadFile}
            variant="contained"
            color="primary"
            disabled={!selectedFile}
          >
            Upload
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default BaseUploadDialog;
