'use client';
import React, { useStae, useEffect } from 'react';

// Assume this is your transformation function
import BaseTable from '@/components/baseComponents/BaseTable';
import BaseCard from '@/components/baseComponents/BaseCard';

import BaseInputCard from '@/components/baseComponents/BaseInputCard';

import { parseDate } from '@/utils/dateFormatter';
import { name } from 'dayjs/locale/en-au';
import BaseCollapse from '@/components/baseComponents/BaseCollapse';
import financeEndpoints, { apiService } from '@/components/services/financeApi';
import endpoints from '@/components/services/setupsApi';
import { apiService as setupsApiService } from '@/components/services/setupsApi';

const OperationsSetups = () => {
  const transformString = (str) => {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  };

  const [bankAccounts, setBankAccounts] = React.useState([]);
  const [awardPostingGroups, setAwardPostingGroups] = React.useState([]);
  const [bankPostingGroups, setBankPostingGroups] = React.useState([]);
  const [generalPostingGroups, setGeneralPostingGroups] = React.useState([]);
  const [vendorPostingGroups, setVendorPostingGroups] = React.useState([]);
  const [customerPostingGroups, setCustomerPostingGroups] = React.useState([]);
  const [vatPostingGroups, setVatPostingGroups] = React.useState([]);
  const [paymentMethods, setPaymentMethods] = React.useState([]);
  const [mdas, setMdas] = React.useState([]);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const response = await apiService.get(
          financeEndpoints.getBankAccounts,
          {
            'paging.pageSize': 10000,
          }
        );
        setBankAccounts(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchAwardPostingGroups = async () => {
      try {
        const response = await apiService.get(
          financeEndpoints.getAwardPostingGroups,
          {
            'paging.pageSize': 10000,
          }
        );
        setAwardPostingGroups(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchBankPostingGroups = async () => {
      try {
        const response = await apiService.get(
          financeEndpoints.getBankPostingGroups,
          {
            'paging.pageSize': 10000,
          }
        );
        setBankPostingGroups(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchGeneralPostingGroups = async () => {
      try {
        const response = await apiService.get(
          financeEndpoints.getGeneralPostingGroups,
          {
            'paging.pageSize': 10000,
          }
        );
        setGeneralPostingGroups(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchVendorPostingGroups = async () => {
      try {
        const response = await apiService.get(
          financeEndpoints.getVendorPostingGroups,
          {
            'paging.pageSize': 10000,
          }
        );
        setVendorPostingGroups(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchCustomerPostingGroups = async () => {
      try {
        const response = await apiService.get(
          financeEndpoints.getCustomerPostingGroup,
          {
            'paging.pageSize': 10000,
          }
        );
        setCustomerPostingGroups(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchVatPostingGroups = async () => {
      try {
        const response = await apiService.get(financeEndpoints.getVatSetups, {
          'paging.pageSize': 10000,
        });
        setVatPostingGroups(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchPaymentMethods = async () => {
      try {
        const response = await apiService.get(
          financeEndpoints.getPaymentMethods,
          {
            'paging.pageSize': 10000,
          }
        );
        setPaymentMethods(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
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

    fetchMdas();
    fetchBankAccounts();
    fetchAwardPostingGroups();
    fetchBankPostingGroups();
    fetchGeneralPostingGroups();
    fetchVendorPostingGroups();
    fetchCustomerPostingGroups();
    fetchVatPostingGroups();
    fetchPaymentMethods();
  }, []);

  const transformData = (data) => {
    return data.map((item, index) => ({
      no: index + 1,
      id: item.id,
      defaultBankAccount: item.defaultBankAccount,
      defaultAwardPostingGroup: item.defaultAwardPostingGroup,
      defaultBankPostingGroup: item.defaultBankPostingGroup,
      defaultGeneralPostingGroup: item.defaultGeneralPostingGroup,
      defaultVendorPostingGroup: item.defaultVendorPostingGroup,
      defaultCustomerPostingGroup: item.defaultCustomerPostingGroup,
      defaultVatPostingGroup: item.defaultVatPostingGroup,
      defaultPaymentMethod: item.defaultPaymentMethod,
      deductionToCapMda: item.deductionToCapMda,
      isAutomaticSchedulling: item.isAutomaticSchedulling,
      maxNoOfPaymentVouchers: item.maxNoOfPaymentVouchers,
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

  const title = clickedItem ? 'Department' : 'Create New Department';

  const fields = [
    {
      name: 'defaultBankAccount',
      label: 'Default Bank Account',
      type: 'autocomplete',
      options: bankAccounts.map((b) => {
        return {
          id: b.id,
          name: b.bankAccountName,
        };
      }),
    },
    {
      name: 'defaultAwardPostingGroup',
      label: 'Default Award Posting Group',
      type: 'autocomplete',
      options: awardPostingGroups.map((a) => {
        return {
          id: a.id,
          name: a.code,
        };
      }),
    },
    {
      name: 'defaultBankPostingGroup',
      label: 'Default Bank Posting Group',
      type: 'autocomplete',
      options: bankPostingGroups.map((b) => {
        return {
          id: b.id,
          name: b.groupName,
        };
      }),
    },
    {
      name: 'defaultGeneralPostingGroup',
      label: 'Default General Posting Group',
      type: 'autocomplete',
      options: generalPostingGroups.map((g) => {
        return {
          id: g.id,
          name: g.description,
        };
      }),
    },
    {
      name: 'defaultVendorPostingGroup',
      label: 'Default Vendor Posting Group',
      type: 'autocomplete',
      options: vendorPostingGroups.map((v) => {
        return {
          id: v.id,
          name: v.groupName,
        };
      }),
    },
    {
      name: 'defaultCustomerPostingGroup',
      label: 'Default Customer Posting Group',
      type: 'autocomplete',
      options: customerPostingGroups.map((c) => {
        return {
          id: c.id,
          name: c.description,
        };
      }),
    },
    {
      name: 'defaultVatPostingGroup',
      label: 'Default VAT Posting Group',
      type: 'autocomplete',
      options: vatPostingGroups.map((v) => {
        return {
          id: v.id,
          name: v.description,
        };
      }),
    },
    {
      name: 'defaultPaymentMethod',
      label: 'Default Payment Method',
      type: 'autocomplete',
      options: paymentMethods.map((p) => {
        return {
          id: p.id,
          name: p.code,
        };
      }),
    },
    {
      name: 'deductionToCapMda',
      label: 'Deduction to Cap MDA',
      type: 'autocomplete',
      options: mdas.map((m) => {
        return {
          id: m.id,
          name: m.name,
        };
      }),
    },
    /**
     * add these two fields    public bool isAutomaticSchedulling { get; set; };
        public long MaxNoOfPaymentVouchers { get; set; };  on operation setup
     */
    {
      name: 'isAutomaticSchedulling',
      label: 'Is Automatic Scheduling',
      type: 'switch',
    },
    {
      name: 'maxNoOfPaymentVouchers',
      label: 'Max No Of Payment Vouchers',
      type: 'number',
    },
  ];

  const fetchGeneralSettings = async () => {
    try {
      const response = await apiService.get(
        financeEndpoints.getOperationSetups
      );
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGeneralSettings().then((data) => {
      const data2 = transformData(data);
      setClickedItem(data2[0]);
    });
  }, []);

  return (
    <div className="bg-white mt-8 px-5">
      {/* <BaseCollapse
        name="General Settings"
        openSections={openSections}
        handleToggleSection={handleToggleSection}
      > */}
      <BaseInputCard
        fields={fields}
        apiEndpoint={
          clickedItem
            ? financeEndpoints.updateOperationSetup
            : financeEndpoints.addOperationSetup
        }
        postApiFunction={apiService.post}
        clickedItem={clickedItem}
        useRequestBody={true}
        setOpenBaseCard={setOpenBaseCard}
      />
      {/* </BaseCollapse> */}
    </div>
  );
};

export default OperationsSetups;
