import React, { useEffect, useState } from 'react';
import { Collapse, DialogContent, IconButton } from '@mui/material';
import EditBeneficiaryDialog from './EditBeneficiaryDialog';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import preClaimsEndpoints, {
  apiService,
} from '@/components/services/preclaimsApi';
import { ExpandLess, KeyboardArrowRight } from '@mui/icons-material';
import { PORTAL_BASE_URL } from '@/utils/constants';

function NextOfKin({ viewBeneficiaries, setViewBeneficiaries, clickedItem }) {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [guardians, setGuardians] = useState([]);

  const getBeneficiaries = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getNextOfKin(clickedItem.id)
      );

      const beneficiariesData = res.data;

      // // Collect guardians from all children arrays
      // const guardiansData = beneficiariesData.reduce((acc, item) => {
      //   if (item.children && Array.isArray(item.children)) {
      //     return acc.concat(item.children);
      //   }
      //   return acc;
      // }, []);

      setBeneficiaries(beneficiariesData.data);
      // setGuardians(guardiansData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBeneficiaries();
  }, [clickedItem]);

  const columnDefs = [
    { headerName: 'Relationship', field: 'relationship.name' },
    { headerName: 'Surname', field: 'surname' },
    { headerName: 'First Name', field: 'first_name' },
    { headerName: 'Other Name', field: 'other_name' },

    // { headerName: "Age", field: "age" },
    {
      headerName: 'Date of Birth',
      field: 'date_of_birth',
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : 'N/A',
    },

    {
      headerName: 'Mobile Number',
      field: 'mobile_number',
    },
    {
      headerName: 'Email Address',
      field: 'email_address',
    },
    {
      headerName: 'Address',
      field: 'address',
    },
    {
      headerName: 'City',
      field: 'city',
    },

    {
      headerName: 'National ID',
      field: 'identifier',
    },
  ];

  const handleRowClick = (event) => {
    setSelectedBeneficiary(event.data);
    setEditDialogOpen(true);
  };

  const [isGuardian, setIsGuardian] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const handleToggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  return (
    <>
      <div className="flex items-center">
        <p className="text-primary my-5 text-lg px-6 font-bold">Next of Kin</p>

        <IconButton
          sx={{ ml: '-18px', zIndex: 1, mt: '3px' }}
          onClick={() => handleToggleSection('beneficiaries')}
        >
          {!openSections['beneficiaries'] ? (
            <KeyboardArrowRight
              sx={{ color: 'primary.main', fontSize: '14px' }}
            />
          ) : (
            <ExpandLess sx={{ color: 'primary.main', fontSize: '14px' }} />
          )}
        </IconButton>
        <hr className="flex-grow border-blue-500 border-opacity-20 mt-1" />
      </div>
      <Collapse
        in={!openSections['beneficiaries']}
        timeout="auto"
        unmountOnExit
      >
        <DialogContent>
          <div
            className="ag-theme-quartz"
            style={{ height: 400, width: '100%', marginBottom: '-30px' }}
          >
            <AgGridReact
              rowData={beneficiaries}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              className="custom-grid"
              pagination={false}
              rowSelection="single"
              //onRowClicked={handleRowClick}
            />
          </div>
        </DialogContent>
      </Collapse>{' '}
      <EditBeneficiaryDialog
        id={clickedItem?.id}
        open={editDialogOpen}
        isGuardian={isGuardian}
        onClose={() => setEditDialogOpen(false)}
        beneficiary={selectedBeneficiary}
      />
    </>
  );
}

export default NextOfKin;
