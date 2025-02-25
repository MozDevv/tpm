import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { formatDate } from '@/utils/dateFormatter';
import { formatNumber } from '@/utils/numberFormatters';
import BaseTabs from '@/components/baseComponents/BaseTabs';
import PayrollPensionerDetails from '@/components/payrollComponents/payrollRun/PayrollPensionerDetails';
import PayrollLines from './PayrollLines';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import endpoints from '@/components/services/api';
import PayrollDeductions from './PayrollDeductions';
import { Dialog } from '@mui/material';
import PVActions from '../payments/PVActions';

const PayrollRecords = () => {
  const columnDefs = [
    {
      field: 'period',
      headerName: 'Period',
      headerClass: 'prefix-header',
      filter: true,
      width: 150,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
      cellRenderer: (params) => {
        return (
          <p className="text-primary font-semibold underline ">
            {params.value}
          </p>
        );
      },
    },
    {
      field: 'totalGross',
      headerName: 'Total Gross',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },

      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'totalNet',
      headerName: 'Total Net',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      cellRenderer: (params) => {
        return (
          <p className="text-right text-primary font-semibold">
            {formatNumber(params.value)}
          </p>
        );
      },
    },
    {
      field: 'totalDeductions',
      headerName: 'Total Deductions',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'totalTaxDeductions',
      headerName: 'Total Tax Deductions',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },

    {
      field: 'totalIndividualDeductions',
      headerName: 'Total Individual Deductions',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'totalGrossArrears',
      headerName: 'Total Gross Arrears',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'totalNetArrears',
      headerName: 'Total Net Arrears',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'totalArrearsDeductions',
      headerName: 'Total Arrears Deductions',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      cellStyle: {
        textAlign: 'left',
      },
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
  ];

  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      ...item,
    }));
  };
  const [openPV, setOpenPV] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const handlers = {
    createPayrollPaymentVoucher: () => {
      setOpenPV(true);
    },
  };

  const baseCardHandlers = {
    createPayrollPaymentVoucher: () => {
      setOpenPV(true);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);
  const handleSelectionChange = (selectedRows) => {
    console.log('Selected rows in ParentComponent:', selectedRows);
    setSelectedRows(selectedRows);
  };

  const title = clickedItem ? clickedItem?.period : 'Create New Department';

  const fields = [
    {
      name: 'period',
      label: 'Period',
      type: 'text',
      disabled: true,
    },
    {
      name: 'totalGross',
      label: 'Total Gross',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalNet',
      label: 'Total Net',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalDeductions',
      label: 'Total Deductions',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalTaxDeductions',
      label: 'Total Tax Deductions',
      type: 'amount',
      disabled: true,
    },

    {
      name: 'totalIndividualDeductions',
      label: 'Total Individual Deductions',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalGrossArrears',
      label: 'Total Gross Arrears',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalNetArrears',
      label: 'Total Net Arrears',
      type: 'amount',
      disabled: true,
    },
    {
      name: 'totalArrearsDeductions',
      label: 'Total Arrears Deductions',
      type: 'amount',
      disabled: true,
    },
  ];

  const tabPanes = [
    {
      key: '1',
      title: 'Payroll Summary',
      content: (
        <div>
          <BaseInputCard
            fields={fields}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
            disableAll={true}
          />
        </div>
      ),
    },
    {
      key: '2',
      title: 'Payroll Lines',
      content: (
        <div>
          <div className="pt-2">
            <PayrollLines payrollLines={clickedItem?.payrollLines} />
          </div>
        </div>
      ),
    },
    {
      key: '3',
      title: 'Payroll Deductions',
      content: (
        <div>
          <div className="pt-2">
            <PayrollDeductions payrollLines={clickedItem?.payrollDeductions} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <Dialog
        open={(openPV && selectedRows.length > 0) || (openPV && clickedItem)}
        onClose={() => {
          setOpenPV(false);
        }}
        fullWidth
        maxWidth="sm"
        sx={{
          padding: '20px',
          maxHeight: '90vh',
          zIndex: 999999999,
        }}
      >
        <PVActions
          status={7}
          clickedItem={clickedItem}
          setOpenBaseCard={setOpenBaseCard}
          selectedRows={selectedRows.length > 0 ? selectedRows : [clickedItem]}
          setOpenPostGL={setOpenPV}
          setSelectedRows={setSelectedRows}
        />
      </Dialog>
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
      >
        {clickedItem ? <BaseTabs tabPanes={tabPanes} /> : <></>}
      </BaseCard>
      <BaseTable
        openPostToGL={openPV}
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        onSelectionChange={handleSelectionChange}
        fetchApiEndpoint={financeEndpoints.getPayrollSummaries}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Payroll Records"
        currentTitle="Payroll Records"
      />
    </div>
  );
};

export default PayrollRecords;
