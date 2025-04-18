'use client';
import React, { useEffect, useState } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import { apiService } from '@/components/services/financeApi';

import financeEndpoints from '@/components/services/financeApi';

import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import BaseAutoSaveInputCardWithSections from '../baseComponents/BaseAutoSaveInputCardWithSections';
import endpoints from '../services/setupsApi';
import { apiService as setupsApiService } from '../services/setupsApi';
import { message, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import BaseInputTable from '../baseComponents/BaseInputTable';
import BaseFinanceInputTable from '../baseComponents/BaseFinanceInputTable';
import { Button } from '@mui/material';
import { formatNumber } from '@/utils/numberFormatters';
import BaseDrilldown from '../baseComponents/BaseDrilldown';

const Members = ({ status }) => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const [disableAll, setDisableAll] = useState(true);

  const transformData = (data) => {
    return data.map((item, index) => ({
      id: item.id,

      payrollNumber: item.payrollNumber,
      kraPin: item.kraPin,
      nationalId: item.nationalId,
      pssfNumber: item.pssfNumber,
      surname: item.surname,
      firstName: item.firstName,
      lastName: item.lastName,
      otherName: item.otherName,
      gender: item.gender,
      dateOfBirth: item.dateOfBirth,
      memberUploadBatchId: item.memberUploadBatchId,
      membershipStatus: item.membershipStatus,
      sponsorId: item.sponsorId,
      professionId: item.professionId,
      dateOfJoiningScheme: item.dateOfJoiningScheme,
      dateOfEmployment: item.dateOfEmployment,
      dateOfLeaving: item.dateOfLeaving,
      phoneNumber: item.phoneNumber,
      emailAdress: item.emailAdress,
      postalAddress: item.postalAddress,
      postalCode: item.postalCode,
      county: item.county,
      maritalStatus: item.maritalStatus,
      memberId: item.id,
      totalContribution: item.totalContribution,

      // roles: item.roles,
    }));
  };

  const handleChangeRequest = async () => {
    try {
      const res = await apiService.post(
        financeEndpoints.addMemberChangeRequest,
        clickedItem
      );

      if (res.status === 200) {
        message.success('Change request created successfully');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlers = {
    // filter: () => console.log("Filter clicked"),
    // openInExcel: () => console.log("Export to Excel clicked"),
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },
    edit: () => console.log('Edit clicked'),
    delete: () => console.log('Delete clicked'),
    reports: () => console.log('Reports clicked'),
    notify: () => console.log('Notify clicked'),
  };

  const baseCardHandlers = {
    create: () => {
      setOpenBaseCard(true);
      setClickedItem(null);
    },

    changeRequest: () => {
      setDisableAll(!disableAll);
    },
    sendChangeRequestForApproval: () => {
      handleChangeRequest();
    },
    cancelChangeRequest: () => {},

    // createChangeRequest: () => handleChangeRequest(),
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);

  const title = clickedItem
    ? 'Member - ' + clickedItem?.payrollNumber
    : 'Create New Member';

  const [vendorPG, setVendorPG] = React.useState([]);

  const [counties, setCounties] = React.useState([]);
  const [constituencies, setConstituencies] = React.useState([]);
  const [designations, setDesignations] = React.useState([]);
  const [activeKey, setActiveKey] = useState('1');

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const fetchCountiesAndContituencies = async () => {
    try {
      const res = await setupsApiService.get(endpoints.getCounties, {
        'paging.pageSize': 100,
      });
      const rawData = res.data.data;

      const countiesData = rawData.map((county) => ({
        id: county.id,
        name: county.county_name,
        constituencies: county.constituencies.map((constituency) => ({
          id: constituency.id,
          name: constituency.constituency_name,
        })),
      }));

      setCounties(countiesData);
      //setConstituencies(countiesData.constituencies);

      console.log('first', rawData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDesignations = async () => {
    try {
      const res = await setupsApiService.get(endpoints.getDesignations, {
        'paging.pageSize': 1000,
      });
      setDesignations(res.data.data);
    } catch (error) {
      console.error('Error fetching Designations:', error);
    }
  };

  const [mdas, setMdas] = useState([]);

  const fetchMdas = async () => {
    try {
      const res = await setupsApiService.get(endpoints.mdas, {
        'paging.pageNumber': 1,
        'paging.pageSize': 1000,
      });
      setMdas(
        res.data.data.map((mda) => ({
          id: mda.id,
          name: mda.description,
        }))
      );
    } catch (error) {
      console.error('Error fetching MDAs:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchMdas();
  }, []);

  useEffect(() => {
    fetchCountiesAndContituencies();
    fetchDesignations();
  }, []);
  const [openDrilldown, setOpenDrilldown] = useState(false);
  const [statusId, setStatusId] = useState(null);

  const fields = {
    personalDetails: [
      {
        name: 'surname',
        label: 'Surname',
        type: 'text',
        required: true,
      },
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
      },
      {
        name: 'otherName',
        label: 'Other Name',
        type: 'text',
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        required: true,
        options: [
          { id: 'Male', name: 'Male' },
          { id: 'Female', name: 'Female' },
        ],
      },
      {
        name: 'payrollNumber',
        label: 'Payroll Number',
        type: 'text',
        required: true,
      },
      {
        name: 'kraPin',
        label: 'KRA Pin',
        type: 'text',
        required: true,
      },
      {
        name: 'nationalId',
        label: 'National ID',
        type: 'text',
        required: true,
      },
      {
        name: 'pssfNumber',
        label: 'PSSF Number',
        type: 'text',
        required: true,
      },
      {
        name: 'dateOfBirth',
        label: 'Date of Birth',
        type: 'date',
        required: true,
      },
      {
        name: 'maritalStatus',
        label: 'Marital Status',
        type: 'select',

        options: [
          { id: 0, name: 'Single' },
          { id: 1, name: 'Married' },
          { id: 2, name: 'Divorced' },
          { id: 3, name: 'Widowed' },
        ],
      },
    ],
    contributionDetails: [
      {
        name: 'membershipStatus',
        label: 'Membership Status',
        type: 'select',
        // required: true,
        options: [
          {
            id: 0,
            name: 'Active',
          },
          {
            id: 1,
            name: 'Deferred',
          },
          {
            id: 2,
            name: 'Died',
          },
          {
            id: 3,
            name: 'Retired',
          },
          {
            id: 4,
            name: 'Leave of absence',
          },
          {
            id: 5,
            name: 'Secondment',
          },
          {
            id: 6,
            name: 'Fully paid',
          },
        ],
      },
      {
        name: 'totalContribution',
        label: 'Contribution Amount',
        type: 'drillDown',
        required: false,
        disabled: true,
      },

      {
        name: 'sponsorId',
        label: 'Sponsor',
        type: 'autocomplete',
        required: true,
        options: mdas.map((sponsor) => ({
          id: sponsor.id,
          name: sponsor.name,
        })),
      },
      {
        name: 'professionId',
        label: 'Profession',
        type: 'autocomplete',
        required: true,
        options: designations.map((profession) => ({
          id: profession.id,
          name: profession.name,
          mdaId: profession.mda_id,
        })),
      },
      {
        name: 'dateOfJoiningScheme',
        label: 'Date of Joining Scheme',
        type: 'date',
        required: true,
      },
      {
        name: 'dateOfEmployment',
        label: 'Date of Employment',
        type: 'date',
        required: true,
      },
      {
        name: 'dateOfLeaving',
        label: 'Date of Leaving',
        type: 'date',
        required: true,
      },
    ],

    contactDetails: [
      {
        name: 'phoneNumber',
        label: 'Phone Number',
        type: 'phonenumber',
        //   required: true,
      },
      {
        name: 'emailAdress',
        label: 'Email Address',
        type: 'email',
        // required: true,
      },
      {
        name: 'postalAddress',
        label: 'Postal Address',
        type: 'text',
      },
      {
        name: 'postalCode',
        label: 'Postal Code',
        type: 'text',
      },
      {
        name: 'county',
        label: 'County',
        type: 'select',

        options: counties.map((county) => ({
          id: county.id,
          name: county.name,
        })),
      },
    ],
  };

  const membershipStatusMap = {
    0: { name: 'Active', color: '#2ecc71' }, // Green
    1: { name: 'Deferred', color: '#e74c3c' }, // Red
    2: { name: 'Died', color: '#95a5a6' }, // Grey
    3: { name: 'Retired', color: '#9b59b6' }, // Purple
    4: { name: 'Leave of absence', color: '#f39c12' }, // Orange
    5: { name: 'Secondment', color: '#3498db' }, // Blue
    6: { name: 'Fully paid', color: '#1abc9c' }, // Turquoise
  };
  const columnDefs = [
    {
      field: 'payrollNumber',
      headerName: 'Payroll Number',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
      pinned: 'left',
    },
    {
      field: 'surname',
      headerName: 'Surname',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
    },
    //add totalContribution	0
    {
      field: 'totalContribution',
      headerName: 'Total Contribution',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,

      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
      cellRenderer: (params) => {
        return (
          <p
            className="cursor-pointer underline text-primary font-bold text-[14px]"
            onClick={() => {
              setOpenDrilldown(true);
              setClickedItem(params.data);
            }}
          >
            {formatNumber(params.value)}
          </p>
        );
      },
    },

    {
      field: 'membershipStatus',
      headerName: 'Membership Status',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,

      cellRenderer: (params) => {
        const status = membershipStatusMap[params.value];
        if (!status) return null;

        return (
          <Button
            variant="text"
            sx={{
              ml: 1,
              // borderColor: status.color,
              maxHeight: '22px',
              cursor: 'pointer',
              color: status.color,
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            {status.name}
          </Button>
        );
      },
    },
    {
      field: 'kraPin',
      headerName: 'KRA Pin',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
    },
    {
      field: 'nationalId',
      headerName: 'National ID',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
    },
    {
      field: 'pssfNumber',
      headerName: 'PSSF Number',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      headerClass: 'prefix-header',
      width: 100,
      filter: true,
    },
    {
      field: 'dateOfBirth',
      headerName: 'Date of Birth',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString('en-GB');
      },
    },
    {
      field: 'sponsorId',
      headerName: 'Sponsor ID',
      headerClass: 'prefix-header',
      width: 150,
      filter: true,
      valueFormatter: (params) => {
        return mdas.find((sponsor) => sponsor.id === params.value)?.name;
      },
    },
  ];

  const nextOfKinFields = [
    {
      value: 'relationship',
      label: 'Relationship',
      type: 'select',
      required: true,
      options: [
        { id: 0, name: 'Husband' },
        { id: 1, name: 'Wife' },
        { id: 2, name: 'Daughter' },
        { id: 3, name: 'Son' },
        { id: 4, name: 'Brother' },
        { id: 5, name: 'Sister' },
        { id: 6, name: 'Mother' },
        { id: 7, name: 'Father' },
        { id: 8, name: 'Other' },
      ],
    },

    {
      value: 'surname',
      label: 'Surname',
      type: 'text',
      required: true,
    },
    {
      value: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
    },
    {
      value: 'lastName',
      label: 'Last Name',
      type: 'text',
      notRequired: true,
    },
    {
      value: 'otherName',
      label: 'Other Name',
      notRequired: true,
      type: 'text',
    },
    {
      value: 'gender',
      label: 'Gender',
      type: 'select',
      options: [
        { id: 'Male', name: 'Male' },
        { id: 'Female', name: 'Female' },
      ],
    },
    {
      value: 'kraPin',
      label: 'KRA Pin',
      type: 'text',
      required: true,
    },
    {
      value: 'nationalId',
      label: 'National ID',
      type: 'text',
      required: true,
    },
    {
      value: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
      required: true,
    },
    {
      value: 'emailAdress',
      label: 'Email Address',
      type: 'email',
      notRequired: true,
      required: true,
    },
  ];

  //create this coldefs   "data": [

  const drillDownColumnDefs = [
    {
      field: 'monthName',
      headerName: 'Month',
      headerClass: 'prefix-header',
      flex: 1,
    },
    {
      field: 'employeeContribution',
      headerName: 'Employee Contribution',
      headerClass: 'prefix-header',
      flex: 1,
      filter: true,
    },
    {
      headerName: 'Employer Contributions',
      field: 'employerContribution',
      flex: 1,
      filter: true,
    },

    {
      field: 'totalContribution',
      headerName: 'Total Contribution',
      headerClass: 'prefix-header',
      flex: 1,
      filter: true,
    },
  ];

  return (
    <div className="">
      <BaseDrilldown
        setOpenDrilldown={setOpenDrilldown}
        openDrilldown={openDrilldown}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        columnDefs={drillDownColumnDefs}
        fetchApiEndpoint={financeEndpoints.getMemberContibutionByMemberId(
          clickedItem?.id
        )}
        fetchApiService={apiService.get}
        title={clickedItem?.payrollNumber}
      />
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={financeEndpoints.deleteMember(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {clickedItem ? (
          <>
            <Tabs
              activeKey={activeKey}
              onChange={handleTabChange}
              className="!bg-transparent z-50 ml-4"
              style={{ zIndex: 999999999 }}
              tabBarExtraContent={<div className="bg-primary h-1" />} // Custom ink bar style
            >
              <TabPane
                tab={
                  <span className="text-primary font-montserrat ">
                    Member Information
                  </span>
                }
                key="1"
              >
                <div className="font-montserrat mt-[-20px] ml-[-14px]">
                  {' '}
                  <BaseAutoSaveInputCardWithSections
                    disableAll={disableAll}
                    fields={fields}
                    apiEndpoint={financeEndpoints.addMember}
                    putApiFunction={apiService.post}
                    updateApiEndpoint={financeEndpoints.updateMember}
                    deleteApiEndpoint={financeEndpoints.deleteMember(
                      clickedItem?.id
                    )}
                    postApiFunction={apiService.post}
                    getApiEndpoint={financeEndpoints.getMemberById(
                      clickedItem?.id
                    )}
                    getApiFunction={apiService.get}
                    transformData={transformData}
                    setOpenBaseCard={setOpenBaseCard}
                    useRequestBody={true}
                    openBaseCard={openBaseCard}
                    setClickedItem={setClickedItem}
                    clickedItem={clickedItem}
                    setOpenDrilldown={setOpenDrilldown}
                  />
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span className="text-primary font-montserrat">
                    Next of Kin Information
                  </span>
                }
                key="2"
              >
                <BaseInputTable
                  title="Next of Kin Information"
                  fields={nextOfKinFields}
                  id={clickedItem?.id}
                  idLabel="memberId"
                  getApiService={apiService.get}
                  postApiService={apiService.post}
                  putApiService={apiService.post}
                  getEndpoint={financeEndpoints.getMemberNextOfKin(
                    clickedItem?.id
                  )}
                  deleteApiService={apiService.delete}
                  apiService={apiService}
                  deleteEndpoint={financeEndpoints.deleteMemberNextOfKin}
                  postEndpoint={financeEndpoints.addMemberNextOfKin}
                  putEndpoint={financeEndpoints.updateMemberNextOfKin}
                  passProspectivePensionerId={true}
                />
              </TabPane>
            </Tabs>
          </>
        ) : (
          <BaseAutoSaveInputCardWithSections
            fields={fields}
            apiEndpoint={financeEndpoints.addMember}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updateMember}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getMemberById}
            deleteApiEndpoint={financeEndpoints.deleteMember(clickedItem?.id)}
            getApiFunction={apiService.get}
            transformData={transformData}
            setOpenBaseCard={setOpenBaseCard}
            useRequestBody={true}
            openBaseCard={openBaseCard}
            setClickedItem={setClickedItem}
            clickedItem={clickedItem}
          />
        )}
      </BaseCard>
      <BaseTable
        openBaseCard={openBaseCard}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        setOpenBaseCard={setOpenBaseCard}
        columnDefs={columnDefs}
        fetchApiEndpoint={
          status || status === 0
            ? financeEndpoints.getMemberByStatus(status)
            : financeEndpoints.getMembers
        }
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Member List"
        currentTitle="Member List"
      />
    </div>
  );
};

export default Members;
