import claimsEndpoints, { apiService } from '@/components/services/claimsApi';
import { useAlert } from '@/context/AlertContext';
import { Button } from '@mui/material';
import React, { useState } from 'react';

function CreateClaim({
  clickedItem,
  setOpenPreclaimDialog,
  setOpenCreateClaim,
}) {
  const [comments, setComments] = useState('');

  const { alert, setAlert } = useAlert();

  const handleCreateClaim = async () => {
    const data = {
      prospective_pensioner_ids: [clickedItem.id],
      comments,
    };

    try {
      const response = await apiService.post(
        claimsEndpoints.createProspectivePensionerClaim,
        data
      );
      console.log(response);
      console.log('data', data);
      if (response.status === 200 && response.data.succeeded === true) {
        setAlert({
          open: true,
          message: 'Claim created successfully',
          severity: 'success',
        });
        setOpenCreateClaim(false);
        setOpenPreclaimDialog(false);
      } else if (
        response.status === 200 &&
        response.data.succeeded === false &&
        response.data.messages[0]
      ) {
        setAlert({
          open: true,
          message: response.data.messages[0],
          severity: 'error',
        });
      } else {
        setAlert({
          open: true,
          message: 'Failed to create claim',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpenCreateClaim(false);
      // setOpenPreclaimDialog(false);
    }
  };

  return (
    <div>
      {' '}
      <div className="p-8 h-[100%]">
        <p className="text-primary relative font-semibold text-lg mb-2">
          Create Claim
        </p>

        <div>
          <label
            htmlFor="comments"
            className=" text-xs font-medium text-gray-700"
          >
            Add Comments
          </label>
          <textarea
            id="comments"
            name="comments"
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="mt-1 block w-full bg-gray-100 rounded-md border-gray-400 text-sm p-2"
          />
        </div>
        <div className="mt-5">
          {' '}
          <Button
            onClick={handleCreateClaim}
            variant="contained"
            fullWidth
            color="primary"
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateClaim;
