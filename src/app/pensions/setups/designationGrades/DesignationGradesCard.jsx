import React, { useEffect, useState } from "react";
import { message, Tabs } from "antd";
import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import Grades from "./Grades";
import { AgGridReact } from "ag-grid-react";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { Button, Dialog, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
// import MapPensionerAwards from "./MapPensionerAwards";

const { TabPane } = Tabs;

function DesignationGradesCard({
  fields,
  apiEndpoint,
  postApiFunction,
  clickedItem,
  setOpenBaseCard,
  useRequestBody,
}) {
  const [retireeId, setRetireeId] = useState(null);
  const [activeKey, setActiveKey] = useState("1");

  const activeRetireeId = [];
  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const moveToNextTab = () => {
    const nextTab = (parseInt(activeKey, 10) + 1).toString();
    console.log("Moving to next tab:", nextTab); // Debug line
    setActiveKey(nextTab);
  };

  const moveToPreviousTab = () => {
    const prevTab = (parseInt(activeKey, 10) - 1).toString();
    setActiveKey(prevTab);
  };

  const [grades, setGrades] = useState([]);

  const fetchGrades = async () => {
    try {
      const res = await apiService.get(endpoints.getGrades(clickedItem.id));
      if (res.status === 200) {
        setGrades(
          res.data.data.map((item, index) => ({ ...item, no: index + 1 }))
        );

        console.log(res.data.data);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const gradeColDefs = [
    {
      field: "no",
      headerName: "No",
      headerClass: "prefix-header",
      width: 180,
      filter: true,
    },
    {
      field: "grade",
      headerName: "Grade",
      headerClass: "prefix-header",
      width: 180,
      filter: true,
    },
  ];

  const [openCreateGrade, setOpenCreateGrade] = useState(false);
  const [grade, setGrade] = useState("");

  const handleCreateGrade = async () => {
    const data = {
      designation_id: clickedItem.id,
      grade: grade,
    };
    try {
      const res = await apiService.post(endpoints.createGrade, data);
      if (res.status === 200) {
        message.success("Grade added successfully");
        fetchGrades();
        setOpenCreateGrade(false);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  return (
    <div className="p-2 h-[100vh] max-h-[100vh] overflow-auto mt-2">
      <div>
        <div>
          <div className="px-5 mt-[-20px]">
            <Tabs
              activeKey={activeKey}
              onChange={handleTabChange}
              className="!bg-transparent" // Remove default background
              tabBarExtraContent={<div className="!bg-primary h-1" />} // Custom ink bar style
            >
              <TabPane
                tab={
                  <span className="text-primary font-montserrat">
                    Designation Information
                  </span>
                }
                key="1"
              >
                <div className="">
                  <BaseInputCard
                    fields={fields}
                    apiEndpoint={apiEndpoint}
                    postApiFunction={postApiFunction}
                    clickedItem={clickedItem}
                    setOpenBaseCard={setOpenBaseCard}
                    useRequestBody={true}
                  />
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span className="text-primary font-montserrat">Grades</span>
                }
                key="2"
              >
                <Button
                  variant="text"
                  sx={{
                    my: 2,
                  }}
                  startIcon={<Add />}
                  onClick={() => setOpenCreateGrade(true)}
                >
                  Add Grade
                </Button>
                <Dialog
                  open={openCreateGrade}
                  onClose={() => setOpenCreateGrade(false)}
                  sx={{
                    "& .MuiDialog-paper": {
                      height: "250px",
                      width: "500px",
                      padding: "20px",
                    },
                  }}
                >
                  <div className="">
                    <h2 className="text-lg text-primary font-semibold mb-4">
                      Add Grade
                    </h2>
                    <label className="text-xs font-semibold text-gray-600">
                      Grade
                    </label>
                    <TextField
                      type="text"
                      variant="outlined"
                      size="small"
                      fullWidth
                      name="name"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleCreateGrade}
                      sx={{
                        mt: 7,
                      }}
                    >
                      Add Grade
                    </Button>
                  </div>
                </Dialog>

                <div className="ag-theme-quartz w-full h-full">
                  {" "}
                  <AgGridReact
                    columnDefs={gradeColDefs}
                    rowData={grades}
                    domLayout="autoHeight"
                  />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignationGradesCard;
