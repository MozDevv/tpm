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
import BaseApprovalCard from '../baseComponents/BaseApprovalCard';
import {
  useSelectedSegmentStore,
  useSelectedSegmentStore2,
} from '@/zustand/store';
// import AssessmentCard from '../assessment/assessmentDataCapture/AssessmentCard';

const PayrollPensioners = ({
  isImported,
  clickedItemParent,
  openClickedPensioner,
  setOpenClickedPensioner,
}) => {
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
      cellRenderer: (params) => {
        const statusMap = {
          0: { label: 'Unadmitted', color: '#007bff' }, // Blue
          1: { label: 'Active', color: '#28a745' }, // Bright Green
          2: { label: 'Suspended', color: '#ffc107' }, // Yellow
          3: { label: 'Inactive', color: '#dc3545' }, // Bright Red
          4: { label: 'Stopped', color: '#6f42c1' }, // Violet
          5: { label: 'Deleted', color: '#000000' }, // Black
          6: { label: 'Pending Admission', color: '#17a2b8' }, // Cyan
          7: { label: 'Admission Rejected', color: '#ff6347' }, // Tomato Red
        };

        const status = statusMap[params.value] || {
          label: 'Unknown',
          color: 'gray',
        };

        return (
          <span
            style={{
              color: status.color,
              fontWeight: 'bold',
              textAlign: 'center',
              display: 'inline-flex', // Use inline-flex for alignment
              alignItems: 'center', // Vertically center the text
              justifyContent: 'center', // Horizontally center the text
              width: '100%', // Ensure it takes the full width of the cell
              height: '100%', // Ensure it takes the full height of the cell
            }}
          >
            {status.label}
          </span>
        );
      },
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
  const [openApprove, setOpenApprove] = React.useState(0);
  const [clickedItem, setClickedItem] = React.useState(null);
  const [workFlowChange, setWorkFlowChange] = React.useState(0);

  const { selectedSegment2 } = useSelectedSegmentStore2();

  const baseCardHandlers = {
    ...(selectedSegment2 === 0 && {
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
    }),
    ...(clickedItem?.status === 6 && {
      approvalRequest: () => console.log('Approval Request clicked'),
      sendApprovalRequest: () => setOpenApprove(1),
      cancelApprovalRequest: () => setOpenApprove(2),
      approveDocument: () => setOpenApprove(3),
      rejectDocumentApproval: () => setOpenApprove(4),
      delegateApproval: () => {
        setOpenApprove(5);
        setWorkFlowChange(Date.now());
      },
    }),
  };

  const handlers = {
    ...(selectedSegment2 === 0 && {
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
    }),
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);

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

  useEffect(() => {
    if (clickedItemParent) {
      setClickedItem(clickedItemParent);
      fetchProspectivePensionerDetils(clickedItemParent?.coreClaimId);
    }
  }, [clickedItemParent]);

  const segmentOptions = [
    // { label: 'All', value: -1 },
    { label: 'Main Payroll', value: 0 },
    { label: 'Injury Payroll', value: 1 },
    { label: 'Dependent Payroll', value: 2 },
    { label: 'Agency Payroll', value: 3 },
  ];
  const segmentOptions2 = [
    { label: 'All', value: -1 },
    { label: 'Unadmitted', value: 0 },
    { label: 'Active', value: 1 },
    { label: 'Suspended', value: 2 },
    { label: 'Inactive', value: 3 },
    { label: 'Stopped', value: 4 },
    { label: 'Deleted', value: 5 },
    { label: 'Pending Admission', value: 6 },
    { label: 'Admission Rejected', value: 7 },
  ];
  return (
    <div className="">
      <BaseApprovalCard
        openApprove={openApprove}
        setOpenApprove={setOpenApprove}
        documentNo={
          selectedRows.length > 0
            ? selectedRows.map((item) => item.documentNo)
            : clickedItem
            ? [clickedItem.documentNo]
            : []
        }
      />
      {isImported ? (
        <>
          <BaseCard
            openBaseCard={openClickedPensioner}
            setOpenBaseCard={setOpenClickedPensioner}
            handlers={baseCardHandlers}
            title={title}
            clickedItem={clickedItem}
            isUserComponent={false}
            isClaim={true}
            isSecondaryCard2={true}
          >
            {clickedItem ? (
              <div className="h-[60vh] overflow-y-auto">
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
                          apiEndpoint={
                            payrollEndpoints.updateVendorPostingGroup
                          }
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
        </>
      ) : (
        <>
          {' '}
          <BaseCard
            openBaseCard={openBaseCard}
            setOpenBaseCard={setOpenBaseCard}
            handlers={baseCardHandlers}
            title={title}
            clickedItem={clickedItem}
            isUserComponent={false}
            isClaim={true}
            retireeId={clickedItem?.prospectivePensionerId}
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
                          apiEndpoint={
                            payrollEndpoints.updateVendorPostingGroup
                          }
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
            fetchApiEndpoint={payrollEndpoints.getAllPayrollPensinoersPgd}
            fetchApiService={payrollApiService.get}
            transformData={transformData}
            pageSize={30}
            handlers={handlers}
            breadcrumbTitle="Pensioners Listing"
            currentTitle="Pensioners List"
            // isPayroll={true}
            onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
            segmentOptions={segmentOptions}
            segmentOptions2={segmentOptions2}
            segmentFilterParameter2="status"
            segmentFilterParameter="types"
            // segmentFilterValue={0}
          />
        </>
      )}
    </div>
  );
};

export default PayrollPensioners;
