'use client';
import React, { useEffect, useState } from 'react';
import styles from './navbar.module.css';
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  ListAlt,
  Message,
  MessageOutlined,
  NotificationsOutlined,
  Person,
  SearchOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import { useSelectedItem } from '@/context/NavItemContext';
import { useRouter } from 'next/navigation';
import NotificationMenu from './NotificationMenu';
import { useAuth } from '@/context/AuthContext';
import { useMda } from '@/context/MdaContext';

function Navbar() {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const [anchorEl3, setAnchorEl3] = useState(null);
  const handleClick3 = (event) => {
    setAnchorEl3(event.currentTarget);
  };
  const handleClose3 = () => {
    setAnchorEl3(null);
  };
  const [loading, setLoading] = useState(false);
  const { selectedItem } = useSelectedItem();
  useEffect(() => {
    if (selectedItem !== '') {
      setLoading(false);
    }
  }, [selectedItem]);

  const router = useRouter();
  const { auth, login, logout } = useAuth();

  const { mdaId } = useMda();

  const handleLogout = () => {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('formData');
      localStorage.removeItem('token');
      logout();
    }

    router.push('/');
  };

  return (
    <div style={{ paddingLeft: '10px', paddingTop: '10px' }}>
      <div className={styles.navbar}>
        <div className={styles.left}>
          {selectedItem === 'Dashboard' && (
            <div className={styles.heading}>
              <h1>DashBoard</h1>
              <p>Welcome Back!</p>
            </div>
          )}

          <div>
            <TextField
              type="text"
              size="small"
              sx={{
                '&.MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderRadius: '30px', // Set your desired border radius
                  },
                },
              }}
              InputProps={{
                style: {
                  backgroundColor: 'white',
                  width: '400px',
                  borderRadius: '30px',
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                ),
              }}
              placeholder="Search"
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <IconButton
            sx={{
              backgroundColor: 'white',
              borderRadius: '50%',
            }}
            onClick={handleClick3}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsOutlined
                color="action"
                sx={{
                  color: '#006990',
                }}
              />
            </Badge>
          </IconButton>{' '}
          <Menu
            id="msgs-menu"
            anchorEl={anchorEl3}
            keepMounted
            open={Boolean(anchorEl3)}
            onClose={handleClose3}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            sx={{
              '& .MuiMenu-paper': {
                width: '600px',
                height: '400px',
              },
            }}
          >
            <NotificationMenu />
          </Menu>
          <IconButton
            sx={{
              backgroundColor: 'white',
              borderRadius: '50%',
            }}
          >
            <Badge badgeContent={4} color="error">
              <MessageOutlined
                color="action"
                sx={{
                  color: '#006990',
                }}
              />
            </Badge>
          </IconButton>
          <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <Box>
              <Box
                sx={{ display: 'flex', gap: '4px', fontSize: '15px', mr: 3 }}
              >
                <h6>Hi,</h6>
                <h6
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {auth?.user?.name}
                </h6>
              </Box>
              <h6
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'rgb(153, 153, 153)',
                }}
              >
                Pension Admin
              </h6>
            </Box>{' '}
            <Avatar sx={{ height: '36px', width: '36px' }} />
            <IconButton
              size="large"
              aria-label="show 11 new notifications"
              color="inherit"
              aria-controls="msgs-menu"
              aria-haspopup="true"
              onClick={handleClick2}
              sx={{
                height: '36px',
                width: '36px',
                backgroundColor: '#006990',
                ml: 5,
                ...(typeof anchorEl2 === 'object' && {
                  color: 'primary.main',
                }),
                '&:hover': {
                  backgroundColor: '#0c4f68', // Change to desired hover color
                },
              }}
            >
              <SettingsOutlined sx={{ color: 'white' }} />
            </IconButton>{' '}
            <Menu
              id="msgs-menu"
              anchorEl={anchorEl2}
              keepMounted
              open={Boolean(anchorEl2)}
              onClose={handleClose2}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              sx={{
                '& .MuiMenu-paper': {
                  width: '200px',
                },
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText>My Profile</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Message />
                </ListItemIcon>
                <ListItemText>My Account</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ListAlt width={20} />
                </ListItemIcon>
                <ListItemText>My Tasks</ListItemText>
              </MenuItem>
              <Box mt={1} py={1} px={2}>
                <Button
                  onClick={handleLogout}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Logout
                </Button>
              </Box>
            </Menu>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
