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
import { Alert, message } from 'antd';

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

  // Example usage in a form component
  const [password, setPassword] = useState('');
  const [validations, setValidations] = useState({
    isValid: false,
    rules: {
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    },
  });

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    setValidations(validatePassword(newPassword));
  };

  const validatePassword = (password) => {
    const rules = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    return {
      isValid: Object.values(rules).every(Boolean),
      rules,
    };
  };

  const { login } = useAuth();

  const [otp, setOtp] = useState('');
  const router = useRouter();
  const resetPassword = async () => {
    if (validations.isValid === false) {
      setErrors({
        status: true,
        message: 'Password does not meet requirements, please check the rules',
      });
      return;
    }
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

  const resendOtp = async () => {
    try {
      const response = await AuthApiService.post(authEndpoints.resendOtp, {
        email: username,
      });

      if (response.data.isSuccess) {
        console.log('OTP Resent Successfully');
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      setErrors({
        status: true,
        message: error.response?.data?.message || 'Failed to resend OTP.',
      });
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

    try {
      const response = await AuthApiService.post(authEndpoints.resendOtp, {
        email: username,
      });

      if (response.data.isSuccess) {
        message.success('OTP Resent Successfully');
        setTimeLeft(240); // Reset to 4 minutes
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
        <Alert message={errors.message} type="error" showIcon closable />
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
      <div className="mt-1 text-xs">
        Valid Password rules
        <ul className="pl-2">
          <li
            style={{
              color: validations.rules.minLength ? 'green' : 'red',
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div className="pr-1">
              {validations.rules.minLength ? '✓' : '✗'}
            </div>
            At least 8 characters
          </li>
          <li
            style={{
              color: validations.rules.hasUpperCase ? 'green' : 'red',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div className="pr-1">
              {validations.rules.hasUpperCase ? '✓' : '✗'}
            </div>
            Contains an uppercase letter
          </li>
          <li
            style={{
              color: validations.rules.hasLowerCase ? 'green' : 'red',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div className="pr-1">
              {validations.rules.hasLowerCase ? '✓' : '✗'}
            </div>
            Contains a lowercase letter
          </li>
          <li
            style={{
              color: validations.rules.hasNumber ? 'green' : 'red',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div className="pr-1">
              {validations.rules.hasNumber ? '✓' : '✗'}
            </div>
            Contains a digit
          </li>
          <li
            style={{
              color: validations.rules.hasSpecialChar ? 'green' : 'red',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div className="pr-1">
              {validations.rules.hasSpecialChar ? '✓' : '✗'}
            </div>
            Contains a special character
          </li>
        </ul>
        <p className="mt-2">
          Special characters include; <strong>! @ $ & # ( ) %</strong> etc.
        </p>
      </div>
      <FormControl sx={{}}>
        <FormLabel sx={{ fontSize: '13px', fontWeight: '700', color: 'gray' }}>
          New Password
        </FormLabel>
        <TextField
          value={newPassword}
          onChange={(e) => handlePasswordChange(e)}
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
        <strong
          className="text-primary cursor-pointer"
          onClick={handleResendOTP}
        >
          Resend OTP
        </strong>
      </div>
      {/* Render error message if there are errors */}
    </Box>
  );
}

export default ResetNewPassword;
