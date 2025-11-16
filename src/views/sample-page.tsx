// material-ui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| HOME PAGE ||============================== //

export default function SamplePage() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)',
        p: 3
      }}
    >
      <MainCard
        sx={{
          maxWidth: 900,
          width: '100%',
          textAlign: 'center',
          p: 4
        }}
      >
        <Typography variant="h1" gutterBottom sx={{ mb: 3 }}>
          Welcome to Group 5&apos;s Movie and TV Show Application!
        </Typography>

        <Typography variant="h4" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
          This is a temporary homepage.
        </Typography>

        <Typography variant="h3" gutterBottom sx={{ mt: 4, mb: 2, textAlign: 'left' }}>
          Current Functionality:
        </Typography>

        <List sx={{ textAlign: 'left' }}>
          <ListItem>
            <ListItemText
              primary="Movies Page"
              secondary="Browse and view detailed information about movies with single and multi-view modes"
              primaryTypographyProps={{ variant: 'h5' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="User Authentication"
              secondary="Login, logout, and session management"
              primaryTypographyProps={{ variant: 'h5' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Dark/Light Theme Toggle"
              secondary="Switch between dark and light modes from the profile menu"
              primaryTypographyProps={{ variant: 'h5' }}
            />
          </ListItem>
        </List>
      </MainCard>
    </Box>
  );
}
