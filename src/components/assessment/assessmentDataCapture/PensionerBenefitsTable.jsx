import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import BaseLoadingOverlay from '@/components/baseComponents/BaseLoadingOverlay';
import React, { use, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import assessEndpoints, {
  assessApiService,
} from '@/components/services/assessmentApi';
import { parseDate } from '@/utils/dateFormatter';
import { formatNumber } from '@/utils/numberFormatters';
import BaseCard from '@/components/baseComponents/BaseCard';
import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints from '@/components/services/setupsApi';
import { apiService } from '@/components/services/api';
import BaseEmptyComponent from '@/components/baseComponents/BaseEmptyComponent';
import { Dialog, IconButton } from '@mui/material';
import { AttachFile } from '@mui/icons-material';
import AppendixReport from '../reports/AppendixReport';
import MaintenanceAppendix from '../reports/MaintenanceAppendix';
import DependantsReport from '../reports/DependantsReport';

function PensionerBenefitsTable({
  clickedItem,
  computed,
  setViewBreakDown,
  isExpanded,
  coreBenefitId,
}) {
  const [qualifyingService, setQualifyingService] = useState([]);
  const columnDefs = [
    {
      field: 'pensionAward',
      headerName: 'Pension Award',
      headerClass: 'prefix-header',
      filter: true,
      width: 250,
      pinned: 'left',
    },
    {
      headerName: 'Pensioner Number',
      field: 'pensioner_number',
      width: 200,
      filter: true,
      cellRenderer: (params) => {
        return <p className="text-primary font-semibold ">{params.value}</p>;
      },
    },
    {
      field: 'net_amount',
      headerName: 'Net Amount',
      headerClass: 'prefix-header',
      filter: true,
      width: 200,

      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'gross_amount',
      headerName: 'Gross Amount',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'lumpsum_amount',
      headerName: 'Lumpsum Amount',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'monthly_pension',
      headerName: 'Monthly Pension',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,

      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'total_liability_amount',
      headerName: 'Total Liability Amount',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'total_pensioner_refund_amount',
      headerName: 'Total Pensioner Refund Amount',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'lumpsum_tax_amount',
      headerName: 'Lumpsum Tax Amount',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'monthly_tax_amount',
      headerName: 'Monthly Tax Amount',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'annual_allowance',
      headerName: 'Annual Allowance',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'document_status',
      headerName: 'Document Status',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,
    },
    {
      field: 'finance_update',
      headerName: 'Finance Update',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,
    },
  ];

  const getClaimQualifyingService = async () => {
    try {
      const res = await assessApiService.get(
        assessEndpoints.getPensionerBenefits(clickedItem?.id_claim)
      );

      const data = res.data.data.map((item) => {
        return {
          ...item,
          pensionAwardObj: item?.pensionAward,
          pensionAward: item?.pensionAward.name,
          pensioner_number: item?.pensioner_award_code,
        };
      });
      setQualifyingService(data);
    } catch (error) {
      console.log('Error getting pensioner Benefits >>>>>>>>>>>:', error);
    }
  };
  useEffect(() => {
    getClaimQualifyingService();
  }, []);

  useEffect(() => {
    getClaimQualifyingService();
  }, [computed]);
  const [rowData, setRowData] = useState([]);
  const gridApiRef = useRef(null);

  const [gridApi, setGridApi] = useState(null);

  const loadingOverlayComponentParams = useMemo(() => {
    return { loadingMessage: 'Loading...' };
  }, []);
  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params;
    params.api.sizeColumnsToFit();
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [clickedRow, setClickedRow] = React.useState(null);
  const [openReport, setOpenReport] = React.useState(false);

  const fields = [
    {
      name: 'pensionAward',
      label: 'Pension Award',
      type: 'text',
      required: true,
      disabled: true,
    },
    {
      name: 'pensioner_number',
      label: 'Pensioner Number',
      type: 'text',
      required: true,
      disabled: true,
    },
    {
      name: 'net_amount',
      label: 'Net Amount',
      type: 'amount',
      required: true,
      disabled: true,
    },
    {
      name: 'gross_amount',
      label: 'Gross Amount',
      type: 'amount',
      required: true,
      disabled: true,
    },
    {
      name: 'lumpsum_amount',
      label: 'Lumpsum Amount',
      type: 'amount',
      required: true,
      disabled: true,
    },
    {
      name: 'monthly_pension',
      label: 'Monthly Pension',
      type: 'amount',
      required: true,
      disabled: true,
    },
    {
      name: 'total_liability_amount',
      label: 'Total Liability Amount',
      type: 'amount',
      required: true,
      disabled: true,
    },
    {
      name: 'total_pensioner_refund_amount',
      label: 'Total Pensioner Refund Amount',
      type: 'amount',
      required: true,
      disabled: true,
    },
    {
      name: 'lumpsum_tax_amount',
      label: 'Lumpsum Tax Amount',
      type: 'amount',
      required: true,
      disabled: true,
    },
    {
      name: 'monthly_tax_amount',
      label: 'Monthly Tax Amount',
      type: 'amount',
      required: true,
      disabled: true,
    },
    {
      name: 'annual_allowance',
      label: 'Annual Allowance',
      type: 'amount',
      required: true,
      disabled: true,
    },
    {
      name: 'document_status',
      label: 'Document Status',
      type: 'number',
      required: true,
      disabled: true,
    },
    {
      name: 'finance_update',
      label: 'Finance Update',
      type: 'switch',
      required: true,
      disabled: true,
    },
  ];

  const handlers = {
    viewComputationBreakdown: () => setViewBreakDown(true),
    generateReport: () => {
      clickedRow && clickedRow.pensionAwardObj?.code === 52
        ? setOpenReport('maintenance')
        : clickedRow && clickedRow.pensionAwardObj?.code === 47
        ? setOpenReport('dependant')
        : setOpenReport('pensioner');
    },
  };

  return (
    <div
      style={{
        height: isExpanded ? '60vh' : '150px',
      }}
      className="ag-theme-quartz mt-5 px-9 relative"
    >
      <Dialog
        open={openReport}
        onClose={() => setOpenReport(false)}
        sx={{
          '& .MuiPaper-root': {
            minHeight: '90vh',
            maxHeight: '85vh',
            minWidth: '45vw',
            maxWidth: '55vw',
          },
          zIndex: 99999,
        }}
      >
        {openReport === 'maintenance' ? (
          <div className="flex-grow overflow-hidden">
            <MaintenanceAppendix
              setOpenGratuity={setOpenReport}
              clickedItem={clickedItem}
              clickedBenefit={clickedRow}
            />
          </div>
        ) : openReport === 'pensioner' ? (
          <div className="flex-grow overflow-hidden">
            <AppendixReport
              setOpenGratuity={setOpenReport}
              clickedItem={clickedItem}
              clickedBenefit={clickedRow}
            />
          </div>
        ) : openReport === 'dependant' ? (
          <>
            <DependantsReport
              setOpenGratuity={setOpenReport}
              clickedItem={clickedItem}
              clickedBenefit={clickedRow}
            />
          </>
        ) : (
          <></>
        )}
      </Dialog>
      <BaseCard
        openBaseCard={openBaseCard}
        isSecondaryCard2={true}
        setOpenBaseCard={setOpenBaseCard}
        //handlers={baseCardHandlers}
        title={'Benefits Details'}
        clickedItem={clickedRow}
        status={4}
        isUserComponent={false}
        handlers={handlers}
      >
        <BaseInputCard
          fields={fields}
          apiEndpoint={endpoints.createDepartment}
          postApiFunction={apiService.post}
          clickedItem={clickedRow}
          useRequestBody={true}
          setOpenBaseCard={setOpenBaseCard}
        />
      </BaseCard>

      <AgGridReact
        columnDefs={columnDefs}
        rowData={
          coreBenefitId
            ? qualifyingService.filter((item) => item.id === coreBenefitId)
            : qualifyingService
        }
        pagination={false}
        domLayout="normal"
        alwaysShowHorizontalScroll={true}
        noRowsOverlayComponent={BaseEmptyComponent}
        onGridReady={(params) => {
          params.api.sizeColumnsToFit();
          onGridReady(params);
          //  gridApiRef.current.api.showLoadingOverlay();
        }}
        className="custom-grid ag-theme-quartz pr-2"
        rowSelection="multiple"
        // onSelectionChanged={onSelectionChanged}
        onRowClicked={(e) => {
          setOpenBaseCard(true);
          console.log('e.data', e.data);
          //   setOpenBaseCard(true);
          setClickedRow(e.data);
        }}
      />

      {/* <div className="mt-4 absolute left-0 top-10">
        {qualifyingService.map((row, index) => (
          <div key={index} className="flex justify-end mb-1">
       
            <IconButton>
              <AttachFile
                sx={{
                  color: '#006990',
                  fontSize: '1.5rem',
                }}
              />
            </IconButton>
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default PensionerBenefitsTable;
