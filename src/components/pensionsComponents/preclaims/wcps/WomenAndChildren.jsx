import React, { useEffect, useState } from "react";

// Assume this is your transformation function
import BaseTable from "@/components/baseComponents/BaseTable";
import BaseCard from "@/components/baseComponents/BaseCard";

import BaseInputCard from "@/components/baseComponents/BaseInputCard";
import endpoints, { apiService } from "@/components/services/setupsApi";
import { formatDate } from "@/utils/dateFormatter";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useMda } from "@/context/MdaContext";
import WcpsCard from "./WcpsCard";

const columnDefs = [
  {
    field: "no",
    headerName: "No",
    headerClass: "prefix-header",
    width: 90,
    filter: true,
    pinned: "left",
  },
  {
    field: "reference_number",
    headerName: "Reference Number",
    width: 150,
    filter: true,
  },
  {
    field: "effective_date",
    headerName: "Effective Date",
    width: 150,
    filter: true,
  },
];

const WomenAndChildren = (id) => {
  const [rowData, setRowData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; // Number of records per page

  const transformData = (data, pageNumber = 1, pageSize = 10) => {
    return data.map((item, index) => ({
      id: item.id,
      no: index + 1,
      reference_number: item.reference_number,
      effective_date: formatDate(item.effective_date),
    }));
  };

  //

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const [selectedBank, setSelectedBank] = React.useState(null);
  const [mdas, setMdas] = useState([]);
  const fetchMdas = async () => {
    try {
      const res = await apiService.get(endpoints.mdas, {
        paging: { pageNumber, pageSize: 200 },
      });
      const { data, totalCount } = res.data;
      setMdas(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const title = clickedItem
    ? "WCPS Contribution"
    : "Add a New WCPS Contribution";

  const { mdaId } = useMda();

  const fields = [
    {
      name: "reference_number",
      label: "Reference Number",
      type: "text",
      required: true,
    },
    {
      name: "effective_date",
      label: "Effective Date",
      type: "date",
      required: true,
    },
  ];

  const [filteredData, setFilteredData] = useState([]);

  const gridApiRef = React.useRef(null);

  const [openFilter, setOpenFilter] = useState(false);

  const fetchMaintenance = async () => {
    try {
      const res = await apiService.get(endpoints.getWcps(id.id));
      const data = res.data.data;
      setFilteredData(transformData(data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);
  useEffect(() => {
    fetchMaintenance();
  }, [openBaseCard]);

  useEffect(() => {
    fetchMdas();
  }, []);

  return (
    <div className="relative">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={endpoints.deleteWcps(id?.id)}
        deleteApiService={apiService.post}
        isSecondaryCard={true}
      >
        {clickedItem ? (
          <WcpsCard
            fields={fields}
            apiEndpoint={endpoints.updateWcps}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
          />
        ) : (
          <BaseInputCard
            id={id}
            idLabel="prospective_pensioner_id"
            fields={fields}
            apiEndpoint={endpoints.createWcps}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            isBranch={false}
          />
        )}
      </BaseCard>

      <Button
        variant="contained"
        onClick={() => {
          setOpenBaseCard(true);
          setClickedItem(null);
        }}
        sx={{
          my: 2,
        }}
      >
        Add WCPS Contribution
      </Button>

      <div
        className="ag-theme-quartz"
        style={{
          height: "60vh",

          mt: "20px",

          overflowY: "auto",
        }}
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={filteredData}
          pagination={false}
          domLayout="autoHeight"
          alwaysShowHorizontalScroll={true}
          // paginationPageSize={pageSize}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
            // onGridReady(params);
          }}
          // onPaginationChanged={(params) =>
          //   handlePaginationChange(params.api.paginationGetCurrentPage() + 1)
          // }
          onRowClicked={(e) => {
            setOpenBaseCard(true);
            setClickedItem(e.data);
            // setUserClicked(e.data);
            //handleClickUser(e.data);
          }}
        />
      </div>
    </div>
  );
};

export default WomenAndChildren;
