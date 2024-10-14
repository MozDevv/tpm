import claimsEndpoints, { apiService } from '@/components/services/claimsApi';
import preClaimsEndpoints from '@/components/services/preclaimsApi';
import { useAlert } from '@/context/AlertContext';
import { Button, TextareaAutosize } from '@mui/material';
import React, { useState } from 'react';

function ReturnToPreclaims({
  clickedItem,
  setOpenPreclaimDialog,
  setOpenCreateClaim,
  moveStatus,
  moveTo,
  setSelectedRows,
  fetchAllPreclaims,
}) {
  const [comments, setComments] = useState('');
  const { alert, setAlert } = useAlert();
  const [errors, setErrors] = useState({
    status: false,
    message: '',
  });

  const handleCreateClaim = async () => {
    // Validate comments before proceeding
    if (!comments || comments.length < 20) {
      setErrors({
        status: true,
        message: 'Comments must be at least 20 characters',
      });
      return;
    }

    // Function to process each item
    const processItem = async (item) => {
      const data = {
        claim_id: item.id_claim ? item.id_claim : item?.id,
        action: moveStatus,
        comments,
      };

      try {
        const response = await apiService.post(
          claimsEndpoints.moveClaimStatus,
          data
        );
        console.log('Response:', response);
        if (response.status === 200 && response.data.succeeded === true) {
          setAlert({
            open: true,
            message:
              moveStatus === 1
                ? 'Claim(s) has been returned Successfully'
                : 'Claim(s) has been moved to the next stage',
            severity: 'success',
          });
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
        }
      } catch (error) {
        console.error(error.response);
      }
    };

    try {
      if (Array.isArray(clickedItem)) {
        for (const item of clickedItem) {
          await processItem(item);
        }
      } else {
        await processItem(clickedItem);
      }

      // Close dialogs after successful processing
      setOpenCreateClaim(false);
      setOpenPreclaimDialog(false);
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setOpenCreateClaim(false);
      setSelectedRows && setSelectedRows([]); // Reset selected rows if applicable
      fetchAllPreclaims?.(); // Refetch preclaims if the function exists
    }
  };

  // Check if clickedItem is an array and use the first item for title determination
  const itemToCheck = Array.isArray(clickedItem) ? clickedItem[0] : clickedItem;

  const title =
    itemToCheck?.stage === 0 && moveStatus === 1
      ? 'Return Claim(s) to MDA'
      : itemToCheck?.stage === 0 && moveStatus === 0
      ? 'Move Claim(s) to Validation'
      : itemToCheck?.stage === 1 && moveStatus === 1
      ? 'Return to Verification'
      : itemToCheck?.stage === 1 && moveStatus === 0
      ? 'Move to Approval'
      : itemToCheck?.stage === 2 && moveStatus === 0
      ? 'Move to Assessment'
      : itemToCheck?.stage === 2 && moveStatus === 1
      ? 'Return to Validation'
      : itemToCheck?.stage === 3 && moveStatus === 0
      ? 'Move to Assessment Approval'
      : itemToCheck?.stage === 3 && moveStatus === 1
      ? 'Return to Claims'
      : 'Approve Claim(s)';

  return (
    <div>
      <div className="p-8 h-[100%]">
        <p className="text-primary relative font-semibold text-lg mb-5">
          {title}
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
          <Button
            onClick={handleCreateClaim}
            variant="contained"
            fullWidth
            color="primary"
          >
            Create
          </Button>
        </div>
        {errors.status && (
          <div className="mt-2 text-red-500 text-sm">{errors.message}</div>
        )}
      </div>
    </div>
  );
}

export default ReturnToPreclaims;
