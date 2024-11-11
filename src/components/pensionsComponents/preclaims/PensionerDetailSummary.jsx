import { Avatar, Divider, IconButton } from '@mui/material';
import { EmailOutlined, PhoneOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { notificationStatusMap } from './Preclaims';
import { message } from 'antd';
import preClaimsEndpoints, {
  apiService,
} from '@/components/services/preclaimsApi';

import { parseDate } from '@/utils/dateFormatter';

function PensionerDetailSummary({ clickedItem, retireeId }) {
  const id = clickedItem?.id;

  const [awardDocuments, setAwardDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retiree, setRetiree] = useState(clickedItem);
  const fetchRetiree = async () => {
    try {
      const res = await apiService.get(
        preClaimsEndpoints.getProspectivePensioner(retireeId)
      );
      const retiree = res.data.data[0];
      setRetiree(retiree);
    } catch (error) {}
  };

  useEffect(() => {
    console.log('retireeId ❤️', retireeId);
    if (retireeId) {
      fetchRetiree();
    }
  }, []);
  return (
    <div className="mt-5">
      <div className="flex items-center flex-col justify-center p-2 gap-2">
        <Avatar sx={{ height: '100px', width: '100px' }} />
        <div className="flex flex-col mt-5 gap-2 items-center justify-center">
          <h5 className="font-semibold text-primary text-base">{`${retiree?.first_name} ${retiree?.surname}`}</h5>
        </div>
      </div>

      <Divider />
      <div className="mt-4 p-2">
        <div className="flex items-center gap-2">
          <IconButton>
            <PhoneOutlined />
          </IconButton>
          <h6 className="font-medium text-primary text-xs">
            {retiree?.phone_number}
          </h6>
        </div>

        <div className="flex items-center gap-2">
          <IconButton>
            <EmailOutlined />
          </IconButton>
          <h6 className="font-medium text-primary text-xs">
            {retiree?.email_address}
          </h6>
        </div>
      </div>
      {retiree?.prospectivePensionerAwards && (
        <div className="my-3 p-2 flex gap-3 flex-col">
          <Divider />
          <div className="flex flex-col gap-2">
            {retiree.prospectivePensionerAwards.map((award) => (
              <div key={award.id} className="flex items-center gap-2">
                <h6 className="font-medium text-primary text-xs">
                  Claim Type:
                </h6>
                <span className="text-xs">{award.pension_award?.prefix}</span>
              </div>
            ))}
          </div>
          {retiree?.exit_grounds && (
            <div className="flex items-center gap-2">
              <h6 className="font-medium text-primary text-xs">Exit Reason:</h6>
              <span className="text-xs">{retiree?.exit_grounds}</span>
            </div>
          )}
        </div>
      )}

      <Divider />

      <div className="mt-8 p-2 flex gap-3 flex-col">
        <div className="flex items-center gap-2">
          <h6 className="font-medium text-primary text-xs">Personal Number</h6>
          <span className="text-xs">{retiree?.personal_number}</span>
        </div>
        <div className="flex items-center gap-2">
          <h6 className="font-medium text-primary text-xs">
            Date of First Appointment
          </h6>
          <span className="text-xs">
            {parseDate(retiree?.date_of_first_appointment)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <h6 className="font-medium text-primary text-xs">
            Date of Confirmation
          </h6>
          <span className="text-xs">
            {parseDate(retiree?.date_of_confirmation)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <h6 className="font-medium text-primary text-xs">Retirement Date</h6>
          <span className="text-xs">{parseDate(retiree?.retirement_date)}</span>
        </div>
        {retiree?.pension_award && (
          <div className="flex items-center gap-2">
            <h6 className="font-medium text-primary text-xs">
              Ministry / Department:{' '}
            </h6>
            <span className="text-xs">{retiree?.pension_award}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <h6 className="font-medium text-primary text-xs">Status:</h6>
          <span className="text-xs">
            {notificationStatusMap[retiree?.notification_status]?.name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PensionerDetailSummary;
