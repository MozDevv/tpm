"use client";
import preClaimsEndpoints, {
  apiService,
} from "@/components/services/preclaimsApi";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import dayjs from "dayjs";
import { useAlert } from "@/context/AlertContext";
import { message } from "antd";
import EditableTable from "@/components/baseComponents/EditableTable";
import BaseInputTable from "@/components/baseComponents/BaseInputTable";
import endpoints from "@/components/services/setupsApi";

function PensionableSalary({ id, status }) {
  const [pensionableSalary, setPensionableSalary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const { alert, setAlert } = useAlert();

  const fetchPensionableSalary = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getPensionableSalary(id)
      );
      setPensionableSalary(res.data.data);
      setLoading(false);
      console.log("Pensionable Salary", res.data.data);
      return res.data.data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPensionableSalary();
  }, [id]);

  const fields = [
    { label: "Start Date", value: "start_date", type: "date" },
    { label: "End Date", value: "end_date", type: "date" },
    { label: "Salary in k£", value: "salary" },
    { label: "Pensionable Allowance", value: "pensionable_allowance" },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (data) => {
    const formattedFormData = { ...data, prospective_pensioner_id: id };

    // Format date fields
    Object.keys(formData).forEach((key) => {
      if (dayjs(formattedFormData[key]).isValid() && key.includes("date")) {
        formattedFormData[key] = dayjs(formattedFormData[key]).format(
          "YYYY-MM-DDTHH:mm:ss[Z]"
        );
      }
    });

    try {
      let res;

      if (data.id) {
        res = await apiService.post(
          preClaimsEndpoints.updatePensionableSalary,
          {
            ...formattedFormData,
            id: editId,
          }
        );
      } else {
        res = await apiService.post(
          preClaimsEndpoints.createPensionableSalary,
          formattedFormData
        );
      }

      // Check for successful response
      if (res.status === 200 && res.data.succeeded) {
        fetchPensionableSalary();
        setOpen(false);
        message.success(
          `Pensionable Salary ${isEditMode ? "updated" : "added"} successfully`
        );
      } else if (
        res.data.validationErrors &&
        res.data.validationErrors.length > 0
      ) {
        res.data.validationErrors.forEach((error) => {
          error.errors.forEach((err) => {
            message.error(`${error.field}: ${err}`);
          });
        });
        throw new Error("An error occurred while submitting the data.");
      }
    } catch (error) {
      throw error;
      console.error("Submission error:", error);
      message.error("An error occurred while submitting the data.");
    }
  };

  const handleEdit = (item) => {
    const formattedItem = {
      ...item,
      start_date: dayjs(item.start_date).format("YYYY-MM-DD"),
      end_date: dayjs(item.end_date).format("YYYY-MM-DD"),
    };

    setFormData(formattedItem);
    //setFormData(item);
    setEditId(item.id);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await apiService.post(
        preClaimsEndpoints.deletePensionableSalary(recordId)
      );
      fetchPensionableSalary();
      message.success("Pensionable Salary deleted successfully");
      setOpenDeleteDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState();
  const [recordId, setRecordId] = useState();

  return (
    // <div>
    //   <Dialog
    //     open={openDeleteDialog}
    //     onClose={() => setOpenDeleteDialog(false)}
    //   >
    //     <div className="p-6">
    //       <h1 className="text-base font-semibold text-primary py-2 mb-3">
    //         Delete Confirmation
    //       </h1>
    //       <p className="text-gray-600 mb-3">
    //         Are you sure you want to delete this record?
    //       </p>
    //       <div className="flex justify-between w-full mt-5">
    //         <Button
    //           variant="outlined"
    //           onClick={() => setOpenDeleteDialog(false)}
    //           sx={{ mr: 2 }}
    //         >
    //           Cancel
    //         </Button>
    //         <Button
    //           variant="contained"
    //           onClick={handleDelete}
    //           sx={{ backgroundColor: "crimson", color: "white" }}
    //           disabled={status === 5}
    //         >
    //           Delete
    //         </Button>
    //       </div>
    //     </div>
    //   </Dialog>
    //   <Dialog open={open} onClose={() => setOpen(false)}>
    //     <div className="p-6">
    //       <h1 className="text-base font-semibold text-primary py-2 mb-3">
    //         {isEditMode ? "Edit" : "Add"} Pensionable Salary
    //       </h1>
    //       <div className="flex flex-col gap-3">
    //         {fields.map((field) => (
    //           <div key={field.value}>
    //             <label className="text-xs font-semibold text-gray-600">
    //               {field.label}
    //             </label>
    //             <input
    //               type={field.type}
    //               name={field.value}
    //               value={formData[field.value] || ""}
    //               onChange={handleInputChange}
    //               className="border p-3 bg-gray-100 border-gray-300 w-full rounded-md text-sm"
    //             />
    //           </div>
    //         ))}
    //         <Button
    //           variant="contained"
    //           onClick={handleSubmit}
    //           sx={{ mt: 4, display: status === 5 ? "none" : "block" }}
    //         >
    //           {isEditMode ? "Update" : "Submit"}
    //         </Button>
    //       </div>
    //     </div>
    //   </Dialog>
    //   <p className="my-6 mt-5 text-primary text-[16px] font-semibold font-montserrat">
    //     Pensionable Salary
    //   </p>
    //   <Button
    //     variant="contained"
    //     sx={{
    //       mt: 2,
    //       mb: 2,
    //       display: status === 5 ? "none" : "block",
    //     }}
    //     onClick={() => {
    //       setFormData({});
    //       setIsEditMode(false);
    //       setOpen(true);
    //     }}
    //   >
    //     Add Pensionable Salary
    //   </Button>
    //   <TableContainer
    //     //component={Paper}
    //     sx={{ boxShadow: "none" }}
    //   >
    //     <Table>
    //       <TableHead>
    //         <TableRow>
    //           <TableCell>No.</TableCell>
    //           <TableCell>Start Date</TableCell>
    //           <TableCell>End Date</TableCell>
    //           <TableCell>Salary</TableCell>
    //           <TableCell>Pensionable Allowance</TableCell>
    //           <TableCell>Actions</TableCell>
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //         {pensionableSalary.map((item, index) => (
    //           <TableRow key={item.prospective_pensioner_id}>
    //             <TableCell>{index + 1}</TableCell>
    //             <TableCell>
    //               {new Date(item.start_date).toLocaleDateString()}
    //             </TableCell>
    //             <TableCell>
    //               {new Date(item.end_date).toLocaleDateString()}
    //             </TableCell>
    //             <TableCell>{item.salary}</TableCell>
    //             <TableCell>{item.pensionable_allowance}</TableCell>
    //             <TableCell sx={{ display: "flex", flexDirection: "row" }}>
    //               <IconButton onClick={() => handleEdit(item)}>
    //                 {status === 5 ? (
    //                   <Visibility />
    //                 ) : (
    //                   <Edit sx={{ color: "gray" }} />
    //                 )}
    //               </IconButton>
    //               <IconButton
    //                 onClick={() => {
    //                   setOpenDeleteDialog(true);
    //                   setRecordId(item.id);
    //                 }}
    //                 sx={{ display: status === 5 ? "none" : "block" }}
    //               >
    //                 <Delete sx={{ color: "crimson" }} />
    //               </IconButton>
    //             </TableCell>
    //           </TableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>
    // </div>

    <div className="mt-5">
      <BaseInputTable
        title="Pensionable Salary"
        fields={fields}
        id={id}
        idLabel="prospective_pensioner_id"
        apiService={apiService}
        getApiService={apiService.get}
        postApiService={apiService.post}
        putApiService={apiService.post}
        getEndpoint={preClaimsEndpoints.getPensionableSalary(id)}
        postEndpoint={preClaimsEndpoints.createPensionableSalary}
        putEndpoint={preClaimsEndpoints.updatePensionableSalary}
        deleteEndpoint={endpoints.deletePensionableSalary(id)}
        passProspectivePensionerId={true}
      />
    </div>
  );
}

export default PensionableSalary;
