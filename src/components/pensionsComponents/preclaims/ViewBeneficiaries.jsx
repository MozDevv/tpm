import React, { useEffect, useState } from 'react';
import { Button, Collapse, DialogContent, IconButton } from '@mui/material';
import EditBeneficiaryDialog from './EditBeneficiaryDialog';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import preClaimsEndpoints, {
  apiService,
} from '@/components/services/preclaimsApi';
import { ExpandLess, KeyboardArrowRight, TaskAlt } from '@mui/icons-material';
import { PORTAL_BASE_URL } from '@/utils/constants';

function ViewBeneficiaries({
  viewBeneficiaries,
  setViewBeneficiaries,
  clickedItem,
}) {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [clickedBeneficiary, setClickedBeneficiary] = useState(null);
  const [clickedGuardian, setClickedGuardian] = useState(null);

  const getBeneficiaries = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getBeneficiariesfromId(clickedItem.id)
      );

      const beneficiariesData = res.data.data;

      // Collect guardians from the `guardian` field of each beneficiary
      const guardiansData = beneficiariesData
        .filter((item) => item.guardian !== null)
        .map((item) => item.guardian);

      setBeneficiaries(beneficiariesData);
      setGuardians(guardiansData);
    } catch (error) {
      console.log('Error fetching beneficiaries:', error);
    }
  };

  useEffect(() => {
    getBeneficiaries();
  }, [clickedItem]);

  const verifyBeneficiary = async () => {
    try {
      const res = await apiService.post(
        preClaimsEndpoints.verifyBeneficiary(clickedBeneficiary.id)
      );
      if (res.status === 200) {
        message.success('Beneficiary verified successfully');
        setViewBeneficiaries(false);
      } else {
        message.error('Failed to verify beneficiary');
      }
    } catch (error) {
      console.log('Error verifying beneficiary:', error);
    }
  };
  const columnDefs = [
    {
      headerName: 'Relationship',
      field: 'relationshipName',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      valueGetter: (params) => params.data.relationship?.name,
    },
    { headerName: 'Surname', field: 'surname' },
    {
      headerName: 'First Name',
      field: 'firstName',
      valueGetter: (params) => params.data.firstName || params.data.first_name,
    },
    {
      headerName: 'Other Name',
      field: 'middleName',
      valueGetter: (params) =>
        params.data.middleName ||
        params.data.other_name ||
        params.data.otherName ||
        params.data.middle_name,
    },
    {
      headerName: 'Date of Birth',
      field: 'dateOfBirth',
      valueGetter: (params) =>
        params.data.dateOfBirth || params.data.dob || params.data.date_of_birth,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : 'N/A',
    },
    {
      headerName: 'Is Deceased',
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
    setClickedBeneficiary(event.data);
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
            <div className="mt-[-25px] mb-[10px]">
              {clickedItem?.mortality_status === 1 && (
                <div className="">
                  <Button onClick={verifyBeneficiary} startIcon={<TaskAlt />}>
                    Approve Beneficiary
                  </Button>
                </div>
              )}
              <AgGridReact
                rowData={beneficiaries}
                columnDefs={columnDefs}
                domLayout="autoHeight"
                className="custom-grid"
                pagination={false}
                rowSelection="single"
                onRowClicked={handleRowClick}
                onSelectionChanged={(e) => {
                  setClickedBeneficiary(e.api.getSelectedRows()[0]);
                }}
              />
            </div>
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
                <div className=" mb-[10px]">
                  {clickedItem?.mortality_status === 1 && (
                    <div className="">
                      <Button
                        onClick={verifyBeneficiary}
                        startIcon={<TaskAlt />}
                      >
                        Approve Guardian
                      </Button>
                    </div>
                  )}
                  <AgGridReact
                    rowData={guardians}
                    columnDefs={columnDefs}
                    domLayout="autoHeight"
                    pagination={false}
                    className="custom-grid"
                    rowSelection="single"
                    onRowClicked={(e) => {
                      setClickedBeneficiary(e.data);
                      setIsGuardian(true);
                      setSelectedBeneficiary(e.data);
                      setEditDialogOpen(true);
                    }}
                  />
                </div>
              </div>
            </DialogContent>
          </Collapse>
        </>
      )}
      <EditBeneficiaryDialog
        id={clickedItem?.id}
        open={editDialogOpen}
        clickedItem={clickedItem}
        isGuardian={isGuardian}
        onClose={() => setEditDialogOpen(false)}
        beneficiary={selectedBeneficiary}
      />
    </>
  );
}

export default ViewBeneficiaries;
