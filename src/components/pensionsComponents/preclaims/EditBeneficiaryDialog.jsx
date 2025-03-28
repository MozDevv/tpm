import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Collapse,
  MenuItem,
  Autocomplete,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Close,
  ExpandLess,
  KeyboardArrowRight,
  Launch,
  TaskAlt,
} from '@mui/icons-material';
import { message, Modal } from 'antd';
import endpoints, { apiService } from '@/components/services/setupsApi';
import axios from 'axios';
import { PORTAL_BASE_URL } from '@/utils/constants';

function EditBeneficiaryDialog({
  open,
  onClose,
  beneficiary,
  isGuardian,
  id,
  clickedItem,
}) {
  const [formData, setFormData] = React.useState(beneficiary || {});
  const [openSections, setOpenSections] = React.useState({
    personalDetails: false,
    sections: false,
    paymentDetails: false,
  });

  React.useEffect(() => {
    setFormData(beneficiary || {});
    console.log('beneficiary', beneficiary);
  }, [beneficiary]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log('Saving data:', formData);
    onClose();
  };

  // Helper function to safely get nested values
  const getNestedValue = (obj, path) => {
    if (!path) return '';
    if (typeof path === 'string') return obj[path] || '';

    return path.reduce((acc, key) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return acc[key];
      }
      return '';
    }, obj);
  };

  // Define fields based on provided column structure
  const fields = {
    personalDetails: [
      { label: 'First Name', name: 'first_name', type: 'text' },
      { label: 'Surname', name: 'surname', type: 'text' },
      { label: 'Other Name', name: 'other_name', type: 'text' },
      { label: 'Identification Number', name: 'identifier', type: 'text' },
      { label: 'National ID', name: 'national_id', type: 'text' },
      { label: 'Email Address', name: 'email_address', type: 'email' },
      { label: 'Phone', name: 'mobile_number', type: 'text' },
      { label: 'Address', name: 'address', type: 'text' },
      { label: 'City', name: 'city', type: 'text' },
      { label: 'Date of Birth', name: 'dob', type: 'date' },
      { label: 'Percentage', name: 'percentage', type: 'number' },
      { label: 'Date of Death', name: 'date_of_death', type: 'date' },
      {
        label: 'Guardian Surname',
        name: ['guardian', 'surname'],
        type: 'text',
      },
      {
        label: 'Guardian First Name',
        name: ['guardian', 'first_name'],
        type: 'text',
      },
      {
        label: 'Guardian Identifier',
        name: ['guardian', 'identifier'],
        type: 'text',
      },
      {
        label: 'Guardian Mobile Number',
        name: ['guardian', 'mobile_number'],
        type: 'text',
      },
      {
        label: 'Guardian Address',
        name: ['guardian', 'address'],
        type: 'text',
      },
      {
        label: 'Guardian Email Address',
        name: ['guardian', 'email_address'],
        type: 'email',
      },
      { label: 'Guardian City', name: ['guardian', 'city'], type: 'text' },
      { label: 'Share Percentage', name: 'share_percentage', type: 'number' },
      { label: 'Identification Type', name: 'identifier_type', type: 'text' },
      { label: 'Gender', name: 'gender', type: 'text' },
      { label: 'Relationship', name: ['relationship', 'name'], type: 'text' },
      {
        label: 'Birth Certificate Number',
        name: 'birth_certificate_no',
        type: 'text',
      },
    ],
    paymentDetails: [
      { label: 'Bank', name: 'bank', type: 'text' },
      { label: 'Bank Branch', name: 'bank_branch', type: 'text' },
      { label: 'Account Name', name: 'account_name', type: 'text' },
      { label: 'Account Number', name: 'account_number', type: 'text' },
    ],
  };

  const handleToggleSection = (section) => {
    setOpenSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewContent, setPreviewContent] = React.useState(null);
  const [previewTitle, setPreviewTitle] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handlePreviewBirthCertificate = async () => {
    if (!formData.birth_certificate_no) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `${PORTAL_BASE_URL}/portal/birthCert/${id}/${formData.birth_certificate_no}`,
        {
          responseType: 'arraybuffer',
        }
      );
      const base64Data = res.data;
      if (base64Data) {
        setPreviewContent(new Blob([res.data], { type: 'application/pdf' }));
        setPreviewTitle('Birth Certificate');
        setPreviewVisible(true);
      } else {
        message.error('No preview available for this document.');
      }
    } catch (error) {
      console.error('Error fetching birth certificate:', error);
      message.error('Failed to fetch birth certificate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        sx={{ padding: '20px' }}
      >
        <div className="p-8">
          <DialogTitle>
            <div className="flex flex-row gap-1 items-center">
              <IconButton
                sx={{
                  border: '1px solid #006990',
                  borderRadius: '50%',
                  padding: '3px',
                  marginRight: '10px',
                  color: '#006990',
                }}
                onClick={onClose}
              >
                <ArrowBack sx={{ color: '#006990' }} />
              </IconButton>
              <p className="text-primary py-3 text-lg font-bold">
                {isGuardian ? 'Guardian' : 'Beneficiary'}:{' '}
                {beneficiary?.relationship?.name || 'No relationship specified'}
              </p>
            </div>
          </DialogTitle>
          <DialogContent>
            {clickedItem?.mortality_status === 1 && (
              <div className="mt-[-10px]">
                <Button startIcon={<TaskAlt />}>Approve Beneficiary</Button>
              </div>
            )}
            <Divider sx={{ margin: '5px 0' }} />
            {Object.keys(fields).map((sectionKey) => (
              <div key={sectionKey} className="p-2">
                <div className="flex items-center gap-2">
                  <h6 className="font-semibold text-primary text-sm">
                    {sectionKey.replace(/([A-Z])/g, ' $1').toUpperCase()}
                  </h6>
                  <IconButton
                    sx={{ ml: '-5px', zIndex: 1 }}
                    onClick={() => handleToggleSection(sectionKey)}
                  >
                    {!openSections[sectionKey] ? (
                      <KeyboardArrowRight
                        sx={{ color: 'primary.main', fontSize: '14px' }}
                      />
                    ) : (
                      <ExpandLess
                        sx={{ color: 'primary.main', fontSize: '14px' }}
                      />
                    )}
                  </IconButton>
                  <hr className="flex-grow border-blue-500 border-opacity-20" />
                </div>
                <Collapse
                  in={!openSections[sectionKey]}
                  timeout="auto"
                  unmountOnExit
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 p-6">
                    {fields[sectionKey].map((field, fieldIndex) => {
                      const fieldValue = getNestedValue(formData, field.name);

                      if (
                        fieldValue === undefined ||
                        fieldValue === null ||
                        fieldValue === ''
                      ) {
                        return null;
                      }

                      const displayValue =
                        typeof fieldValue === 'object'
                          ? fieldValue.name || JSON.stringify(fieldValue)
                          : fieldValue;

                      return (
                        <div key={fieldIndex} className="flex flex-col">
                          <label className="text-xs font-semibold text-gray-600">
                            {field.label}
                          </label>
                          <TextField
                            type={field.type}
                            name={
                              Array.isArray(field.name)
                                ? field.name.join('.')
                                : field.name
                            }
                            disabled={true}
                            variant="outlined"
                            size="small"
                            value={displayValue}
                            onChange={handleChange}
                            fullWidth
                          />
                        </div>
                      );
                    })}

                    {formData.birth_certificate_no &&
                      sectionKey === 'personalDetails' && (
                        <Button
                          startIcon={<Launch />}
                          variant="outlined"
                          onClick={handlePreviewBirthCertificate}
                          size="small"
                          sx={{ mt: 2 }}
                        >
                          Preview Birth Certificate
                        </Button>
                      )}
                  </div>
                </Collapse>
              </div>
            ))}
          </DialogContent>
        </div>
      </Dialog>

      <Modal
        open={previewVisible}
        footer={null}
        title={previewTitle}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        height={600}
        bodyStyle={{ padding: 0, height: '75vh', top: 20, mt: 20 }}
        zIndex={2000}
      >
        {previewContent && (
          <iframe
            src={URL.createObjectURL(previewContent)}
            style={{ width: '100%', height: '100%' }}
            title={previewTitle}
          />
        )}
      </Modal>
    </>
  );
}

export default EditBeneficiaryDialog;
