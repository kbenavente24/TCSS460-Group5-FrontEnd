'use client';

import { useState } from 'react';

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

// icons
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import IdcardOutlined from '@ant-design/icons/IdcardOutlined';
import ClearOutlined from '@ant-design/icons/ClearOutlined';

// project imports
import MainCard from 'components/MainCard';
import { movieApi, type Movie } from 'services/movieApi';
import { tvShowApi, type TVShow } from 'services/tvShowApi';

type SearchType = 'all' | 'movies' | 'tv-shows';
type ResultItem = Movie | TVShow;

// ==============================|| SEARCH PAGE ||============================== //

export default function SearchPage() {
  const router = useRouter();
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [searchText, setSearchText] = useState('');
  const [searchId, setSearchId] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [director, setDirector] = useState('');
  const [actor, setActor] = useState('');
  const [studio, setStudio] = useState('');
  const [network, setNetwork] = useState('');
  const [creator, setCreator] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 12;

  // Perform search
  const performSearch = async (searchParams?: {
    type?: SearchType;
    title?: string;
    id?: string;
    genre?: string;
    year?: string;
    director?: string;
    actor?: string;
    studio?: string;
    network?: string;
    creator?: string;
    page?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const type = searchParams?.type || searchType;
      const title = searchParams?.title !== undefined ? searchParams.title : searchText;
      const id = searchParams?.id !== undefined ? searchParams.id : searchId;
      const genreFilter = searchParams?.genre !== undefined ? searchParams.genre : genre;
      const yearFilter = searchParams?.year !== undefined ? searchParams.year : year;
      const directorFilter = searchParams?.director !== undefined ? searchParams.director : director;
      const actorFilter = searchParams?.actor !== undefined ? searchParams.actor : actor;
      const studioFilter = searchParams?.studio !== undefined ? searchParams.studio : studio;
      const networkFilter = searchParams?.network !== undefined ? searchParams.network : network;
      const creatorFilter = searchParams?.creator !== undefined ? searchParams.creator : creator;
      const currentPage = searchParams?.page || page;

      let movieResults: Movie[] = [];
      let tvShowResults: TVShow[] = [];
      let moviePages = 0;
      let tvShowPages = 0;
      let movieTotal = 0;
      let tvShowTotal = 0;

      // Search by ID
      if (id) {
        if (type === 'movies' || type === 'all') {
          try {
            const movie = await movieApi.getMovieById(Number(id));
            movieResults = [movie];
            moviePages = 1;
            movieTotal = 1;
          } catch (err) {
            console.error('Movie ID not found:', err);
          }
        }
        if (type === 'tv-shows' || type === 'all') {
          try {
            const tvShow = await tvShowApi.getTVShowById(Number(id));
            tvShowResults = [tvShow];
            tvShowPages = 1;
            tvShowTotal = 1;
          } catch (err) {
            console.error('TV Show ID not found:', err);
          }
        }
      } else {
        // Regular search with filters
        const movieFilters: any = {
          page: currentPage,
          limit: resultsPerPage
        };

        const tvShowFilters: any = {
          page: currentPage,
          limit: resultsPerPage
        };

        if (title) {
          if (type === 'movies' || type === 'all') {
            movieFilters.title = title;
          }
          if (type === 'tv-shows' || type === 'all') {
            tvShowFilters.name = title;
          }
        }

        if (genreFilter) {
          movieFilters.genre = genreFilter;
          tvShowFilters.genre = genreFilter;
        }

        if (yearFilter) {
          movieFilters.year = Number(yearFilter);
          tvShowFilters.year = Number(yearFilter);
        }

        if (directorFilter && (type === 'movies' || type === 'all')) {
          movieFilters.director = directorFilter;
        }

        if (actorFilter && (type === 'movies' || type === 'all')) {
          movieFilters.actor = actorFilter;
        }

        if (studioFilter && (type === 'movies' || type === 'all')) {
          movieFilters.studio = studioFilter;
        }

        if (networkFilter && (type === 'tv-shows' || type === 'all')) {
          tvShowFilters.network = networkFilter;
        }

        if (creatorFilter && (type === 'tv-shows' || type === 'all')) {
          tvShowFilters.creator = creatorFilter;
        }

        if (type === 'movies' || type === 'all') {
          try {
            const response = await movieApi.getMovies(movieFilters);
            // Ensure data is an array
            movieResults = Array.isArray(response.data) ? response.data : [];
            moviePages = response.pagination?.totalPages || 1;
            movieTotal = response.pagination?.total || movieResults.length;
          } catch (err) {
            console.error('Error fetching movies:', err);
            movieResults = [];
          }
        }

        if (type === 'tv-shows' || type === 'all') {
          try {
            const response = await tvShowApi.getTVShows(tvShowFilters);
            // Ensure data is an array
            tvShowResults = Array.isArray(response.data) ? response.data : [];
            tvShowPages = response.pagination?.totalPages || 1;
            tvShowTotal = response.pagination?.total || tvShowResults.length;
          } catch (err) {
            console.error('Error fetching TV shows:', err);
            tvShowResults = [];
          }
        }
      }

      // Combine results and filter out any invalid items
      const allResults: ResultItem[] = [...movieResults, ...tvShowResults].filter(
        (item) => item && typeof item === 'object' && (('movie_id' in item) || ('tv_show_id' in item))
      );
      setResults(allResults);
      setTotalPages(Math.max(moviePages, tvShowPages));
      setTotalResults(movieTotal + tvShowTotal);
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
    performSearch({ page: 1 });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchText('');
    setSearchId('');
    setGenre('');
    setYear('');
    setDirector('');
    setActor('');
    setStudio('');
    setNetwork('');
    setCreator('');
    setPage(1);
    setResults([]);
  };

  // Handle result click
  const handleResultClick = (item: ResultItem) => {
    if ('movie_id' in item) {
      router.push(`/movies`);
    } else if ('tv_show_id' in item) {
      router.push(`/tv-shows/${item.tv_show_id}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 80px)', p: 3 }}>
      <Typography variant="h2" gutterBottom sx={{ mb: 3 }}>
        Search Movies & TV Shows
      </Typography>

      {/* Search Controls */}
      <MainCard sx={{ mb: 3, p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">Search Filters</Typography>
          <Button variant="outlined" startIcon={<ClearOutlined />} onClick={handleClearFilters} size="small">
            Clear All
          </Button>
        </Stack>

        <Grid container spacing={2} alignItems="center">
          {/* Search Type */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={searchType} label="Type" onChange={(e) => setSearchType(e.target.value as SearchType)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="movies">Movies</MenuItem>
                <MenuItem value="tv-shows">TV Shows</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Search by Title */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search by Title"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Search by ID */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Search by ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IdcardOutlined />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Genre Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField fullWidth label="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="e.g., Action" />
          </Grid>

          {/* Year Filter */}
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

          {/* Search Button */}
          <Grid item xs={12} sm={6} md={1}>
            <Button fullWidth variant="contained" onClick={handleSearch} disabled={loading} sx={{ height: '56px' }}>
              Search
            </Button>
          </Grid>
        </Grid>

        {/* Additional Filters Row */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Director (Movies only) */}
          {(searchType === 'movies' || searchType === 'all') && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Director" value={director} onChange={(e) => setDirector(e.target.value)} placeholder="Director name" />
            </Grid>
          )}

          {/* Actor (Movies only) */}
          {(searchType === 'movies' || searchType === 'all') && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Actor" value={actor} onChange={(e) => setActor(e.target.value)} placeholder="Actor name" />
            </Grid>
          )}

          {/* Studio (Movies only) */}
          {(searchType === 'movies' || searchType === 'all') && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Studio" value={studio} onChange={(e) => setStudio(e.target.value)} placeholder="Studio name" />
            </Grid>
          )}

          {/* Network (TV Shows only) */}
          {(searchType === 'tv-shows' || searchType === 'all') && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Network" value={network} onChange={(e) => setNetwork(e.target.value)} placeholder="Network name" />
            </Grid>
          )}

          {/* Creator (TV Shows only) */}
          {(searchType === 'tv-shows' || searchType === 'all') && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Creator" value={creator} onChange={(e) => setCreator(e.target.value)} placeholder="Creator name" />
            </Grid>
          )}
        </Grid>
      </MainCard>

      {/* Results */}
      <MainCard>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
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
            {/* Use the same Grid/Card list component from previous sprint */}
            <Grid container spacing={3}>
              {results
                .filter((item) => item && typeof item === 'object' && (('movie_id' in item) || ('tv_show_id' in item)))
                .map((item) => {
                  // Type guard to ensure item is a valid object
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
                  const rating = tvShow?.vote_average || null;
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
                      onClick={() => handleResultClick(item)}
                    >
                      <CardMedia
                        component="img"
                        height="400"
                        image={`https://image.tmdb.org/t/p/w500${posterUrl}`}
                        alt={title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                            {tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''} • {tvShow.number_of_episodes} Episode
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
                    performSearch({ page: value });
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

