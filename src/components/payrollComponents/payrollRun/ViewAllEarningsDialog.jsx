import React from 'react';

import { Dialog, IconButton, Tooltip, Divider } from '@mui/material';
import { ArrowBack, OpenInFull } from '@mui/icons-material';
import ListNavigation from '@/components/baseComponents/ListNavigation';

function ViewAllEarningsDialog({
  openDrilldown,
  setOpenDrilldown,
  title,
  updatedHandlers = {},
  permissions = [],
  children,
}) {
  return (
    <div>
      <Dialog
        open={openDrilldown}
        maxWidth="lg"
        sx={{
          '& .MuiPaper-root': {
            minHeight: '85vh',
            maxHeight: '75vh',
            minWidth: '70vw',
            maxWidth: '70vw',
            overflow: 'hidden',
          },
          p: 10,
        }}
        onClose={() => setOpenDrilldown(false)}
      >
        <div className="px-10">
          <div className="flex items-center px-2 pt-4 justify-between w-full sticky top-0 z-[99999999] bg-white">
            <div className="flex items-center gap-1 mt-10">
              <IconButton
                sx={{
                  border: '1px solid #006990',
                  borderRadius: '50%',
                  padding: '3px',
                  marginRight: '10px',
                  color: '#006990',
                }}
                onClick={() => setOpenDrilldown(false)}
              >
                <ArrowBack sx={{ color: '#006990' }} />
              </IconButton>
              <p className="text-lg text-primary font-semibold">{title}</p>
            </div>
            <div className="flex items-center">
              <IconButton>
                <Tooltip>
                  <OpenInFull
                    color="primary"
                    sx={{
                      fontSize: '18px',
                      mt: '4px',
                    }}
                  />
                </Tooltip>
              </IconButton>
            </div>
          </div>
          <div className="ag-theme-quartz w-full h-full" style={{}}>
            <div className="w-[98%] flex flex-col mb-8 gap-4 mt-4 ml-2">
              <ListNavigation
                handlers={updatedHandlers}
                permissions={permissions}
              />
              <Divider sx={{ mx: 2 }} />
            </div>
            <div className="">{children}</div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default ViewAllEarningsDialog;
