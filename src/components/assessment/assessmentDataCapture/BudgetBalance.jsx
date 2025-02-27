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

import BaseEmptyComponent from '@/components/baseComponents/BaseEmptyComponent';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import { message } from 'antd';

function BudgetBalance({
  clickedItem,
  computed,
  setViewBreakDown,
  isExpanded,
}) {
  const [qualifyingService, setQualifyingService] = useState([]);
  const columnDefs = [
    {
      field: 'accountName',
      headerName: 'Account Name',
      headerClass: 'prefix-header',
      filter: true,
      width: 250,
      pinned: 'left',
    },
    {
      headerName: 'Budget Amount',
      field: 'budgetAmount',
      flex: 1,
      filter: true,
      cellRenderer: (params) => {
        return (
          <p className="text-primary font-semibold ">
            {formatNumber(params.value)}
          </p>
        );
      },
    },
    {
      field: 'spentAmount',
      headerName: 'Spent Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'budgetBalance',
      headerName: 'Budget Balance',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    },
    {
      field: 'isBlocked',
      headerName: 'Is Blocked',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return params.value ? 'Yes' : 'No';
      },
    },
    // {
    //   field: 'stage',
    //   headerName: 'Stage',
    //   headerClass: 'prefix-header',
    //   filter: true,
    //   flex: 1,
    //   valueFormatter: (params) => {
    //     return params.value === 1 ? 'Pending' : 'Approved';
    //   },
    // },
  ];

  const getClaimQualifyingService = async () => {
    try {
      const res = await assessApiService.get(
        assessEndpoints.getPensionerBenefits(clickedItem?.id_claim)
      );

      const data = res.data.data.map((item) => {
        return {
          ...item,
          pensionAward: item?.pensionAward.name,
          pensioner_number: item?.pensioner_award_code,
        };
      });

      await getCOBBudgetBalance(data[0]?.pension_award_id);
    } catch (error) {
      console.log('Error getting pensioner Benefits >>>>>>>>>>>:', error);
    }
  };

  const getCOBBudgetBalance = async (id) => {
    try {
      const res = await apiService.get(financeEndpoints.getCOBBudget(id));
      const data = res.data.data;

      if (res.status === 200 && res.data.data && res.data.succeeded) {
      } else if (res.status === 200 && res.data.messages[0]) {
        message.error(res.data.messages[0]);
      }

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

  const fields = [
    {
      name: 'accountName',
      label: 'Account Name',
      type: 'text',
      required: true,
      disabled: true,
    },
    {
      name: 'budgetAmount',
      label: 'Budget Amount',
      type: 'number',
      required: true,
      disabled: true,
    },
    {
      name: 'spentAmount',
      label: 'Spent Amount',
      type: 'number',
      required: true,
      disabled: true,
    },
    {
      name: 'budgetBalance',
      label: 'Budget Balance',
      type: 'number',
      required: true,
      disabled: true,
    },
    {
      name: 'isBlocked',
      label: 'Is Blocked',
      type: 'text',
      required: true,
      disabled: true,
    },
  ];

  const handlers = {
    viewComputationBreakdown: () => setViewBreakDown(true),
    edit: () => console.log('Edit clicked'),
    delete: () => console.log('Delete clicked'),
    reports: () => console.log('Reports clicked'),
  };

  return (
    <div
      style={{
        height: isExpanded ? '60vh' : '150px',
      }}
      className="ag-theme-quartz mt-5 px-9"
    >
      <BaseCard
        openBaseCard={openBaseCard}
        isSecondaryCard2={true}
        setOpenBaseCard={setOpenBaseCard}
        //handlers={baseCardHandlers}
        title={'Benefits Details'}
        clickedItem={clickedRow}
        status={4}
        isUserComponent={false}
        deleteApiEndpoint={endpoints.deleteDepartment(clickedItem?.id)}
        deleteApiService={apiService.post}
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
        rowData={qualifyingService}
        pagination={false}
        domLayout="normal"
        alwaysShowHorizontalScroll={true}
        noRowsOverlayComponent={BaseEmptyComponent}
        onGridReady={(params) => {
          params.api.sizeColumnsToFit();
          onGridReady(params);
          //  gridApiRef.current.api.showLoadingOverlay();
        }}
        className="custom-grid ag-theme-quartz"
        rowSelection="multiple"
        // onSelectionChanged={onSelectionChanged}
        onRowClicked={(e) => {
          setOpenBaseCard(true);
          console.log('e.data', e.data);
          //   setOpenBaseCard(true);
          setClickedRow(e.data);
        }}
      />
    </div>
  );
}

export default BudgetBalance;
