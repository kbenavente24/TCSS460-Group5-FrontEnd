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

        <Typography
          variant="h4"
          color="text.secondary"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Developed by: Kobe Benavente, Balkirat Singh, Pham Nguyen, and MD Khan
          (Shanto)
        </Typography>

        <Typography
          variant="h3"
          gutterBottom
          sx={{ mt: 4, mb: 2, textAlign: 'left' }}
        >
          Features:
        </Typography>

        <List sx={{ textAlign: 'left' }}>
          <ListItem>
            <ListItemText
              primary="Browse Movies"
              secondary="Explore movies with single and multi-view modes, search functionality, and detailed information including cast, directors, budget, and revenue"
              primaryTypographyProps={{ variant: 'h5' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Browse TV Shows"
              secondary="Discover TV shows with single and multi-view modes, search capabilities, and comprehensive details including seasons, episodes, and ratings"
              primaryTypographyProps={{ variant: 'h5' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Advanced Search"
              secondary="Search across both movies and TV shows with advanced filters including genre, year, rating, actors, directors, and studios"
              primaryTypographyProps={{ variant: 'h5' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="My Top 10s"
              secondary="Create and manage personalized Top 10 lists for movies, TV shows, or mixed content. Search and add items, rank them 1-10, and share your lists with others"
              primaryTypographyProps={{ variant: 'h5' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Add Content"
              secondary="Contribute to the database by adding new movies and TV shows with complete information"
              primaryTypographyProps={{ variant: 'h5' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="User Authentication"
              secondary="Secure login, registration, logout, session management, and password reset functionality"
              primaryTypographyProps={{ variant: 'h5' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Dark/Light Theme"
              secondary="Switch between dark and light modes from the profile menu for comfortable viewing"
              primaryTypographyProps={{ variant: 'h5' }}
            />
          </ListItem>
        </List>
      </MainCard>
    </Box>
  );
}
