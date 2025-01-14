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

function ViewBeneficiaries({
  viewBeneficiaries,
  setViewBeneficiaries,
  clickedItem,
}) {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [guardians, setGuardians] = useState([]);

  const getBeneficiaries = async () => {
    try {
      const res = await apiService.get(
        `http://192.168.3.68:8080/portal/getBeneficiaries/${clickedItem.id}`
      );

      const beneficiariesData = res.data;

      // Collect guardians from all children arrays
      const guardiansData = beneficiariesData.reduce((acc, item) => {
        if (item.children && Array.isArray(item.children)) {
          return acc.concat(item.children);
        }
        return acc;
      }, []);

      setBeneficiaries(beneficiariesData);
      setGuardians(guardiansData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBeneficiaries();
  }, [clickedItem]);

  const columnDefs = [
    { headerName: 'Relationship', field: 'relationship' },
    { headerName: 'Surname', field: 'surname' },
    { headerName: 'First Name', field: 'first_name' },
    { headerName: 'Other Name', field: 'other_name' },
    { headerName: 'Percentage Share (%)', field: 'share_percentage' },
    // { headerName: "Age", field: "age" },
    {
      headerName: 'Date of Birth',
      field: 'date_of_birth',
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : 'N/A',
    },
    {
      headerName: 'Is Deaceased',
      field: 'deceased',
      cellRenderer: (params) => {
        if (params.value === null || params.value === false) {
          return 'No';
        } else if (params.value === true) {
          return 'Yes';
        }
        return 'No'; // Default case
      },
      cellStyle: (params) => ({
        color: params.value ? 'red' : 'green',
        fontWeight: 'normal',
        paddingLeft: '50px',
      }),
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
        <p className="text-primary my-5 text-lg px-6 font-bold">
          Beneficiaries
        </p>

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
              onRowClicked={handleRowClick}
            />
          </div>
        </DialogContent>
      </Collapse>{' '}
      {guardians.length > 0 && (
        <>
          <div className="flex items-center mt-[-120px]">
            <p className="text-primary  text-lg px-6 font-bold">Guardians</p>

            <IconButton
              sx={{ ml: '-18px', zIndex: 1, mt: '3px' }}
              onClick={() => handleToggleSection('guardians')}
            >
              {!openSections['guardians'] ? (
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
            in={!openSections['guardians']}
            timeout="auto"
            unmountOnExit
          >
            <DialogContent>
              <div
                className="ag-theme-quartz"
                style={{ height: 400, width: '100%' }}
              >
                <AgGridReact
                  rowData={guardians}
                  columnDefs={columnDefs}
                  domLayout="autoHeight"
                  pagination={false}
                  className="custom-grid"
                  rowSelection="single"
                  onRowClicked={(e) => {
                    setIsGuardian(true);
                    setSelectedBeneficiary(e.data);
                    setEditDialogOpen(true);
                  }}
                />
              </div>
            </DialogContent>
          </Collapse>
        </>
      )}
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

export default ViewBeneficiaries;
