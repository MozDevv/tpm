import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  IconButton,
} from '@mui/material';
import React from 'react';
import { usePayrollProgressStore } from '@/zustand/store';
import CheckIcon from '@mui/icons-material/Check';

function NotificationMenu() {
  const { unreadNotifications, markAsRead } = usePayrollProgressStore();

  return (
    <div>
      <Box p={2}>
        <Typography variant="h5" fontSize={16} color="primary">
          Notifications
        </Typography>
        <Typography variant="h5" fontSize={11} mb={-1} sx={{ color: 'gray' }}>
          Payroll Progress
        </Typography>
        <Box>
          <List>
            {unreadNotifications.map((notification, index) => (
              <ListItem
                sx={{ width: '100%' }}
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="mark as read"
                    onClick={() => markAsRead(notification)}
                  >
                    <CheckIcon />
                  </IconButton>
                }
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{ width: '26px', height: '26px' }}
                      src="/bell.png"
                    ></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      ml: -3,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
                      {notification.stage}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'gray',
                      }}
                    >
                      {notification.description}
                    </Typography>
                  </ListItemText>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </div>
  );
}

export default NotificationMenu;
