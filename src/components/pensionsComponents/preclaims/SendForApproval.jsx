import claimsEndpoints, { apiService } from '@/components/services/claimsApi';
import preClaimsEndpoints from '@/components/services/preclaimsApi';
import { useAlert } from '@/context/AlertContext';
import { Close } from '@mui/icons-material';
import { Button, IconButton, TextareaAutosize } from '@mui/material';
import React, { useState } from 'react';

function SendForApproval({
  clickedItem,
  setOpenPreclaimDialog,
  setOpenCreateClaim,
  fetchAllPreclaims,
}) {
  const [comments, setComments] = useState('');

  const { alert, setAlert } = useAlert();

  const [errors, setErrors] = useState({
    status: false,
    message: '',
  });

  const handleCreateClaim = async () => {
    if (!comments || comments.length < 20) {
      setErrors({
        status: true,
        message: 'Comments must be atleast 20 characters',
      });

      return;
    }

    const data = {
      prospective_pensioner_ids: [clickedItem.id],
      comments,
    };

    try {
      const response = await apiService.post(
        preClaimsEndpoints.submitForApproval,
        data
      );
      console.log(response);
      console.log('data', data);
      if (response.status === 200 && response.data.succeeded === true) {
        setAlert({
          open: true,
          message: 'Submitted for approval successfully',
          severity: 'success',
        });
        fetchAllPreclaims();
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
          message: 'Failed to submit for approval',
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
        <IconButton sx={{ position: 'absolute', right: 0, top: 0 }}>
          <Close onClick={() => setOpenCreateClaim(false)} />
        </IconButton>
        <p className="text-primary relative font-semibold text-lg mb-3">
          Submit for Approval
        </p>

        <div>
          <label
            htmlFor="comments"
            className=" text-xs font-medium text-gray-700"
          >
            Add Comments
          </label>
          <TextareaAutosize
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            required
            error={errors.status}
            minRows={3}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid gray',
            }}
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
            Submit
          </Button>
        </div>
        {errors.status && (
          <div className="mt-2 text-red-500 text-sm">{errors.message}</div>
        )}
      </div>
    </div>
  );
}

export default SendForApproval;
