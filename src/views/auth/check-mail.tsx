'use client';

// ============================|| DEPRECATED - NOT FUNCTIONAL ||============================ //
// NOTE: This component is NO LONGER FUNCTIONAL with the new credential API.
// The new API (https://credential-api-giuj.onrender.com/) does not support
// password reset via email/token. Password changes can only be done while logged in
// using the /auth/user/password/change endpoint.
// This file is kept for reference but should not be used.
// ======================================================================================== //

import { useEffect, useState, SyntheticEvent } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import AuthWrapper from 'sections/auth/AuthWrapper';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// types
import { StringColorProps } from 'types/password';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ================================|| CHECK MAIL - RESET PASSWORD - NOT FUNCTIONAL ||================================ //

export default function CheckMail() {
  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Reset Your Password</Typography>
            <Typography color="secondary" sx={{ mb: 0.5, mt: 1.25 }}>
              We have sent a password reset code to your email. Enter the code below along with your new password.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Formik
            initialValues={{
              token: '',
              password: '',
              confirmPassword: '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              token: Yup.string().required('Reset code is required'),
              password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
              confirmPassword: Yup.string()
                .required('Confirm Password is required')
                .test('confirmPassword', 'Both Password must be match!', (confirmPassword, yup) => yup.parent.password === confirmPassword)
            })}
            onSubmit={async (_values, { setErrors, setSubmitting }) => {
              // This endpoint no longer exists in the new API
              setErrors({
                submit: 'Password reset via email/token is no longer supported. Please contact support or change your password while logged in.'
              });
              setSubmitting(false);
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="token-reset">Reset Code</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.token && errors.token)}
                        id="token-reset"
                        type="text"
                        value={values.token}
                        name="token"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter reset code from email"
                      />
                    </Stack>
                    {touched.token && errors.token && (
                      <FormHelperText error id="helper-text-token-reset">
                        {errors.token}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password-reset">New Password</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        id="password-reset"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          changePassword(e.target.value);
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              color="secondary"
                            >
                              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </IconButton>
                          </InputAdornment>
                        }
                        placeholder="Enter new password"
                      />
                    </Stack>
                    {touched.password && errors.password && (
                      <FormHelperText error id="helper-text-password-reset">
                        {errors.password}
                      </FormHelperText>
                    )}
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Box
                            sx={{
                              bgcolor: level?.color,
                              width: 85,
                              height: 8,
                              borderRadius: '7px'
                            }}
                          />
                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle1" fontSize="0.75rem">
                            {level?.label}
                          </Typography>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="confirm-password-reset">Confirm Password</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                        id="confirm-password-reset"
                        type="password"
                        value={values.confirmPassword}
                        name="confirmPassword"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                      />
                    </Stack>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <FormHelperText error id="helper-text-confirm-password-reset">
                        {errors.confirmPassword}
                      </FormHelperText>
                    )}
                  </Grid>

                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <AnimateButton>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Reset Password
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
