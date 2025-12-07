'use client';

import { useState, useEffect } from 'react';

// next
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

// icons
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import LeftOutlined from '@ant-design/icons/LeftOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';

// project imports
import MainCard from 'components/MainCard';
import DeleteConfirmationModal from 'components/DeleteConfirmationModal';
import { tvShowApi, type TVShow } from 'services/tvShowApi';

// Mock TV show data

// ==============================|| TV SHOWS PAGE ||============================== //

export default function TVShowsPage() {
  const router = useRouter();
  const [selectedShowIndex, setSelectedShowIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<'single' | 'multi'>('multi');
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showToDelete, setShowToDelete] = useState<TVShow | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const showsPerPage = 9;

  // API state management
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  // Cache to store fetched shows and reduce redundant API calls
  const [showCache, setShowCache] = useState<
    Map<
      string,
      {
        data: TVShow[];
        totalPages: number;
        timestamp: number;
      }
    >
  >(new Map());

  const selectedShow = tvShows[selectedShowIndex];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleImageError = (showId: number) => {
    setImageErrors((prev) => new Set(prev).add(showId));
  };

  const getImageUrl = (show: TVShow) => {
    if (imageErrors.has(show.tv_show_id)) {
      return 'https://placehold.co/500x750/1a1a1a/ffffff?text=No+Image+Available';
    }
    return `https://image.tmdb.org/t/p/w500${show.poster_url}`;
  };

  // Fetch TV shows from API with debounce for search
  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create cache key based on search parameters
        const limit = viewMode === 'multi' ? showsPerPage : 20;
        const currentPage = viewMode === 'multi' ? page : 1;
        const cacheKey = `${searchText || 'all'}-${currentPage}-${limit}`;

        // Check cache first (cache valid for 5 minutes)
        const cached = showCache.get(cacheKey);
        const now = Date.now();
        const cacheExpiry = 5 * 60 * 1000; // 5 minutes

        if (cached && now - cached.timestamp < cacheExpiry) {
          console.log('Using cached data for:', cacheKey);
          setTVShows(cached.data);
          setTotalPages(cached.totalPages);
          setSelectedShowIndex(0);
          setLoading(false);
          return;
        }

        // Fetch from API if not in cache or cache expired
        console.log('Fetching from API:', cacheKey);
        const response = await tvShowApi.getTVShows({
          name: searchText || undefined,
          page: currentPage,
          limit: limit
        });

        setTVShows(response.data);
        setTotalPages(response.pagination.totalPages);

        // Update cache
        setShowCache(
          (prevCache) =>
            new Map(
              prevCache.set(cacheKey, {
                data: response.data,
                totalPages: response.pagination.totalPages,
                timestamp: now
              })
            )
        );

        // Reset selected show index when data changes
        setSelectedShowIndex(0);
      } catch (err) {
        console.error('Error fetching TV shows:', err);
        setError('Failed to load TV shows. Please try again.');
        setTVShows([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(
      () => {
        fetchTVShows();
      },
      searchText ? 500 : 0
    ); // 500ms debounce for search, immediate for other changes

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, page, viewMode]);

  const handleViewChange = (_event: React.MouseEvent<HTMLElement>, newView: 'single' | 'multi' | null) => {
    if (newView !== null) {
      setViewMode(newView);
      setPage(1);
    }
  };

  const handlePreviousShow = () => {
    setSelectedShowIndex((prev) => (prev > 0 ? prev - 1 : tvShows.length - 1));
  };

  const handleNextShow = () => {
    setSelectedShowIndex((prev) => (prev < tvShows.length - 1 ? prev + 1 : 0));
  };

  const handleShowClick = (id: number) => {
    router.push(`/tv-shows/${id}`);
  };

  // DESIGN-ONLY: Delete functionality - no backend API calls
  // This only opens/closes the modal for UI/UX demonstration
  const handleDeleteClick = (e: React.MouseEvent, show: TVShow) => {
    e.stopPropagation(); // Prevent card click
    setShowToDelete(show);
    setDeleteModalOpen(true);
  };

  // DESIGN-ONLY: Only closes the modal, no actual deletion
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setShowToDelete(null);
  };

  const displayedShows = viewMode === 'multi' ? tvShows : selectedShow ? [selectedShow] : [];

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
        <Typography variant="h4">Loading TV shows...</Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
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
        <Typography variant="h4" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 80px)', p: 3 }}>
      {/* Search Bar and View Toggle */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewChange} size="small">
            <ToggleButton value="multi" aria-label="multi view">
              <AppstoreOutlined style={{ marginRight: 8 }} />
              Multi View
            </ToggleButton>
            <ToggleButton value="single" aria-label="single view">
              <ProfileOutlined style={{ marginRight: 8 }} />
              Single View
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            component={Link}
            href="/add-tv-show"
            variant="contained"
            startIcon={<PlusOutlined />}
            size="medium"
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add TV Show
          </Button>
        </Stack>

        <TextField
          placeholder="Search TV shows..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1); // Reset to page 1 when searching
          }}
          sx={{
            width: 400,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper',
              '& fieldset': {
                borderWidth: 2,
                borderColor: 'primary.main'
              },
              '&:hover fieldset': {
                borderColor: 'primary.dark'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main'
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined style={{ fontSize: '1.2rem' }} />
              </InputAdornment>
            )
          }}
        />
      </Stack>

      {/* TV Show Display Card */}
      <MainCard
        sx={{
          width: '100%',
          height: 'calc(100% - 50px)',
          overflow: 'auto',
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column',
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
        {tvShows.length === 0 ? (
          /* No TV Shows Found */
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}
          >
            <Typography variant="h4" color="text.secondary">
              No TV shows found
            </Typography>
          </Box>
        ) : viewMode === 'single' ? (
          /* Single TV Show View */
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              height: '100%'
            }}
          >
            {/* Left Arrow */}
            <IconButton onClick={handlePreviousShow} sx={{ flexShrink: 0, height: 'fit-content' }} size="large">
              <LeftOutlined style={{ fontSize: '2rem' }} />
            </IconButton>

            {/* TV Show Content */}
            <Grid container spacing={3} sx={{ flex: 1 }}>
              {/* TV Show Poster */}
              <Grid item xs={12} md={4}>
                <Card elevation={0}>
                  <CardMedia
                    component="img"
                    image={getImageUrl(selectedShow)}
                    alt={selectedShow.name}
                    sx={{ borderRadius: 2, cursor: 'pointer' }}
                    onClick={() => handleShowClick(selectedShow.tv_show_id)}
                    onError={() => handleImageError(selectedShow.tv_show_id)}
                  />
                </Card>
              </Grid>

              {/* TV Show Details */}
              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  {/* Title and Rating */}
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1
                      }}
                    >
                      <Typography variant="h2" gutterBottom>
                        {selectedShow.name}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteOutlined />}
                        onClick={() => handleDeleteClick({ stopPropagation: () => {} } as React.MouseEvent, selectedShow)}
                        sx={{ ml: 2 }}
                      >
                        Delete
                      </Button>
                    </Box>
                    {selectedShow.original_name !== selectedShow.name && (
                      <Typography variant="h5" color="text.secondary" gutterBottom>
                        Original Name: {selectedShow.original_name}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                      <Chip label={`⭐ ${selectedShow.vote_average}/10`} color="primary" size="small" />
                      {selectedShow.episode_run_time > 0 && (
                        <Chip label={`${selectedShow.episode_run_time} min/ep`} variant="outlined" size="small" />
                      )}
                      <Chip label={`${selectedShow.number_of_seasons} Seasons`} variant="outlined" size="small" />
                      <Chip label={`${selectedShow.number_of_episodes} Episodes`} variant="outlined" size="small" />
                    </Stack>
                  </Box>

                  {/* Genres */}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Genres
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {selectedShow.genres.split(', ').map((genre) => (
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
                      {selectedShow.overview}
                    </Typography>
                  </Box>

                  {/* Creators - Hide if N/A */}
                  {selectedShow.creators !== 'N/A' && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Creators
                      </Typography>
                      <Typography variant="body1">{selectedShow.creators}</Typography>
                    </Box>
                  )}

                  {/* Networks and Production - Only show if available */}
                  {(selectedShow.networks !== 'N/A' || selectedShow.production_companies !== 'N/A') && (
                    <Grid container spacing={2}>
                      {selectedShow.networks !== 'N/A' && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Network
                          </Typography>
                          <Typography variant="body1">{selectedShow.networks}</Typography>
                        </Grid>
                      )}
                      {selectedShow.production_companies !== 'N/A' && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Production Companies
                          </Typography>
                          <Typography variant="body1">{selectedShow.production_companies}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  )}

                  {/* Air Dates */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        First Air Date
                      </Typography>
                      <Typography variant="body1">{formatDate(selectedShow.first_air_date)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Last Air Date
                      </Typography>
                      <Typography variant="body1">{formatDate(selectedShow.last_air_date)}</Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
            </Grid>

            {/* Right Arrow */}
            <IconButton onClick={handleNextShow} sx={{ flexShrink: 0, height: 'fit-content' }} size="large">
              <RightOutlined style={{ fontSize: '2rem' }} />
            </IconButton>
          </Box>
        ) : (
          /* Multi TV Show View */
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Grid container spacing={3}>
              {displayedShows.map((show) => (
                <Grid item xs={12} sm={6} md={4} key={show.tv_show_id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      position: 'relative',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => handleShowClick(show.tv_show_id)}
                  >
                    {/* Delete Icon Button */}
                    <IconButton
                      onClick={(e) => handleDeleteClick(e, show)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          backgroundColor: 'error.light',
                          color: 'error.contrastText'
                        }
                      }}
                      color="error"
                      size="small"
                    >
                      <DeleteOutlined />
                    </IconButton>
                    <CardMedia
                      component="img"
                      height="300"
                      image={getImageUrl(show)}
                      alt={show.name}
                      onError={() => handleImageError(show.tv_show_id)}
                    />
                    <Box
                      sx={{
                        p: 2,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Typography variant="h5" gutterBottom>
                        {show.name}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap" useFlexGap>
                        <Chip label={`⭐ ${show.vote_average}`} size="small" color="primary" />
                        <Chip label={`${show.number_of_seasons} Seasons`} size="small" variant="outlined" />
                        <Chip label={`${show.number_of_episodes} Eps`} size="small" variant="outlined" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {show.genres}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {show.overview}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination count={totalPages} page={page} onChange={(_e, value) => setPage(value)} color="primary" />
            </Box>
          </Box>
        )}
      </MainCard>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Delete TV Show"
        itemName={showToDelete?.name || ''}
        itemType="tv-show"
      />
    </Box>
  );
}
