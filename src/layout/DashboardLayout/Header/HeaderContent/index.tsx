// material-ui
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// next
import Link from 'next/link';

// project import
import Profile from './Profile';
import FullScreen from './FullScreen';
import MobileSection from './MobileSection';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  return (
    <>
      {/* App Name - Top Left */}
      <Typography
        variant="h3"
        component={Link}
        href="/home"
        sx={{
          fontWeight: 700,
          color: '#FFFFFF',
          textDecoration: 'none',
          ml: 2,
          whiteSpace: 'nowrap',
          '&:hover': {
            color: '#E0E0E0'
          }
        }}
      >
        Group 5&apos;s Movie & TV Show App
      </Typography>

      <Box sx={{ width: '100%', ml: 1 }} />

      {/* Navigation Links - Top Right */}
      {!downLG && (
        <Stack direction="row" spacing={4} sx={{ mr: 3 }}>
          <Button
            component={Link}
            href="/home"
            sx={{ color: '#FFFFFF', whiteSpace: 'nowrap', fontSize: '1.1rem', fontWeight: 500, '&:hover': { color: '#E0E0E0' } }}
          >
            Home
          </Button>
          <Button
            component={Link}
            href="/movies"
            sx={{ color: '#FFFFFF', whiteSpace: 'nowrap', fontSize: '1.1rem', fontWeight: 500, '&:hover': { color: '#E0E0E0' } }}
          >
            Movies
          </Button>
          <Button
            component={Link}
            href="/tv-shows"
            sx={{ color: '#FFFFFF', whiteSpace: 'nowrap', fontSize: '1.1rem', fontWeight: 500, '&:hover': { color: '#E0E0E0' } }}
          >
            TV Shows
          </Button>
          <Button
            component={Link}
            href="/search"
            sx={{ color: '#FFFFFF', whiteSpace: 'nowrap', fontSize: '1.1rem', fontWeight: 500, '&:hover': { color: '#E0E0E0' } }}
          >
            Search
          </Button>
          <Button
            component={Link}
            href="/top10"
            sx={{ color: '#FFFFFF', whiteSpace: 'nowrap', fontSize: '1.1rem', fontWeight: 500, '&:hover': { color: '#E0E0E0' } }}
          >
            My Top 10s
          </Button>
        </Stack>
      )}

      {!downLG && <FullScreen />}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
