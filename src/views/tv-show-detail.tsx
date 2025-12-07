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
import { tvShowApi, type TVShow } from 'services/tvShowApi';
export default function TVShowDetailPage({ id }: { id?: string }) {
  const router = useRouter();
  const [tvShow, setTvShow] = useState<TVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTVShow = async () => {
      if (!id) {
        setTvShow(null);
        setLoading(false);
        return;
      }

      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        setTvShow(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch from API
        const show = await tvShowApi.getTVShowById(parsedId);
        setTvShow(show);
      } catch (err) {
        console.error('Error fetching TV show:', err);
        setError('Failed to load TV show details');
        setTvShow(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTVShow();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show loading state
  if (loading) {
    return (
      <Box
        sx={{
          height: 'calc(100vh - 80px)',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h4">Loading TV show details...</Typography>
      </Box>
    );
  }

  // Show error or not found state
  if (!tvShow) {
    return (
      <Box
        sx={{
          height: 'calc(100vh - 80px)',
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <MainCard sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4">{error || 'TV Show not found'}</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => router.push('/tv-shows')}>
            Back to TV Shows
          </Button>
        </MainCard>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 80px)', p: 3 }}>
      {/* Back Button */}
      <Button startIcon={<ArrowLeftOutlined />} onClick={() => router.push('/tv-shows')} sx={{ mb: 2 }} variant="outlined">
        Back to TV Shows
      </Button>

      {/* TV Show Detail Card */}
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
          {/* TV Show Poster */}
          <Grid item xs={12} md={4}>
            <Card elevation={0}>
              <CardMedia
                component="img"
                image={`https://image.tmdb.org/t/p/w500${tvShow.poster_url}`}
                alt={tvShow.name}
                sx={{ borderRadius: 2 }}
              />
            </Card>
          </Grid>

          {/* TV Show Details */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Title and Rating */}
              <Box>
                <Typography variant="h2" gutterBottom>
                  {tvShow.name}
                </Typography>
                {tvShow.original_name !== tvShow.name && (
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    Original Name: {tvShow.original_name}
                  </Typography>
                )}
                <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
                  <Chip label={`⭐ ${tvShow.vote_average}/10`} color="primary" />
                  <Chip label={`${tvShow.number_of_seasons} Seasons`} variant="outlined" />
                  <Chip label={`${tvShow.number_of_episodes} Episodes`} variant="outlined" />
                  {tvShow.status && <Chip label={tvShow.status} color="secondary" variant="outlined" />}
                  {tvShow.popularity && <Chip label={`Popularity: ${Number(tvShow.popularity).toFixed(0)}`} variant="outlined" />}
                  {tvShow.vote_count && <Chip label={`${tvShow.vote_count.toLocaleString()} votes`} variant="outlined" />}
                </Stack>
              </Box>

              {/* Genres */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Genres
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {tvShow.genres.split(', ').map((genre) => (
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
                  {tvShow.overview}
                </Typography>
              </Box>

              {/* Creators - Hide if N/A */}
              {tvShow.creators !== 'N/A' && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Creators
                  </Typography>
                  <Typography variant="body1">{tvShow.creators}</Typography>
                </Box>
              )}

              {/* Air Dates */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    First Air Date
                  </Typography>
                  <Typography variant="body1">{formatDate(tvShow.first_air_date)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Last Air Date
                  </Typography>
                  <Typography variant="body1">{formatDate(tvShow.last_air_date)}</Typography>
                </Grid>
              </Grid>

              {/* Seasons and Episodes */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Number of Seasons
                  </Typography>
                  <Typography variant="h6">{tvShow.number_of_seasons}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Episodes
                  </Typography>
                  <Typography variant="h6">{tvShow.number_of_episodes}</Typography>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    </Box>
  );
}
