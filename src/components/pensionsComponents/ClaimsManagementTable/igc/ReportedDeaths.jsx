'use client';
import React from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import endpoints, { apiService } from '@/components/services/setupsApi';
import { formatDate, parseDate } from '@/utils/dateFormatter';
import { Button } from '@mui/material';
import { DownloadOutlined, Launch } from '@mui/icons-material';
import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import { Table } from 'antd';
import { AccessTime, Cancel, Verified, Visibility } from '@mui/icons-material';
import BaseApprovalCard from '@/components/baseComponents/BaseApprovalCard';
import AssessmentCard from '@/components/financeComponents/payments/PensionerDetailsTabs';

/**
 * public enum DocumentStatuses

{

     OPEN,

     PENDING,

     APPROVED,

     REJECTED

}
 
public enum IGCSubmissionStatuses

{

     OPEN,

     PENDING_PAYROLL_APPROVAL,

		PAYROLL_SUSPENDED,

		PAYROLL_RESUMED

	}
 
 */
const statusIcons = {
  0: { icon: Visibility, name: 'Open', color: '#1976d2' }, // Blue
  1: { icon: AccessTime, name: 'Pending', color: '#fbc02d' }, // Yellow
  2: { icon: Verified, name: 'Approved', color: '#2e7d32' }, // Green
  3: { icon: Cancel, name: 'Rejected', color: '#d32f2f' }, // Red
};

const notificationStatusMap = {
  0: { name: 'Open', color: '#1976d2' },
  1: { name: 'Pending Payroll Approval', color: '#fbc02d' },
  2: { name: 'Payroll Suspended', color: '#2e7d32' },
  3: { name: 'Payroll Resumed', color: '#d32f2f' },
};

const columnDefs = [
  {
    field: 'no',
    headerName: 'Document No',
    headerClass: 'prefix-header',
    width: 150,
    filter: true,
    pinned: 'left',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    cellRenderer: (params) => {
      return (
        <p className="underline text-primary font-semibold">{params.value}</p>
      );
    },
  },
  {
    field: 'prospectivePensioner.no',
    headerName: 'Claim No',
    headerClass: 'prefix-header',
    width: 150,
    filter: true,
    cellRenderer: (params) => {
      return <p className=" text-primary font-normal">{params.value}</p>;
    },
  },

  {
    field: 'prospectivePensioner.surname',
    headerName: 'Surname',
    headerClass: 'prefix-header',
    width: 150,
    filter: true,
    valueGetter: (params) => params.data.prospectivePensioner?.surname || 'N/A',
  },
  {
    field: 'prospectivePensioner.first_name',
    headerName: 'First Name',
    headerClass: 'prefix-header',
    width: 150,
    filter: true,
    valueGetter: (params) =>
      params.data.prospectivePensioner?.first_name || 'N/A',
  },

  {
    field: 'doumet_status',
    headerName: 'Doumet Status',
    headerClass: 'prefix-header',
    filter: true,
    width: 200,
    cellRenderer: (params) => {
      const status = statusIcons[params.value];
      if (!status) return null;

      const IconComponent = status.icon;

      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconComponent
            style={{
              color: status.color,
              marginRight: '6px',
              fontSize: '17px',
            }}
          />
          <span
            style={{
              color: status.color,
              fontWeight: 'semibold',
              fontSize: '13px',
            }}
          >
            {status.name}
          </span>
        </div>
      );
    },
  },
  {
    field: 'iGCSubmissionStatuses',
    headerName: 'IGC Submission Status',
    headerClass: 'prefix-header',
    filter: true,
    cellRenderer: (params) => {
      const status = notificationStatusMap[params.value];
      if (!status) return null;

      return (
        <Button
          variant="text"
          sx={{
            ml: 3,
            maxHeight: '22px',
            cursor: 'pointer',
            color: status.color,
            fontSize: '10px',
            fontWeight: 'bold',
          }}
        >
          {status.name.toLowerCase()}
        </Button>
      );
    },
  },
  {
    field: 'supporting_document_number',
    headerName: 'Supporting Document Number',
    headerClass: 'prefix-header',
    filter: true,
    width: 150,
  },
  {
    field: 'principal_pensioner_id_card_number',
    headerName: 'Principal Pensioner ID Card Number',
    headerClass: 'prefix-header',
    width: 150,
    filter: true,
  },

  {
    field: 'created_date',
    headerName: 'Created Date',
    headerClass: 'prefix-header',
    filter: true,
    width: 150,
    cellRenderer: (params) => parseDate(params.value),
  },
];

const ReportedDeaths = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };
  const [workFlowChange, setWorkFlowChange] = React.useState(null);
  const [openApprove, setOpenApprove] = React.useState(0);
  const [selectedRows, setSelectedRows] = React.useState([]);

  const transformData = (data) => {
    return data.map((item, index) => ({
      ...item,
    }));
  };

  const handlers = {
    approvalRequest: () => console.log('Approval Request clicked'),
    sendApprovalRequest: () => setOpenApprove(1),
    cancelApprovalRequest: () => setOpenApprove(2),
    approveDocument: () => setOpenApprove(3),
    rejectDocumentApproval: () => setOpenApprove(4),
    delegateApproval: () => {
      setOpenApprove(5);
      setWorkFlowChange(Date.now());
    },
  };

  const baseCardHandlers = {
    approvalRequest: () => console.log('Approval Request clicked'),
    sendApprovalRequest: () => setOpenApprove(1),
    cancelApprovalRequest: () => setOpenApprove(2),
    approveDocument: () => setOpenApprove(3),
    rejectDocumentApproval: () => setOpenApprove(4),
    delegateApproval: () => {
      setOpenApprove(5);
      setWorkFlowChange(Date.now());
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem ? clickedItem?.no : 'Create New';

  const fields = [
    {
      name: 'no',
      label: 'Principal Pensioner ID Card Number',
      type: 'text',
      required: true,
    },
    {
      name: 'supporting_document_number',
      label: 'Supporting Document Number',
      type: 'text',
      required: true,
    },
    {
      name: 'doumet_status',
      label: 'Doumet Status',
      type: 'select',
      required: true,
      options: [
        { id: 0, name: 'Open' },
        { id: 1, name: 'Pending' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Rejected' },
      ],
    },
    {
      name: 'iGCSubmissionStatuses',
      label: 'IGC Submission Statuses',
      type: 'select',
      required: true,
      options: [
        { id: 0, name: 'Open' },
        { id: 1, name: 'Pending Payroll Approval' },
        { id: 2, name: 'Payroll Suspended' },
        { id: 3, name: 'Payroll Resumed' },
      ],
    },
    {
      name: 'created_date',
      label: 'Created Date',
      type: 'date',
      required: true,
    },
  ];
  const fileColumns = [
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
      width: '50%',
    },
    //upload date
    {
      title: 'Upload Date',
      dataIndex: 'created_date',
      key: 'created_date',
      width: '25%',
      render: (text) => {
        return <p>{parseDate(text)}</p>;
      },
    },
    {
      title: 'Preview',
      key: 'preview',
      width: '25%',
      render: (_, record) => (
        <Button
          startIcon={<Launch />}
          style={{
            backgroundColor: '#006990',
            color: 'white',
            border: 'none',
            maxHeight: '26px',
            fontSize: '12px',
          }}
          onClick={() => {
            setPreviewContent(
              <embed
                src={record.edmsFileUrl}
                type={record.mimeType}
                width="100%"
                height="1000px"
              />
            );
            setPreviewOpen(true);
          }}
        >
          Preview
        </Button>
      ),
    },
    {
      title: 'Download',
      key: 'download',
      width: '25%',
      render: (_, record) => (
        <Button
          startIcon={<DownloadOutlined />}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            maxHeight: '26px',
            fontSize: '12px',
          }}
          onClick={() => {
            window.open(record.edmsDownloadUrl, '_blank');
          }}
        >
          Download
        </Button>
      ),
    },
  ];

  const fields2 = [
    { name: 'igc_no', label: 'IGC No', type: 'text', disabled: true },
    { name: 'surname', label: 'Surname', type: 'text', disabled: true },
    { name: 'first_name', label: 'First Name', type: 'text', disabled: true },
    { name: 'other_name', label: 'Other Name', type: 'text', disabled: true },
    { name: 'identifier', label: 'Identifier', type: 'text', disabled: true },
    {
      name: 'relationship',
      label: 'Relationship',
      type: 'text',
      disabled: true,
    },
    {
      name: 'mobile_number',
      label: 'Mobile Number',
      type: 'text',
      disabled: true,
    },
    {
      name: 'email_address',
      label: 'Email Address',
      type: 'text',
      disabled: true,
    },
    { name: 'dob', label: 'Date of Birth', type: 'date', disabled: true },
    { name: 'age', label: 'Age', type: 'text', disabled: true },
    { name: 'address', label: 'Address', type: 'text', disabled: true },
    {
      name: 'birth_certificate_no',
      label: 'Birth Certificate No',
      type: 'text',
      disabled: true,
    },
    {
      name: 'supporting_document_number',
      label: 'Supporting Document Number',
      type: 'text',
      disabled: true,
    },
    {
      name: 'document_status',
      label: 'Document Status',
      type: 'select',
      disabled: true,
      options: [
        { id: 0, name: 'Open' },
        { id: 1, name: 'Pending' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Rejected' },
      ],
    },
    {
      name: 'submission_status',
      label: 'IGC Submission Status',
      type: 'select',
      disabled: true,
      options: [
        { id: 0, name: 'Open' },
        { id: 1, name: 'Pending' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Rejected' },
      ],
    },
    {
      name: 'created_date',
      label: 'Created Date',
      type: 'date',
      disabled: true,
    },
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
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
      >
        {clickedItem ? (
          <>
            <div className="">
              <AssessmentCard
                claim={
                  clickedItem
                    ? [
                        {
                          ...clickedItem,
                          prospectivePensionerId:
                            clickedItem?.prospective_pensioner_id,
                        },
                      ]
                    : null
                }
                clickedItem={clickedItem?.prospectivePensioner}
                setOpenBaseCard={setOpenBaseCard}
                childTitle="Details"
                isIgc={false}
                isNormalPreclaims={true}
              >
                <BaseCollapse name="Provided Details">
                  <BaseInputCard
                    fields={fields}
                    // apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
                    disableAll={true}
                    postApiFunction={apiService.post}
                    clickedItem={clickedItem}
                    useRequestBody={true}
                    setOpenBaseCard={setOpenBaseCard}
                  />
                </BaseCollapse>
                <BaseCollapse
                  className="mt-[-10px]"
                  name="Supporting Documents"
                >
                  <div className="px-6 pt-2">
                    {clickedItem?.supporting_documents &&
                      clickedItem.supporting_documents.length > 0 && (
                        <Table
                          columns={fileColumns}
                          dataSource={clickedItem?.supporting_documents}
                          pagination={false}
                          rowKey="id"
                          className="antcustom-table"
                          rowClassName={() => 'px-4'} // Add padding to rows
                          onHeaderRow={() => {
                            return {
                              className: 'px-4', // Add padding to headers
                            };
                          }}
                        />
                      )}
                  </div>
                </BaseCollapse>{' '}
                {clickedItem?.iGC_beneficiary_track &&
                  clickedItem.iGC_beneficiary_track.length > 0 && (
                    <BaseCollapse name="Beneficiary Track">
                      <BaseInputCard
                        fields={fields2}
                        // apiEndpoint={endpoints.updateDepartment(clickedItem.id)}
                        disableAll={true}
                        postApiFunction={apiService.post}
                        clickedItem={
                          clickedItem?.igC_beneficiary_track?.beneficiary
                        }
                        useRequestBody={true}
                        setOpenBaseCard={setOpenBaseCard}
                      />
                    </BaseCollapse>
                  )}
              </AssessmentCard>
            </div>
          </>
        ) : (
          <BaseInputCard
            fields={fields}
            apiEndpoint={endpoints.createDepartment}
            postApiFunction={apiService.post}
            clickedItem={clickedItem}
            useRequestBody={true}
            setOpenBaseCard={setOpenBaseCard}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={endpoints.getReportedDeaths}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Reported Deaths"
        currentTitle="Reported Deaths"
        onSelectionChange={(selectedRows) => setSelectedRows(selectedRows)}
      />
    </div>
  );
};

export default ReportedDeaths;
