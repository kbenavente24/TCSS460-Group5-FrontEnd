'use client';

import { useEffect, useState } from 'react';

// next
import { useRouter } from 'next/navigation';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

// icons
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';

// project imports
import MainCard from 'components/MainCard';
import { movieApi, type Movie } from 'services/movieApi';

// ==============================|| MOVIE DETAIL PAGE ||============================== //

export default function MovieDetailPage({ id }: { id?: string }) {
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) {
        setMovie(null);
        setLoading(false);
        return;
      }

      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        setMovie(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const movieData = await movieApi.getMovieById(parsedId);
        setMovie(movieData);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Failed to load movie');
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const formatCurrency = (amount: string) => {
    const num = parseInt(amount);
    if (num === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <Box sx={{ height: 'calc(100vh - 80px)', p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <MainCard sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4">Loading movie...</Typography>
        </MainCard>
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Box sx={{ height: 'calc(100vh - 80px)', p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <MainCard sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4">Movie not found</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => router.push('/movies')}>
            Back to Movies
          </Button>
        </MainCard>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 80px)', p: 3 }}>
      {/* Back Button */}
      <Button startIcon={<ArrowLeftOutlined />} onClick={() => router.push('/movies')} sx={{ mb: 2 }} variant="outlined">
        Back to Movies
      </Button>

      {/* Movie Detail Card */}
      <MainCard
        sx={{
          width: '100%',
          height: 'calc(100% - 80px)',
          overflow: 'auto',
          overflowY: 'scroll',
          '&::-webkit-scrollbar': {
            width: '12px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'background.paper'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#424242',
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: '#303030'
            }
          }
        }}
      >
        <Grid container spacing={4}>
          {/* Movie Poster */}
          <Grid item xs={12} md={4}>
            <Card elevation={0}>
              <CardMedia
                component="img"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_url}`}
                alt={movie.title}
                sx={{ borderRadius: 2 }}
              />
            </Card>
          </Grid>

          {/* Movie Details */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Title and Rating */}
              <Box>
                <Typography variant="h2" gutterBottom>
                  {movie.title}
                </Typography>
                {movie.original_title !== movie.title && (
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    Original Title: {movie.original_title}
                  </Typography>
                )}
                <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                  <Chip label={movie.mpa_rating} color="primary" size="small" />
                  <Chip label={`${movie.runtime_minutes} min`} variant="outlined" size="small" />
                  <Chip label={formatDate(movie.release_date)} variant="outlined" size="small" />
                </Stack>
              </Box>

              {/* Genres */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Genres
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {movie.genres.split(', ').map((genre) => (
                    <Chip key={genre} label={genre} size="small" />
                  ))}
                </Stack>
              </Box>

              {/* Overview */}
              <Box>
                <Typography variant="h5" gutterBottom>
                  Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {movie.overview}
                </Typography>
              </Box>

              {/* Director */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Director
                </Typography>
                <Typography variant="body1">{movie.directors}</Typography>
              </Box>

              {/* Budget and Revenue */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Budget
                  </Typography>
                  <Typography variant="h6">{formatCurrency(movie.budget)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Revenue
                  </Typography>
                  <Typography variant="h6">{formatCurrency(movie.revenue)}</Typography>
                </Grid>
              </Grid>

              {/* Release Date */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Release Date
                </Typography>
                <Typography variant="body1">{formatDate(movie.release_date)}</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    </Box>
  );
}

