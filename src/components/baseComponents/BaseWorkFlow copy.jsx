import React, { useEffect, useState } from 'react';
import DocumentHistory from '../CRM/DocumentHistory';
import workflowsEndpoints, {
  workflowsApiService,
} from '../services/workflowsApi';
import DocumentHistForWorkflow from '../CRM/DocumentHistForWorkflow';
import { Button } from '@mui/material';
import { Launch } from '@mui/icons-material';
import BaseExpandCard from './BaseExpandCard';
import BaseEmptyComponent from './BaseEmptyComponent';

function BaseWorkFlow2({ clickedItem }) {
  const [documentHistory, setDocumentHistory] = React.useState([]);
  const getDocumentStatus = async () => {
    const possibleKeys = [
      'no_series',
      'pensionerCode',
      'documentNo',
      'document_no',
      'document_number',
      'claim_id',
    ];

    const documentId = possibleKeys
      .map((key) => clickedItem?.[key])
      .find(Boolean);
    try {
      const res = await workflowsApiService.get(
        workflowsEndpoints.getDocumentHistoryByCurrentDocNo(documentId)
      );
      console.log(
        res.data.data,
        'Workflow status for document now is here ****************************'
      );
      setDocumentHistory(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (clickedItem) {
      getDocumentStatus();
    }
  }, [clickedItem]);

  const [openClaimInquiryDialpog, setOpenClaimInquiryDialog] = useState(false);

  return (
    <div>
      {' '}
      <BaseExpandCard
        open={openClaimInquiryDialpog}
        onClose={() => setOpenClaimInquiryDialog(false)}
        title="Document History"
      >
        <DocumentHistory
          setOpenClaimInquiryDialog={setOpenClaimInquiryDialog}
          data={documentHistory}
        />
      </BaseExpandCard>
      {documentHistory && documentHistory.length > 0 ? (
        <div className="">
          <div className="my-1">
            <Button
              variant="text"
              size="small"
              startIcon={<Launch />}
              onClick={() => setOpenClaimInquiryDialog(true)}
            >
              View Complete History
            </Button>
          </div>
          <DocumentHistForWorkflow data={documentHistory} />
        </div>
      ) : (
        <div
          className="flex justify-center items-center h-full"
          style={{ height: '40vh' }} // Ensure it takes the full viewport height
        >
          <BaseEmptyComponent scale={1.2} title="No Document History" />
        </div>
      )}
    </div>
  );
}

export default BaseWorkFlow2;
