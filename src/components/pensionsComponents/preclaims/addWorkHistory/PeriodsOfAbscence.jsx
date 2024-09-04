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
  Select,
  MenuItem,
  TextField,
  FormControl,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import dayjs from "dayjs";
import { useAlert } from "@/context/AlertContext";
import { message } from "antd";
import { useMda } from "@/context/MdaContext";
import EditableTable from "@/components/baseComponents/EditableTable";

function PeriodsOfAbsence({ id, status }) {
  const [periodsOfAbsence, setPeriodsOfAbsence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const { alert, setAlert } = useAlert();

  const fetchPeriodsOfAbsence = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getPeriodsOfAbsence(id)
      );
      setPeriodsOfAbsence(res.data.data);
      setLoading(false);
      console.log("Period of Absence", res.data.data);
      return res.data.data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriodsOfAbsence();
  }, [id]);

  const fields = [
    { label: "Start Date", value: "start_date", type: "date" },
    { label: "End Date", value: "end_date", type: "date" },
    {
      label: "Cause Of Absence",
      value: "cause_of_absence",
      type: "select",
      options: [
        "Absenteeism",
        "Suspension",
        "Interdiction",
        "Unpaid Maternity Leave",
        "Study Leave",
        "Sick Leave",
        "Condoned Leave",
      ],
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (data) => {
    const formattedFormData = { ...data, prospective_pensioner_id: id };
    Object.keys(formData).forEach((key) => {
      if (dayjs(formattedFormData[key]).isValid() && key.includes("date")) {
        formattedFormData[key] = dayjs(formattedFormData[key]).format(
          "YYYY-MM-DDTHH:mm:ss[Z]"
        );
      }
    });

    try {
      if (data.id) {
        const res = await apiService.post(
          preClaimsEndpoints.UpdatePeriodsOfAbsence,
          {
            ...formattedFormData,
            id: editId,
          }
        );

        if (res.status === 200 && res.data.succeeded) {
          fetchPeriodsOfAbsence();
          setOpen(false);
          message.success("Period of Absence updated successfully");
        } else if (res.data.validationErrors.length > 0) {
          res.data.validationErrors.forEach((error) => {
            error.errors.forEach((err) => {
              message.error(`${error.field}: ${err}`);
            });
          });
        } else if (
          res.status === 200 &&
          !res.data.succeeded &&
          res.data.message.length > 0
        ) {
          message.error(res.data.message[0]);
          throw new Error(res.data.message[0]);
        }
      } else {
        const res = await apiService.post(
          preClaimsEndpoints.createPeriodsOfAbsence,
          formattedFormData
        );

        if (res.status === 200 && res.data.succeeded) {
          fetchPeriodsOfAbsence();
          setOpen(false);

          message.success("Period of Absence added successfully");
        }
        if (res.data.validationErrors.length > 0) {
          res.data.validationErrors.forEach((error) => {
            error.errors.forEach((err) => {
              message.error(`${error.field}: ${err}`);
            });
          });
          throw new Error("An error occurred while submitting the data.");
        }
      }
    } catch (error) {
      throw error;
      console.log(error);
    }
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState();

  const handleEdit = (item) => {
    const formattedItem = {
      ...item,
      start_date: dayjs(item.start_date).format("YYYY-MM-DD"),
      end_date: dayjs(item.end_date).format("YYYY-MM-DD"),
    };

    setFormData(formattedItem);
    setOpen(true);
    setEditId(item.id);
    setIsEditMode(true);
  };

  const handleDelete = async () => {
    try {
      await apiService.post(
        preClaimsEndpoints.deletePeriodsOfAbsence(recordId)
      );
      fetchPeriodsOfAbsence();
      setAlert({
        open: true,
        message: "Periods of abscence deleted successfully",
        severity: "success",
      });
      setOpenDeleteDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState();
  const [recordId, setRecordId] = useState();
  const { activeCapName } = useMda();

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
    //         >
    //           Delete
    //         </Button>
    //       </div>
    //     </div>
    //   </Dialog>
    //   <Dialog open={open} onClose={() => setOpen(false)}>
    //     <div className="p-10">
    //       <h1 className="text-lg font-semibold text-primary py-2 mb-3">
    //         {activeCapName === "CAP199"
    //           ? "Capped Service"
    //           : "Period of Absence"}
    //       </h1>
    //       <div className="flex flex-col gap-2 w-[300px]">
    //         {fields.map((field) => (
    //           <div key={field.value}>
    //             <label className="text-xs font-semibold text-gray-600">
    //               {field.label}
    //             </label>
    //             {field.type === "select" ? (
    //               <FormControl fullWidth>
    //                 <TextField
    //                   select
    //                   name={field.value}
    //                   value={formData[field.value] || ""}
    //                   onChange={handleInputChange}
    //                   defaultValue=""
    //                   size="medium"
    //                   fullWidth
    //                 >
    //                   {field.options.map((option, index) => (
    //                     <MenuItem key={index} value={option}>
    //                       {option}
    //                     </MenuItem>
    //                   ))}
    //                 </TextField>
    //               </FormControl>
    //             ) : (
    //               <TextField
    //                 size="medium"
    //                 fullWidth
    //                 type={field.type || "text"}
    //                 name={field.value}
    //                 value={formData[field.value] || ""}
    //                 onChange={handleInputChange}
    //                 className="border p-3 bg-gray-100 border-gray-300 w-full rounded-md text-sm"
    //               />
    //             )}
    //           </div>
    //         ))}
    //         <Button variant="contained" onClick={handleSubmit} sx={{ mt: 4 }}>
    //           Submit
    //         </Button>
    //       </div>
    //     </div>
    //   </Dialog>
    //   <p className="my-4 mt-6 text-primary text-[16px] font-montserrat font-semibold">
    //     Periods of Absence
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
    //       setOpen(true);
    //     }}
    //   >
    //     {activeCapName === "CAP199"
    //       ? "Add Capped Service"
    //       : "Add Period of Absence"}
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
    //           <TableCell>Cause Of Absence</TableCell>
    //           <TableCell>Number of Days</TableCell>
    //           <TableCell>Actions</TableCell>
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //         {periodsOfAbsence.map((item, index) => (
    //           <TableRow key={item.prospective_pensioner_id}>
    //             <TableCell>{index + 1}</TableCell>
    //             <TableCell>
    //               {new Date(item.start_date).toLocaleDateString()}
    //             </TableCell>
    //             <TableCell>
    //               {new Date(item.end_date).toLocaleDateString()}
    //             </TableCell>
    //             <TableCell>{item.cause_of_absence}</TableCell>
    //             <TableCell>{item.number_of_days}</TableCell>
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
    //                 sx={{
    //                   display: status === 5 ? "none" : "flex",
    //                 }}
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
    <div className="">
      <div className="mt-4">
        <EditableTable
          fetchData={fetchPeriodsOfAbsence}
          fields={fields}
          initialData={periodsOfAbsence}
          title="Periods of Absence"
          // validators={validators}
          handleSave={handleSubmit}
          handleUpdate={handleSubmit}
          //handleError={handleError}
          //validationErrorsFromApi={validationErrors}
        />
      </div>
    </div>
  );
}

export default PeriodsOfAbsence;
