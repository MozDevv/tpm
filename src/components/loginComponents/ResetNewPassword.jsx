/* eslint-disable react/no-unescaped-entities */
import { ArrowForward, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import authEndpoints, { AuthApiService } from '../services/authApi';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import OTPInput from 'react-otp-input';
import { useAuth } from '@/context/AuthContext';

function ResetNewPassword() {
  const [errors, setErrors] = useState({
    status: false,
    message: '',
  });
  const searchParams = useSearchParams();

  const username = searchParams.get('username');

  const [showPassword, setShowPassword] = useState(false);

  const [newPassword, setNewPassword] = useState('');

  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const { login } = useAuth();

  const [otp, setOtp] = useState('');
  const router = useRouter();
  const resetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setErrors({
        status: true,
        message: 'Passwords do not match',
      });
      return;
    }

    // Check if password contains a number
    if (!/\d/.test(newPassword)) {
      setErrors({
        status: true,
        message: 'Password must contain at least one number',
      });
      return;
    }

    // Check if password contains a non-alphanumeric character
    if (!/\W/.test(newPassword)) {
      setErrors({
        status: true,
        message:
          'Password must contain at least one non-alphanumeric character',
      });
      return;
    }

    // Check if password contains a number
    if (!/\d/.test(newPassword)) {
      setErrors({
        status: true,
        message: 'Password must contain at least one number',
      });
      return;
    }

    // Check if password has more than 8 characters
    if (newPassword.length < 8) {
      setErrors({
        status: true,
        message: 'Password must have at least 8 characters',
      });
      return;
    }

    const data = {
      otp: otp,
      email: username,
      newpassword: newPassword,
      confirmNewpassword: confirmNewPassword,
    };

    try {
      const response = await AuthApiService.post(
        authEndpoints.resetPassword,
        data
      );

      if (response.data.isSuccess) {
        router.push('/');
        login(response?.data?.data?.token);
      } else if (response.data.message) {
        setErrors({
          status: true,
          message: response.data.message,
        });
      }
    } catch (error) {
      if (error.response.data.message) {
        console.log('data', data);
        setErrors({
          status: true,
          message: error.response.data.message,
        });
      } else {
        console.log('data', data);
        setErrors({
          status: true,
          message: 'An unexpected error occured! Please try again.',
        });
      }
    }
  };
  const maskEmail = (email) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    const maskedName =
      name.charAt(0) +
      '*'.repeat(name.length - 2) +
      name.charAt(name.length - 1);
    return `${maskedName}@${domain}`;
  };

  const [timeLeft, setTimeLeft] = useState(240); // 4 minutes = 240 seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  const handleResendOTP = async () => {
    setIsResendDisabled(true);
    setTimeLeft(240); // Reset to 4 minutes

    try {
      const response = await AuthApiService.post(authEndpoints.resendOtp, {
        email: username,
      });

      if (response.data.isSuccess) {
        console.log('OTP Resent Successfully');
      } else {
        setErrors({ status: true, message: response.data.message });
      }
    } catch (error) {
      setErrors({
        status: true,
        message: error.response?.data?.message || 'Failed to resend OTP.',
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {' '}
      {errors.status && (
        <Typography sx={{ color: 'crimson', fontWeight: 500, mt: 2 }}>
          {errors.message}
        </Typography>
      )}
      <Typography
        sx={{ fontSize: 22, textAlign: 'center' }}
        fontWeight={700}
        mb={1}
        color="primary"
      >
        OTP Verification
      </Typography>
      <Typography
        sx={{ fontSize: 14, textAlign: 'center' }}
        fontWeight={500}
        mb={3}
        color="primary.main"
      >
        We've sent a verification code to your email address
        <br />
        <strong className="mt-2 text-primary">
          {' '}
          {maskEmail(username).toLowerCase()}
        </strong>
      </Typography>
      <FormControl>
        <FormLabel sx={{ fontSize: '13px', fontWeight: '700', color: 'gray' }}>
          Enter OTP
        </FormLabel>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', mt: 2, ml: '-15px' }}
        >
          <OTPInput
            value={otp}
            onChange={(otp) => setOtp(otp)}
            numInputs={6}
            separator={<span style={{ width: '8px' }}></span>}
            inputStyle={{
              width: '70px',
              height: '70px',
              margin: '0 10px',

              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid lightgray',
              textAlign: 'center',
            }}
            renderInput={(props) => <input styles={{}} {...props} />}
            focusStyle={{
              border: '1px solid blue',
            }}
          />
          <div className="absolute bottom-[-20px] right-1 font-montserrat text-xs text-gray-400">
            Code expiring in{' '}
            <strong className="text-primary">
              {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, '0')}
            </strong>
          </div>
        </Box>
      </FormControl>
      <FormControl
        sx={{
          mt: 3,
        }}
      >
        <FormLabel sx={{ fontSize: '13px', fontWeight: '700', color: 'gray' }}>
          New Password
        </FormLabel>
        <TextField
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          fullWidth
          sx={{
            height: '48px',
            width: '512px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: errors.status ? 'crimson' : 'grey',
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {!showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          type={!showPassword ? 'password' : 'text'}
          inputProps={{ style: { height: '12px' } }}
          required
        />
      </FormControl>
      <FormControl>
        <FormLabel sx={{ fontSize: '13px', fontWeight: '700', color: 'gray' }}>
          Confirm New Password
        </FormLabel>
        <TextField
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="Confirm New Password"
          sx={{
            height: '48px',
            width: '512px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: errors.status ? 'crimson' : 'grey',
              },
            },
          }}
          inputProps={{ style: { height: '12px' } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {!showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          type={!showPassword ? 'password' : 'text'}
          fullWidth
          required
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              resetPassword();
            }
          }}
        />
      </FormControl>{' '}
      <Button
        fullWidth
        onClick={resetPassword}
        sx={{
          backgroundColor: 'primary.main',
          '&:hover': { backgroundColor: '#006990' },
          pl: '20px',
          display: 'flex',
          color: 'white',
          justifyContent: 'space-between',
          textTransform: 'none',
          mt: '10px',
        }}
      >
        Reset Password
        <ArrowForward />
      </Button>
      <div className="text-start text-gray-600 text-xs mt-1">
        Didn't get the code?{' '}
        <strong className="text-primary cursor-pointer">Resend OTP</strong>
      </div>
      {/* Render error message if there are errors */}
    </Box>
  );
}

export default ResetNewPassword;
