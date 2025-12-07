'use client';

// ============================|| DEPRECATED - NOT FUNCTIONAL ||============================ //
// NOTE: This component is NO LONGER FUNCTIONAL with the new credential API.
// The new API (https://credential-api-giuj.onrender.com/) does not support
// password reset via email. Password changes can only be done while logged in
// using the /auth/user/password/change endpoint.
// This file is kept for reference but should not be used.
// ======================================================================================== //

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// ============================|| FORGOT PASSWORD - NOT FUNCTIONAL ||============================ //

export default function AuthForgotPassword() {

  return (
    <Formik
      initialValues={{
        email: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
      })}
      onSubmit={async (_values, { setErrors, setSubmitting }) => {
        // This endpoint no longer exists in the new API
        setErrors({
          submit: 'Password reset via email is no longer supported. Please contact support or change your password while logged in.'
        });
        setSubmitting(false);
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-forgot">Email Address</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                  id="email-forgot"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  inputProps={{}}
                />
              </Stack>
              {touched.email && errors.email && (
                <FormHelperText error id="helper-text-email-forgot">
                  {errors.email}
                </FormHelperText>
              )}
            </Grid>
            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12} sx={{ mb: -2 }}>
              <Typography variant="caption">Do not forgot to check SPAM box.</Typography>
            </Grid>
            <Grid item xs={12}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Send Password Reset Email
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
