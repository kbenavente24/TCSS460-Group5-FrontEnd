'use client';

import { useEffect, useState, SyntheticEvent } from 'react';

// next
import NextLink from 'next/link';
import { signIn } from 'next-auth/react';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { APP_DEFAULT_PATH } from 'config';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// types
import { StringColorProps } from 'types/password';

export default function AuthRegister({ providers, csrfToken }: any) {
  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

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
    <>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          username: '',
          phone: '',
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          firstname: Yup.string().max(255).required('First Name is required'),
          lastname: Yup.string().max(255).required('Last Name is required'),
          username: Yup.string()
            .min(3, 'Username must be at least 3 characters')
            .max(50, 'Username must be less than 50 characters')
            .matches(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
            .required('Username is required'),
          phone: Yup.string()
            .matches(/^\d{10,}$/, 'Phone number must be at least 10 digits')
            .required('Phone number is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .max(128, 'Password must be less than 128 characters')
        })}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          const trimmedEmail = values.email.trim();
          signIn('register', {
            redirect: false,
            firstname: values.firstname,
            lastname: values.lastname,
            username: values.username,
            phone: values.phone,
            email: trimmedEmail,
            password: values.password,
            callbackUrl: APP_DEFAULT_PATH
          }).then((res: any) => {
            if (res?.error) {
              setErrors({ submit: res.error });
              setSubmitting(false);
            } else if (res?.ok) {
              // Registration successful - show welcome dialog
              setShowWelcomeDialog(true);
            }
          });
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <Grid container spacing={3}>
              {/* First Name */}
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="firstname-signup"
                    type="text"
                    name="firstname"
                    value={values.firstname}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your First Name"
                    error={Boolean(touched.firstname && errors.firstname)}
                  />
                </Stack>
                {touched.firstname && errors.firstname && <FormHelperText error>{errors.firstname}</FormHelperText>}
              </Grid>

              {/* Last Name */}
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="lastname-signup">Last Name*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="lastname-signup"
                    type="text"
                    name="lastname"
                    value={values.lastname}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your Last Name"
                    error={Boolean(touched.lastname && errors.lastname)}
                  />
                </Stack>
                {touched.lastname && errors.lastname && <FormHelperText error>{errors.lastname}</FormHelperText>}
              </Grid>

              {/* Username */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="username-signup">Username*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="username-signup"
                    type="text"
                    name="username"
                    value={values.username}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    error={Boolean(touched.username && errors.username)}
                  />
                </Stack>
                {touched.username && errors.username && <FormHelperText error>{errors.username}</FormHelperText>}
              </Grid>

              {/* Phone */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="phone-signup">Phone Number*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="phone-signup"
                    type="text"
                    name="phone"
                    value={values.phone}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    error={Boolean(touched.phone && errors.phone)}
                  />
                </Stack>
                {touched.phone && errors.phone && <FormHelperText error>{errors.phone}</FormHelperText>}
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="email-signup"
                    type="email"
                    name="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
              </Grid>

              {/* Password */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">Password*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    placeholder="Enter password"
                    error={Boolean(touched.password && errors.password)}
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
                  />
                </Stack>
                {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
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

              {/* Terms */}
              <Grid item xs={12} sx={{ mt: -1 }}>
                <Typography variant="body2">
                  By Signing up, you agree to our &nbsp;
                  <Link component={NextLink} href="/" variant="subtitle2">
                    Terms of Service
                  </Link>
                  &nbsp; and &nbsp;
                  <Link component={NextLink} href="/" variant="subtitle2">
                    Privacy Policy
                  </Link>
                </Typography>
              </Grid>

              {/* Submission Error */}
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}

              {/* Submit Button */}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Create Account
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      {/* Welcome Dialog */}
      <Dialog
        open={showWelcomeDialog}
        onClose={() => setShowWelcomeDialog(false)}
        aria-labelledby="welcome-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="welcome-dialog-title">Welcome to Our App!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Thank you for registering! Your account has been created successfully. You can now log in and start using the application.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWelcomeDialog(false)} color="primary" variant="contained" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
