import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { message } from "antd";

function TermsOfServiceCard({ openBaseCard, clickedItem }) {
  const [termsOfService, setTermsOfService] = useState([]);
  const [capsTerm, setCapsTerm] = useState([...clickedItem.termsOfService]);

  const getTermsOfService = async () => {
    try {
      const response = await apiService.get(endpoints.termsOfService);
      setTermsOfService(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTermsOfService();
  }, []);

  const isChecked = (term) => {
    return capsTerm.some(
      (clickedTerm) =>
        clickedTerm.id === term.id || clickedTerm.name === term.name
    );
  };

  const assignDeassignCapTerms = async (term) => {
    try {
      const response = await apiService.post(
        endpoints.assignCaptermsOfservice,
        {
          pension_cap_id: clickedItem.id,
          terms_id: term.id,
        }
      );
      console.log(response);
      if (response.status === 200 && response.data.succeeded) {
        message.success("Pension Cap updated successfully");
        updateCapsTerm(term);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCapsTerm = (term) => {
    setCapsTerm((prevTerms) => {
      if (isChecked(term)) {
        return prevTerms.filter((clickedTerm) => clickedTerm.id !== term.id);
      } else {
        return [...prevTerms, term];
      }
    });
  };

  const handleCheckboxClick = (term) => async () => {
    await assignDeassignCapTerms(term);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Assigned</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {termsOfService.map((term, index) => (
            <TableRow key={term.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{term.name}</TableCell>
              <TableCell>{term.description}</TableCell>
              <TableCell>
                <Checkbox
                  checked={isChecked(term)}
                  onChange={handleCheckboxClick(term)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TermsOfServiceCard;
