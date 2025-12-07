// material-ui
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// project import
import AuthWrapper from "sections/auth/AuthWrapper";
import AuthChangePassword from "sections/auth/auth-forms/AuthChangePassword";

// ================================|| CHANGE PASSWORD ||================================ //

export default function ResetPassword() {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack sx={{ mb: { xs: -0.5, sm: 0.5 } }} spacing={1}>
            <Typography variant="h3">Change Password</Typography>
            <Typography color="secondary">
              Please enter your current password and choose a new password
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthChangePassword />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
