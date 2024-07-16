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
} from "@mui/material";
import dayjs from "dayjs";
import { useAlert } from "@/context/AlertContext";

function PeriodsOfAbsence({ id }) {
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
    { label: "Cause Of Absence", value: "cause_of_absence" },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const formattedFormData = { ...formData, prospective_pensioner_id: id };
    Object.keys(formData).forEach((key) => {
      if (dayjs(formattedFormData[key]).isValid() && key.includes("date")) {
        formattedFormData[key] = dayjs(formattedFormData[key]).format(
          "YYYY-MM-DDTHH:mm:ss[Z]"
        );
      }
    });

    try {
      const res = await apiService.post(
        preClaimsEndpoints.createPeriodsOfAbsence,
        formattedFormData
      );

      if (res.status === 200) {
        fetchPeriodsOfAbsence();
        setOpen(false);
        setAlert({
          open: true,
          message: "Period of Absence added successfully",
          severity: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="p-10">
          <h1 className="text-base font-semibold text-primary py-2 mb-3">
            Add Period of Absence
          </h1>
          <div className="flex flex-col gap-2">
            {fields.map((field) => (
              <div key={field.value}>
                <label className="text-xs font-semibold text-gray-600">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.value}
                  onChange={handleInputChange}
                  className="border p-3 bg-gray-100 border-gray-300 w-full rounded-md text-sm"
                />
              </div>
            ))}
            <Button variant="contained" onClick={handleSubmit} sx={{ mt: 4 }}>
              Submit
            </Button>
          </div>
        </div>
      </Dialog>
      <p className="my-2 mt-4 text-primary text-[18px] font-semibold">
        Periods of Absence
      </p>
      <Button
        variant="contained"
        sx={{
          mt: 2,
          mb: 2,
        }}
        onClick={() => setOpen(true)}
      >
        Add Period of Absence
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Cause Of Absence</TableCell>
              <TableCell>Number of Days</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {periodsOfAbsence.map((item, index) => (
              <TableRow key={item.prospective_pensioner_id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {new Date(item.start_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(item.end_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{item.cause_of_absence}</TableCell>
                <TableCell>{item.number_of_days}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default PeriodsOfAbsence;
