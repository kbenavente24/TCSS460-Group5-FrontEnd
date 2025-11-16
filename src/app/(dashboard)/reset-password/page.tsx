import ChangePassword from 'sections/auth/auth-forms/ChangePassword';
import MainCard from 'components/MainCard';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ================================|| CHANGE PASSWORD (DASHBOARD) ||================================ //

export default function ChangePasswordPage() {
  return (
    <Box sx={{ height: 'calc(100vh - 80px)', p: 3 }}>
      <MainCard sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack sx={{ mb: { xs: -0.5, sm: 0.5 } }} spacing={1}>
              <Typography variant="h3">Change Password</Typography>
              <Typography color="text.secondary">Update your account password</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Note: Password change functionality will be connected to the API in a future sprint.
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <ChangePassword />
          </Grid>
        </Grid>
      </MainCard>
    </Box>
  );
}
