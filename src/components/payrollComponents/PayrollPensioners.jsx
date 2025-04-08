'use client';
import React, { useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import payrollEndpoints, {
  payrollApiService,
} from '@/components/services/payrollApi';
import { formatNumber } from '@/utils/numberFormatters';
import { message } from 'antd';
import BaseCollapse from '../baseComponents/BaseCollapse';
import PensionerBenefitsTable from '../assessment/assessmentDataCapture/PensionerBenefitsTable';
import AssessmentCard from '../financeComponents/payments/PensionerDetailsTabs';
import endpoints, { apiService } from '../services/setupsApi';
// import AssessmentCard from '../assessment/assessmentDataCapture/AssessmentCard';

const PayrollPensioners = ({ stage, status }) => {
  const columnDefs = [
    {
      field: 'pensionerNo',
      headerName: 'Pensioner Number',
      headerClass: 'prefix-header',
      flex: 1,
      checkboxSelection: true,
      headerCheckboxSelection: true,

      pinned: 'left',
      cellRenderer: (params) => {
        return (
          <p className="text-primary font-semibold underline ">
            {params.data.awardPrefix
              ? params.data.awardPrefix + params.data.pensionerNo
              : params.data.pensionerNo}
          </p>
        );
      },
    },

    {
      field: 'pensionerCode',
      headerName: 'Pensioner Code',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-primary">{params.value}</p>;
      },
    },
    {
      field: 'PensionerName',
      headerName: 'Pensioner Name',
      headerClass: 'prefix-header',
      flex: 1,
      valueGetter: (params) => {
        const firstName = params.data?.firstName || '';
        const surname = params.data?.surname || '';
        const otherName = params.data?.otherName || '';
        return `${firstName} ${surname} ${otherName}`.trim();
      },
    },

    {
      field: 'grossAmount',
      headerName: 'Gross Amount',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return (
          <p className="text-right text-primary">
            {formatNumber(params.value)}
          </p>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClass: 'prefix-header',
      flex: 1,
    },

    {
      field: 'lastPayGrossAmount',

      headerName: 'Last Pay Gross Amount',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
    {
      field: 'lastPayNetAmount',
      headerName: 'Last Pay Net Amount',
      headerClass: 'prefix-header',
      flex: 1,
      cellRenderer: (params) => {
        return <p className="text-right">{formatNumber(params.value)}</p>;
      },
    },
  ];

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      ...item,
      id_claim: item?.coreClaimId,
    }));
  };

  const [selectedRows, setSelectedRows] = React.useState([]);

  const [openAction, setOpenAction] = React.useState(12);

  const baseCardHandlers = {
    admit: async () => {
      try {
        const response = await payrollApiService.post(
          payrollEndpoints.admit(clickedItem.payrollId)
        );
        if (response.status === 200) {
          message.success('Admitted successfully');
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
  };

  const handlers = {
    admit: async () => {
      if (!selectedRows || selectedRows.length === 0) {
        message.warning('No rows selected');
        return;
      }

      for (const row of selectedRows) {
        try {
          const response = await payrollApiService.post(
            payrollEndpoints.admit(row.payrollId)
          );
          if (response.status === 200) {
            message.success('Admitted successfully');
          }
          console.log(response);
        } catch (error) {
          console.log(error);
        } finally {
          setOpenAction((prev) => prev + 1);
        }
      }
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? clickedItem.corePayrollNo
    : 'Create New Main Payroll';

  const fields = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      disabled: true,
    },
    {
      name: 'surname',
      label: 'Surname',
      type: 'text',
      disabled: true,
    },
    {
      name: 'otherName',
      label: 'Other Name',
      type: 'text',
      disabled: true,
    },
    {
      name: 'awardPrefix',
      label: 'Award Prefix',
      type: 'text',
      disabled: true,
    },

    {
      name: 'pensionerNo',
      label: 'Pensioner Number',
      type: 'text',
      disabled: true,
    },
    {
      name: 'pensionerCode',
      label: 'Pensioner Code',
      type: 'text',
      disabled: true,
    },
    {
      name: 'grossAmount',
      label: 'Gross Amount',
      type: 'amount',
      disabled: true,
    },

    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'suspensionStartDate',
      label: 'Suspension Start Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'resumptionDate',
      label: 'Resumption Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'lastPayDate',
      label: 'Last Pay Date',
      type: 'date',
      disabled: true,
    },
    {
      name: 'retirementDate',
      label: 'Retirement Date',
      type: 'date',
      disabled: true,
    },
    // {
    //   name: 'lastPayGrossAmount',
    //   label: 'Last Pay Gross Amount',
    //   type: 'amount',
    //   disabled: true,
    // },
    // {
    //   name: 'lastPayNetAmount',
    //   label: 'Last Pay Net Amount',
    //   type: 'amount',
    //   disabled: true,
    // },
  ];

  const [openViewAll, setOpenViewAll] = React.useState(false);
  const [viewBreakDown, setViewBreakDown] = React.useState(false);
  const [clickedClaim, setClickedClaim] = React.useState(null);

  const fetchProspectivePensionerDetils = async (id) => {
    try {
      const response = await apiService.get(endpoints.getClaimById(id));
      if (response.status === 200) {
        setClickedClaim(response.data.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (clickedItem) {
      fetchProspectivePensionerDetils(clickedItem.coreClaimId);
    }
  }, [clickedItem]);

  return (
    <div className="">
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        isClaim={true}
      >
        {clickedItem ? (
          <div className="">
            <AssessmentCard
              claim={
                clickedClaim
                  ? {
                      ...clickedClaim,
                      prospectivePensionerId:
                        clickedItem?.prospective_pensioner_id,
                      id_claim: clickedItem?.id_claim ?? null,
                    }
                  : null
              }
              clickedItem={clickedClaim?.prospectivePensioner}
              setOpenBaseCard={setOpenBaseCard}
              childTitle="Payroll Details"
              isIgc={false}
              isPayroll={true}
            >
              <BaseCollapse
                name="Pensioner Benefits"
                expandHandler={() =>
                  handleExpand(
                    <PensionerBenefitsTable
                      clickedItem={clickedItem}
                      setViewBreakDown={setViewBreakDown}
                      isExpanded={true}
                    />,
                    'Pensioner Benefits'
                  )
                }
              >
                <PensionerBenefitsTable
                  coreBenefitId={clickedItem?.coreBenefitId}
                  clickedItem={clickedItem}
                  setViewBreakDown={setViewBreakDown}
                />
              </BaseCollapse>
              <BaseCollapse className="mt-4" name="Payroll Details">
                <div className="flex flex-col gap-2 px-4">
                  <div className=" overflow-y-auto ">
                    <BaseInputCard
                      fields={fields}
                      apiEndpoint={payrollEndpoints.updateVendorPostingGroup}
                      postApiFunction={payrollApiService.post}
                      clickedItem={clickedItem}
                      useRequestBody={true}
                      setOpenBaseCard={setOpenBaseCard}
                    />
                  </div>
                </div>
              </BaseCollapse>
            </AssessmentCard>
          </div>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={payrollEndpoints.addVendorPostingGroup}
            postApiFunction={payrollApiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <BaseTable
        openAction={openAction}
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={payrollEndpoints.getAllPayrollPensinoers}
        fetchApiService={payrollApiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Pensioners Listing"
        currentTitle="Pensioners List"
        isPayroll={true}
        onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
      />
    </div>
  );
};

export default PayrollPensioners;
