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
  TextField,
  IconButton,
} from "@mui/material";
import { Delete, Edit, Save, Cancel } from "@mui/icons-material";
import dayjs from "dayjs";
import { message } from "antd";
import { apiService } from "@/components/services/preclaimsApi";
import endpoints from "@/components/services/setupsApi";

function MixedServicePost({ id }) {
  const [postAndNatureData, setPostAndNatureData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editRowData, setEditRowData] = useState({});

  useEffect(() => {
    if (id) {
      fetchPostandNature();
    }
  }, [id]);

  const fetchPostandNature = async () => {
    try {
      const res = await apiService.get(
        endpoints.getMixedServiceWorkHistory(id)
      );
      if (res.status === 200) {
        const sortedData = res.data.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setPostAndNatureData(sortedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (index) => {
    setIsEditMode(true);
    setEditRowIndex(index);
    setEditRowData({ ...postAndNatureData[index] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditRowData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveClick = async () => {
    try {
      const updatedData = [...postAndNatureData];
      updatedData[editRowIndex] = editRowData;
      await apiService.post(
        endpoints.updateMixedServiceWorkHistory,
        editRowData
      );
      setPostAndNatureData(updatedData);
      setIsEditMode(false);
      setEditRowIndex(null);
      message.success("Row updated successfully.");
    } catch (error) {
      console.log(error);
      message.error("Failed to update row.");
    }
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setEditRowIndex(null);
    setEditRowData({});
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Post</TableCell>
            <TableCell>Nature of Service</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {postAndNatureData.map((row, index) => (
            <TableRow key={row.id}>
              {isEditMode && editRowIndex === index ? (
                <>
                  <TableCell>
                    <TextField
                      type="date"
                      name="date"
                      value={dayjs(editRowData.date).format("YYYY-MM-DD")}
                      onChange={handleInputChange}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="date"
                      name="enddate"
                      value={dayjs(editRowData.enddate).format("YYYY-MM-DD")}
                      onChange={handleInputChange}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="post"
                      value={editRowData.post}
                      onChange={handleInputChange}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="nature_of_service"
                      value={editRowData.nature_of_service}
                      onChange={handleInputChange}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={handleSaveClick}>
                      <Save />
                    </IconButton>
                    <IconButton onClick={handleCancelClick}>
                      <Cancel />
                    </IconButton>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{dayjs(row.date).format("YYYY-MM-DD")}</TableCell>
                  <TableCell>
                    {dayjs(row.enddate).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>{row.post}</TableCell>
                  <TableCell>{row.nature_of_service}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(index)}>
                      <Edit />
                    </IconButton>
                    <IconButton>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MixedServicePost;
