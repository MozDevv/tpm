import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  TextareaAutosize,
  Divider,
  Button,
} from '@mui/material';
import endpoints, { apiService } from '../services/setupsApi';
import { message } from 'antd';

export const FieldDocuments = ({ fieldData, clickedItem }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [comments, setComments] = useState('');
  const [approved, setApproved] = useState(false);

  const fetchCurrentExitGround = async () => {
    try {
      const res = await apiService.get(
        endpoints.getExitGroundbyId(clickedItem?.exit_grounds)
      );
      if (res.data.succeeded) {
        const documents = res.data.data[0].awardDocuments.map((doc) => ({
          ...doc,
          document: doc.document,
          required: doc.required,
          pensionerUpload: doc.pensioner_upload,
          has_two_sides: doc.has_two_sides,
          front: doc.front,
          back: doc.back,

          verificationSections: doc.verificationSections,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCurrentExitGround();
  }, []);
  const [errors, setErrors] = useState({
    status: false,
    message: '',
  });

  if (!fieldData || !fieldData.documents || fieldData.documents.length === 0) {
    return <Typography>No documents available</Typography>;
  }

  const handleTabChange = (event, newIndex) => {
    setSelectedIndex(newIndex);
  };

  const handleApprove = async () => {
    const data = {
      selectionId: fieldData.documents[selectedIndex].selectionId,
      comments,
    };
    try {
      const response = await apiService.post(
        endpoints.verifyPensionerDocument,
        data
      );
      if (response.data.succeeded) {
        message.success('Document approved successfully');
      } else if (
        response.data.succeeded === false &&
        response.data.messages &&
        response.data.messages.length > 0
      ) {
        message.error(response.data.messages[0]);
      } else {
        message.error('An error occurred while approving document');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ padding: 3, width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Documents for: {fieldData.name}
      </Typography>

      {/* Tab Navigation for Multiple Documents */}
      <Tabs
        value={selectedIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          marginBottom: 2,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            color: '#006990', // Unselected tab color
          },
          '& .Mui-selected': {
            color: '#006990', // Selected tab color
          },
        }}
      >
        {fieldData.documents.map((doc, index) => (
          <Tab key={index} label={doc.name} />
        ))}
      </Tabs>

      <Grid container>
        {/* Left Side: Document Viewer */}
        <Grid item xs={9}>
          <Card
            sx={{
              height: '70vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* {fieldData.documents[selectedIndex].fileUrl ? (
              <iframe
                src={fieldData.documents[selectedIndex].fileUrl }
                width="100%"
                height="100%"
                style={{ border: 'none', borderRadius: '8px' }}
                title="Document Preview"
              />
            ) : (
              <Typography >
                No file available for preview
              </Typography>
            )} */}

            <iframe
              src="https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf"
              width="100%"
              height="100%"
              style={{ border: 'none', borderRadius: '8px' }}
              title="Document Preview"
            />
          </Card>
        </Grid>

        {/* Right Side: Document Details */}
        <Grid item xs={3}>
          <div className="">
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary.main">
                Document Details
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                }}
              >
                <strong>Name:</strong> {fieldData.documents[selectedIndex].name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                }}
              >
                <strong>Description:</strong>{' '}
                {fieldData.documents[selectedIndex].description}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                }}
              >
                <strong>File Type:</strong>{' '}
                {fieldData.documents[selectedIndex].extenstions}
              </Typography>
            </CardContent>
          </div>

          <Divider
            sx={{
              mb: 4,
            }}
          />

          <div className="pl-3">
            <div className="text-base text-primary font-semibold mb-3">
              Document Verification & Approval
            </div>
            <label
              htmlFor="comments"
              className="text-xs font-medium text-gray-700"
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
            <div className="mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="approveCheckbox"
                  className="mr-2"
                  onChange={(e) => setApproved(e.target.checked)}
                />
                <label
                  htmlFor="approveCheckbox"
                  className="text-[12px] text-gray-700 "
                >
                  I hereby approve this document is valid and accurate.
                </label>
              </div>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleApprove}
                sx={{ mt: 5 }}
                disabled={!approved} // Disable the button if not approved
              >
                Approve
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};
