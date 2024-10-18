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

function AwardsTable({ clickedItem, computed }) {
  const [qualifyingService, setQualifyingService] = useState([]);
  const columnDefs = [
    {
      field: 'qualifying_service_date_of_joining',
      headerName: 'Date of Joining',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return parseDate(params.value);
      },
    },

    {
      field: 'net_amount',
      headerName: 'Net Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'gross_amount',
      headerName: 'Gross Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'lumpsum_amount',
      headerName: 'Lumpsum Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'monthly_pension',
      headerName: 'Monthly Pension',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'total_liability_amount',
      headerName: 'Total Liability Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'total_pensioner_refund_amount',
      headerName: 'Total Pensioner Refund Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'lumpsum_tax_amount',
      headerName: 'Lumpsum Tax Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'monthly_tax_amount',
      headerName: 'Monthly Tax Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'annual_allowance',
      headerName: 'Annual Allowance',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'document_status',
      headerName: 'Document Status',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'finance_update',
      headerName: 'Finance Update',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
  ];

  const getClaimQualifyingService = async () => {
    try {
      const res = await assessApiService.get(
        assessEndpoints.getPensionerBenefits(clickedItem?.id_claim)
      );

      setQualifyingService(res.data.data);
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

  return (
    <div className="ag-theme-quartz h-[150px] mt-5 px-9">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={qualifyingService}
        pagination={false}
        domLayout="normal"
        alwaysShowHorizontalScroll={true}
        // alwaysShowVerticalScroll={true}

        // loadingOverlayComponent={BaseLoadingOverlay} // Use your custom loader
        // loadingOverlayComponentParams={loadingOverlayComponentParams}
        // paginationPageSize={pageSize}
        onGridReady={(params) => {
          params.api.sizeColumnsToFit();
          onGridReady(params);
          //  gridApiRef.current.api.showLoadingOverlay();
        }}
        rowSelection="multiple"
        // onSelectionChanged={onSelectionChanged}
        onRowClicked={(e) => {
          console.log('e.data', e.data);
          //   setOpenBaseCard(true);
          //   setClickedItem(e.data);
        }}
      />
    </div>
  );
}

export default AwardsTable;
