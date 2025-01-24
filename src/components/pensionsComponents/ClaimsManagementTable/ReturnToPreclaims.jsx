import claimsEndpoints, { apiService } from '@/components/services/claimsApi';
import preClaimsEndpoints from '@/components/services/preclaimsApi';
import { useAlert } from '@/context/AlertContext';
import { Button, TextareaAutosize } from '@mui/material';
import { message } from 'antd';
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
          message.error(response.data.messages[0]);
        } else {
          message.error('Failed to process claim(s)');
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
      setSelectedRows && setSelectedRows([]); // Reset selected rows if applicable
      fetchAllPreclaims?.(); // Refetch preclaims if the function exists
    }
  };
  const notificationStatusMap = {
    0: { name: 'Claims Verification', color: '#3498db' }, // Light Red
    1: { name: 'Claims Validation', color: '#f39c12' }, // Bright Orange
    2: { name: 'Claims Approval', color: '#2ecc71' }, // Light Blue
    3: { name: 'Assessment Data Capture', color: '#f39c12' }, // Bright Orange
    4: { name: 'Assessment Approval', color: '#2ecc71' }, // Light Blue
    5: { name: 'Directorate', color: '#f39c12' }, // Bright Orange
    6: { name: 'Controller Of Budget', color: '#2ecc71' }, // Light Blue
    7: { name: 'Finance', color: '#f39c12' }, // Bright Orange
  };

  // Check if clickedItem is an array and use the first item for title determination

  const stageOrder = Object.keys(notificationStatusMap).map(Number);

  const getTitle = (stage, moveStatus) => {
    const currentIndex = stageOrder.indexOf(stage);
    const targetIndex = moveStatus === 1 ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= stageOrder.length) {
      console.log('Returning: Return Claim to MDA for clarification');
      return 'Return Claim to MDA for clarification';
    }

    const targetStageName = notificationStatusMap[stageOrder[targetIndex]].name;
    console.log('Target Stage Name:', targetStageName);

    const result =
      moveStatus === 1
        ? `Return to ${targetStageName}`
        : `Move to ${targetStageName}`;

    console.log('Result:', result);
    return result;
  };

  const itemToCheck = Array.isArray(clickedItem) ? clickedItem[0] : clickedItem;
  const title = getTitle(itemToCheck?.stage, moveStatus);

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
            {title}
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
