import React, { useState, useEffect } from "react";
import { Table, message } from "antd";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import endpoints, { apiService } from "@/components/services/setupsApi";

function NumberingSections() {
  const [numberingSections, setNumberingSections] = useState([]);
  const [numberSeriesOptions, setNumberSeriesOptions] = useState([]);
  const [editableRows, setEditableRows] = useState({});
  const [saveEnabled, setSaveEnabled] = useState(false);

  useEffect(() => {
    getNumberingSections();
    getNumberSeriesOptions();
  }, []);

  const getNumberingSections = async () => {
    try {
      const response = await apiService.get(endpoints.getNumberingSections, {
        "paging.pageSize": 1000,
      });
      setNumberingSections(response.data.data);
    } catch (error) {
      console.error("Error fetching numbering sections:", error);
    }
  };

  const getNumberSeriesOptions = async () => {
    try {
      const response = await apiService.get(endpoints.getNumberSeries, {
        "paging.pageSize": 1000,
      });
      setNumberSeriesOptions(response.data.data);
    } catch (error) {
      console.error("Error fetching number series options:", error);
    }
  };

  const handleNumberSeriesChange = (value, record) => {
    const updatedRows = {
      ...editableRows,
      [record.id]: value,
    };
    setEditableRows(updatedRows);
    setSaveEnabled(true);
  };

  const saveChanges = async () => {
    try {
      const updateRequests = Object.keys(editableRows).map((id) => {
        const numberSeriesId = editableRows[id];
        const numberingSection = numberingSections.find(
          (section) => section.id === id
        );
        return apiService.put(endpoints.editNumberingSection, {
          id,
          numberSeriesId,
        });
      });

      await Promise.all(updateRequests);
      message.success("Changes saved successfully");
      setSaveEnabled(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const renderSelect = (text, record) => (
    <FormControl variant="outlined" fullWidth>
      <Select
        value={editableRows[record.id] || text?.id || ""}
        onChange={(event) =>
          handleNumberSeriesChange(event.target.value, record)
        }
        size="small"
        sx={{ width: "200px" }}
      >
        {numberSeriesOptions.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.code}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
    },
    {
      title: "Number Series",
      dataIndex: "numberSeries",
      key: "numberSeries",
      render: (text, record) => renderSelect(text, record),
    },
  ];

  return (
    <div className="pt-4">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={numberingSections}
        pagination={false}
        style={{
          borderCollapse: "collapse",
        }}
        components={{
          header: {
            cell: (props) => (
              <th
                {...props}
                style={{
                  ...props.style,
                  // Header background color
                  color: "#333", // Header text color
                  fontWeight: "bold", // Header font weight
                }}
              />
            ),
          },
          body: {
            row: (props) => (
              <tr
                {...props}
                style={{
                  ...props.style,
                  height: "40px", // Adjust row height
                }}
              />
            ),
            cell: (props) => (
              <td
                {...props}
                style={{
                  ...props.style,
                  padding: "8px", // Adjust cell padding
                }}
              />
            ),
          },
        }}
      />
      <Button
        variant="contained"
        onClick={saveChanges}
        disabled={!saveEnabled}
        sx={{ marginTop: 5 }}
      >
        Save
      </Button>
    </div>
  );
}

export default NumberingSections;
