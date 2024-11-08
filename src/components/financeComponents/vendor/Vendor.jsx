'use client';
import React, { useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';
import { apiService } from '@/components/services/financeApi';
import { formatDate } from '@/utils/dateFormatter';
import financeEndpoints from '@/components/services/financeApi';

import { API_BASE_URL } from '@/components/services/setupsApi';

import axios from 'axios';
import { formatNumber } from '@/utils/numberFormatters';
import BaseAutoSaveInputCard from '@/components/baseComponents/BaseAutoSaveInputCard';
import BaseDrilldown from '@/components/baseComponents/BaseDrilldown';
import { getColumnDefsByType } from '../baseSubledgerData/BaseSubledgerData';

const Vendor = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.id,
      vendorName: item.vendorName,
      vendorEmail: item.vendorEmail,
      vendorPhoneNumber: item.vendorPhoneNumber,
      countryId: item.countryId,
      cityId: item.cityId,
      vendorPostingGroupId: item.vendorPostingGroupId,
      amount: item.amount === null ? 0 : item.amount,
      vendorCode: item.vendorCode,

      // roles: item.roles,
    }));
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
    edit: (item) => {
      // setOpenBaseCard(true);
      // setClickedItem(item);
    },
    delete: (item) => {
      //  setOpenBaseCard(true);
      //  setClickedItem(item);
    },
  };

  const [openBaseCard, setOpenBaseCard] = React.useState(false);
  const [clickedItem, setClickedItem] = React.useState(null);
  const [countries, setCountries] = React.useState([]);
  const [cities, setCities] = React.useState([]);

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/Setups/GetCountries`, {
        'paging.pageSize': 100,
      });

      console.log('countries', res.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  // useEffect(() => {
  //   fetchCountries();
  // }, []);

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/Setups/GetCity`, {
        'paging.pageSize': 100,
      });

      setCities(res.data.data);

      console.log('countries', res.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchCities();
  }, []);

  const title = clickedItem ? clickedItem?.vendorName : 'Create New Vendor';

  const [vendorPG, setVendorPG] = React.useState([]);

  const fetchPostingGroups = async () => {
    try {
      const res = await apiService.get(
        financeEndpoints.getVendorPostingGroups,
        {
          'paging.pageSize': 1000,
        }
      );
      setVendorPG(
        res.data.data.map((item) => {
          return {
            id: item.id,
            name: item.groupName,
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPostingGroups();
  }, []);

  const fields = [
    {
      name: 'vendorName',
      label: 'Vendor Name',
      type: 'text',
      required: true,
    },
    {
      name: 'vendorEmail',
      label: 'Vendor Email',
      type: 'text',
      required: true,
    },
    {
      name: 'vendorPhoneNumber',
      label: 'Vendor Phone Number',
      type: 'text',
      required: true,
    },
    {
      name: 'vendorPostingGroupId',
      label: 'Vendor Posting Group',
      type: 'select',
      required: true,
      options: vendorPG,
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'drillDown',
      required: false,
      disabled: true,
    },
    {
      name: 'countryId',
      label: 'Country',
      type: 'select',
      options: countries.map((country) => ({
        id: country.id,
        name: country.country_name,
      })),
    },

    {
      name: 'cityId',
      label: 'City',
      type: 'select',
      required: true,
      options: cities.map((city) => ({
        id: city.id,
        name: city.city_name,
      })),
    },
  ];

  const [openDrilldown, setOpenDrilldown] = React.useState(false);

  const columnDefs = [
    {
      field: 'vendorCode',
      headerName: 'Vendor Code',
      headerClass: 'prefix-header',
      flex: 1,
      filter: true,
      pinned: 'left',
    },
    {
      field: 'vendorName',
      headerName: 'Vendor Name',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
      cellRenderer: (params) => {
        return (
          <p
            className="cursor-pointer underline text-primary font-bold text-[14px] text-right"
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
      field: 'vendorEmail',
      headerName: 'Vendor Email',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
    {
      field: 'vendorPhoneNumber',
      headerName: 'Vendor Phone Number',
      headerClass: 'prefix-header',
      filter: true,
      flex: 1,
    },
  ];

  return (
    <div className="">
      <BaseDrilldown
        setOpenDrilldown={setOpenDrilldown}
        openDrilldown={openDrilldown}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        columnDefs={getColumnDefsByType('Vendor Ledger Entries')}
        fetchApiEndpoint={financeEndpoints.vendorDrillDown(clickedItem?.id)}
        fetchApiService={apiService.get}
        title={clickedItem?.vendorName}
      />{' '}
      <BaseCard
        openBaseCard={openBaseCard}
        setOpenBaseCard={setOpenBaseCard}
        handlers={baseCardHandlers}
        title={title}
        clickedItem={clickedItem}
        isUserComponent={false}
        deleteApiEndpoint={financeEndpoints.deleteVendor(clickedItem?.id)}
        deleteApiService={apiService.post}
      >
        {' '}
        {clickedItem ? (
          <>
            {' '}
            <BaseAutoSaveInputCard
              fields={fields}
              setOpenDrilldown={setOpenDrilldown}
              apiEndpoint={financeEndpoints.addVendor}
              putApiFunction={apiService.post}
              updateApiEndpoint={financeEndpoints.updateVendor}
              postApiFunction={apiService.post}
              getApiEndpoint={financeEndpoints.getVendors}
              getApiFunction={apiService.get}
              transformData={transformData}
              setOpenBaseCard={setOpenBaseCard}
              useRequestBody={true}
              openBaseCard={openBaseCard}
              setClickedItem={setClickedItem}
              clickedItem={clickedItem}
            />
          </>
        ) : (
          <BaseAutoSaveInputCard
            fields={fields}
            apiEndpoint={financeEndpoints.addVendor}
            putApiFunction={apiService.post}
            updateApiEndpoint={financeEndpoints.updateVendor}
            postApiFunction={apiService.post}
            getApiEndpoint={financeEndpoints.getVendors}
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
        fetchApiEndpoint={financeEndpoints.getVendors}
        fetchApiService={apiService.get}
        transformData={transformData}
        pageSize={30}
        handlers={handlers}
        breadcrumbTitle="Vendors"
        currentTitle="Vendors"
      />
    </div>
  );
};

export default Vendor;
