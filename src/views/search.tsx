'use client';

import { useState, useEffect } from 'react';

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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// icons
import SearchOutlined from '@ant-design/icons/SearchOutlined';
// import IdcardOutlined from '@ant-design/icons/IdcardOutlined';
import ClearOutlined from '@ant-design/icons/ClearOutlined';
import VideoCameraOutlined from '@ant-design/icons/VideoCameraOutlined';
import PlayCircleOutlined from '@ant-design/icons/PlayCircleOutlined';

// project imports
import MainCard from 'components/MainCard';
import { movieApi, type Movie } from 'services/movieApi';
import { tvShowApi, type TVShow } from 'services/tvShowApi';

type SearchTab = 'movies' | 'tv-shows';
type ResultItem = Movie | TVShow;

// TMDB Movie Genres (standard movie database genres)
const MOVIE_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Thriller',
  'War',
  'Western'
];

// ==============================|| ADVANCED SEARCH PAGE ||============================== //

export default function SearchPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchTab>('movies');

  // Common search fields
  const [searchText, setSearchText] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');

  // Movie-specific fields
  const [director, setDirector] = useState('');
  const [movieActor, setMovieActor] = useState('');
  const [studio, setStudio] = useState('');

  // TV Show-specific fields
  const [tvActor, setTvActor] = useState('');
  const [network, setNetwork] = useState('');
  const [tvStudio, setTvStudio] = useState('');
  const [status, setStatus] = useState('');

  // TV Show dropdown options
  const [tvGenres, setTvGenres] = useState<string[]>([]);
  const [tvStatuses, setTvStatuses] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Results state
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 12;

  // Fetch TV show genres and statuses when TV Shows tab is selected
  useEffect(() => {
    if (activeTab === 'tv-shows' && tvGenres.length === 0) {
      const fetchOptions = async () => {
        setLoadingOptions(true);
        try {
          const [genres, statuses] = await Promise.all([tvShowApi.getGenres(), tvShowApi.getStatuses()]);
          setTvGenres(genres);
          setTvStatuses(statuses);
        } catch (err) {
          console.error('Error fetching TV show options:', err);
        } finally {
          setLoadingOptions(false);
        }
      };
      fetchOptions();
    }
  }, [activeTab, tvGenres.length]);

  // Perform search for movies
  const searchMovies = async (searchParams?: { page?: number }) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = searchParams?.page || page;

      // Regular search with filters (no ID search for movies)
      const filters: any = {
        page: currentPage,
        limit: resultsPerPage
      };

      if (searchText) filters.title = searchText;
      if (genre) filters.genre = genre;
      if (year) filters.year = Number(year);
      if (director) filters.director = director;
      if (movieActor) filters.actor = movieActor;
      if (studio) filters.studio = studio;

      const response = await movieApi.getMovies(filters);
      setResults(Array.isArray(response.data) ? response.data : []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalResults(response.pagination?.total || 0);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err?.message || 'Failed to perform search. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Perform search for TV shows
  const searchTVShows = async (searchParams?: { page?: number }) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = searchParams?.page || page;

      // Regular search with filters (no ID search for TV shows)
      const filters: any = {
        page: currentPage,
        limit: resultsPerPage
      };

      if (searchText) filters.name = searchText;
      if (genre) filters.genre = genre;
      // Year filter removed - not supported by TV Shows API backend
      if (tvActor) filters.actor = tvActor;
      if (network) filters.network = network;
      if (tvStudio) filters.studio = tvStudio;
      if (status) filters.status = status;

      const response = await tvShowApi.getTVShows(filters);
      setResults(Array.isArray(response.data) ? response.data : []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalResults(response.pagination?.total || 0);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err?.message || 'Failed to perform search. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    setPage(1);
    if (activeTab === 'movies') {
      searchMovies({ page: 1 });
    } else {
      searchTVShows({ page: 1 });
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchText('');
    setGenre('');
    setYear('');
    setDirector('');
    setMovieActor('');
    setStudio('');
    setTvActor('');
    setNetwork('');
    setTvStudio('');
    setStatus('');
    setPage(1);
    setResults([]);
    setError(null);
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: SearchTab) => {
    setActiveTab(newValue);
    handleClearFilters();
  };

  // Handle result click
  const handleResultClick = (item: ResultItem) => {
    if (!item || typeof item !== 'object') {
      return;
    }

    if ('movie_id' in item) {
      const movie = item as Movie;
      router.push(`/movies/${movie.movie_id}`);
    } else if ('tv_show_id' in item) {
      const tvShow = item as TVShow;
      router.push(`/tv-shows/${tvShow.tv_show_id}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 80px)', p: 3 }}>
      <Typography variant="h2" gutterBottom sx={{ mb: 3 }}>
        Advanced Search
      </Typography>

      {/* Tabs */}
      <MainCard sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab
            value="movies"
            label="Movies"
            icon={<VideoCameraOutlined />}
            iconPosition="start"
            sx={{ textTransform: 'none', fontSize: '1rem', fontWeight: 500 }}
          />
          <Tab
            value="tv-shows"
            label="TV Shows"
            icon={<PlayCircleOutlined />}
            iconPosition="start"
            sx={{ textTransform: 'none', fontSize: '1rem', fontWeight: 500 }}
          />
        </Tabs>
      </MainCard>

      {/* Search Controls */}
      <MainCard sx={{ mb: 3, p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">{activeTab === 'movies' ? 'Movie' : 'TV Show'} Search Filters</Typography>
          <Button variant="outlined" startIcon={<ClearOutlined />} onClick={handleClearFilters} size="small">
            Clear All
          </Button>
        </Stack>

        <Grid container spacing={2} alignItems="center">
          {/* Search by Title/Name */}
          <Grid item xs={12} sm={6} md={5}>
            <TextField
              fullWidth
              label={activeTab === 'movies' ? 'Search by Title' : 'Search by Name'}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined />
                    </InputAdornment>
                  )
                }
              }}
            />
          </Grid>

          {/* Genre Filter */}
          <Grid item xs={12} sm={6} md={3}>
            {activeTab === 'movies' ? (
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select value={genre} label="Genre" onChange={(e) => setGenre(e.target.value)}>
                  <MenuItem value="">All Genres</MenuItem>
                  {MOVIE_GENRES.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <FormControl fullWidth disabled={loadingOptions}>
                <InputLabel>Genre</InputLabel>
                <Select value={genre} label="Genre" onChange={(e) => setGenre(e.target.value)}>
                  <MenuItem value="">All Genres</MenuItem>
                  {tvGenres.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>

          {/* Year Filter (Movies) / Network Filter (TV Shows) */}
          {activeTab === 'movies' ? (
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g., 2024"
                type="number"
              />
            </Grid>
          ) : (
            <Grid item xs={12} sm={6} md={2}>
              <TextField fullWidth label="Network" value={network} onChange={(e) => setNetwork(e.target.value)} placeholder="e.g., HBO" />
            </Grid>
          )}

          {/* Search Button */}
          <Grid item xs={12} sm={6} md={2}>
            <Button fullWidth variant="contained" onClick={handleSearch} disabled={loading} sx={{ height: '56px' }}>
              Search
            </Button>
          </Grid>
        </Grid>

        {/* Movie-specific Filters */}
        {activeTab === 'movies' && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Director"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="Director name"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Actor"
                value={movieActor}
                onChange={(e) => setMovieActor(e.target.value)}
                placeholder="Actor name"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Studio" value={studio} onChange={(e) => setStudio(e.target.value)} placeholder="Studio name" />
            </Grid>
          </Grid>
        )}

        {/* TV Show-specific Filters */}
        {activeTab === 'tv-shows' && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Actor" value={tvActor} onChange={(e) => setTvActor(e.target.value)} placeholder="Actor name" />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Studio"
                value={tvStudio}
                onChange={(e) => setTvStudio(e.target.value)}
                placeholder="Studio name"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth disabled={loadingOptions}>
                <InputLabel>Status</InputLabel>
                <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                  <MenuItem value="">All Statuses</MenuItem>
                  {tvStatuses.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </MainCard>

      {/* Results */}
      <MainCard>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px'
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Box>
        ) : results.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No results found. Try adjusting your search criteria.
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 2, p: 2 }}>
              Found {totalResults} result{totalResults !== 1 ? 's' : ''}
            </Typography>
            <Grid container spacing={3}>
              {results
                .filter((item) => item && typeof item === 'object' && ('movie_id' in item || 'tv_show_id' in item))
                .map((item) => {
                  if (!item || typeof item !== 'object') {
                    return null;
                  }

                  const isMovie = 'movie_id' in item;
                  const movie = isMovie ? (item as Movie) : null;
                  const tvShow = !isMovie ? (item as TVShow) : null;

                  if (!movie && !tvShow) {
                    return null;
                  }

                  const posterUrl = movie?.poster_url || tvShow?.poster_url || '';
                  const title = movie?.title || tvShow?.name || 'Unknown';
                  const releaseDate = movie?.release_date || tvShow?.first_air_date || '';
                  const genres = movie?.genres || tvShow?.genres || '';
                  const rating = movie?.tmdb_rating || tvShow?.vote_average || null;
                  const itemId = movie?.movie_id || tvShow?.tv_show_id || 0;

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={itemId}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: 4
                          }
                        }}
                        onClick={() => {
                          if (movie) {
                            handleResultClick(movie);
                          } else if (tvShow) {
                            handleResultClick(tvShow);
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="400"
                          image={`https://image.tmdb.org/t/p/w500${posterUrl}`}
                          alt={title}
                          sx={{ objectFit: 'cover' }}
                        />
                        <Box
                          sx={{
                            p: 2,
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            {title}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap" useFlexGap>
                            {rating && <Chip label={`⭐ ${rating}/10`} size="small" color="primary" />}
                            <Chip label={formatDate(releaseDate)} size="small" variant="outlined" />
                            <Chip label={isMovie ? 'Movie' : 'TV Show'} size="small" color="secondary" />
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {genres}
                          </Typography>
                          {movie ? (
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              {movie.runtime_minutes} min
                            </Typography>
                          ) : tvShow ? (
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              {tvShow.number_of_seasons} Season
                              {tvShow.number_of_seasons !== 1 ? 's' : ''} • {tvShow.number_of_episodes} Episode
                              {tvShow.number_of_episodes !== 1 ? 's' : ''}
                            </Typography>
                          ) : null}
                        </Box>
                      </Card>
                    </Grid>
                  );
                })
                .filter((item) => item !== null)}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, pb: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_e, value) => {
                    setPage(value);
                    if (activeTab === 'movies') {
                      searchMovies({ page: value });
                    } else {
                      searchTVShows({ page: value });
                    }
                  }}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </MainCard>
    </Box>
  );
}
