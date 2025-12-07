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
import { movieApi, type Movie } from 'services/movieApi';
import DeleteConfirmationModal from 'components/DeleteConfirmationModal';

// Mock movie data (kept for fallback)
const MOCK_MOVIES = [
  {
    movie_id: 18,
    title: '28 Years Later',
    original_title: '28 Years Later',
    directors: 'Danny Boyle',
    genres: 'Horror, Science Fiction, Thriller',
    release_date: '2025-06-18T00:00:00.000Z',
    runtime_minutes: 115,
    overview:
      'Twenty-eight years since the rage virus escaped a biological weapons laboratory, now, still in a ruthlessly enforced quarantine, some have found ways to exist amidst the infected. One such group lives on a small island connected to the mainland by a single, heavily-defended causeway. When one member departs on a mission into the dark heart of the mainland, he discovers secrets, wonders, and horrors that have mutated not only the infected but other survivors as well.',
    budget: '60000000',
    revenue: '150367300',
    mpa_rating: 'R',
    poster_url: '/mIg1qCkVxnAlM2TK3RUF0tdEXlE.jpg',
    backdrop_url: '/zav0v7gLWMu6pVwgsIAwt11GJ4C.jpg'
  },
  {
    movie_id: 127,
    title: '5-Sep',
    original_title: '5-Sep',
    directors: 'Tim Fehlbaum',
    genres: 'Drama, History, Thriller',
    release_date: '2024-11-07T00:00:00.000Z',
    runtime_minutes: 94,
    overview:
      'During the 1972 Munich Olympics, an American sports broadcasting crew finds itself thrust into covering the hostage crisis involving Israeli athletes.',
    budget: '0',
    revenue: '852000',
    mpa_rating: 'R',
    poster_url: '/3kcQOLwYKGPwyjiynFsvP8vHvRn.jpg',
    backdrop_url: '/nEH7XUCeWsEuJtGgWUVUl6MEQW0.jpg'
  },
  {
    movie_id: 101,
    title: 'A Complete Unknown',
    original_title: 'A Complete Unknown',
    directors: 'James Mangold',
    genres: 'Drama, Music',
    release_date: '2024-12-18T00:00:00.000Z',
    runtime_minutes: 140,
    overview:
      'New York, early 1960s. Against the backdrop of a vibrant music scene and tumultuous cultural upheaval, an enigmatic 19-year-old from Minnesota arrives in the West Village with his guitar and revolutionary talent, destined to change the course of American music.',
    budget: '65000000',
    revenue: '138003641',
    mpa_rating: 'R',
    poster_url: '/llWl3GtNoXosbvYboelmoT459NM.jpg',
    backdrop_url: '/d2faCjeaynI2nPDVh9PiRapcLcl.jpg'
  },
  {
    movie_id: 189,
    title: 'A Different Man',
    original_title: 'A Different Man',
    directors: 'Aaron Schimberg',
    genres: 'Comedy, Drama',
    release_date: '2024-08-24T00:00:00.000Z',
    runtime_minutes: 112,
    overview:
      'Aspiring actor Edward undergoes a radical medical procedure to drastically transform his appearance. But his new dream face quickly turns into a nightmare, as he loses out on the role he was born to play and becomes obsessed with reclaiming what was lost.',
    budget: '0',
    revenue: '1169365',
    mpa_rating: 'R',
    poster_url: '/lZZKTEvo92u1J5pm7QoEA5yN3du.jpg',
    backdrop_url: '/xSqaVqkbeSaPmeEyurWBaTSkgL9.jpg'
  },
  {
    movie_id: 223,
    title: 'A Family Affair',
    original_title: 'A Family Affair',
    directors: 'Richard LaGravenese',
    genres: 'Comedy, Romance',
    release_date: '2024-06-27T00:00:00.000Z',
    runtime_minutes: 114,
    overview:
      'The only thing worse than being the assistant to a high-maintenance movie star who doesn&apos;t take you seriously? Finding out he&apos;s smitten with your mom.',
    budget: '0',
    revenue: '0',
    mpa_rating: 'PG-13',
    poster_url: '/l0CaVyqnTsWwNd4hWsrLNEk1Wjd.jpg',
    backdrop_url: '/ngLxW9WqQAkTCBTcjOSt2Pnz5qZ.jpg'
  },
  {
    movie_id: 260,
    title: 'A Little Something Extra',
    original_title: 'Un p&apos;tit truc en plus',
    directors: 'Artus',
    genres: 'Comedy',
    release_date: '2024-04-18T00:00:00.000Z',
    runtime_minutes: 89,
    overview:
      'To escape the police, a father and his son are forced to find refuge in a summer camp for young adults with mental disabilities, taking on the role of an educator and a boarder. The beginning of troubles and a wonderful human experience that will change them forever.',
    budget: '6400000',
    revenue: '84058132',
    mpa_rating: '6',
    poster_url: '/hhL8QC7O6fFfwgV6pDf1WSOxGcY.jpg',
    backdrop_url: '/rTNMyZ5JcrfKnPamaYOo9wzq3m5.jpg'
  },
  {
    movie_id: 49,
    title: 'A Minecraft Movie',
    original_title: 'A Minecraft Movie',
    directors: 'Jared Hess',
    genres: 'Action, Adventure, Comedy, Family, Fantasy',
    release_date: '2025-03-31T00:00:00.000Z',
    runtime_minutes: 101,
    overview:
      'Four misfits find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld: a bizarre, cubic wonderland that thrives on imagination. To get back home, they&apos;ll have to master this world while embarking on a magical quest with an unexpected, expert crafter, Steve.',
    budget: '150000000',
    revenue: '955149195',
    mpa_rating: 'PG',
    poster_url: '/yFHHfHcUgGAxziP1C3lLt0q2T4s.jpg',
    backdrop_url: '/2Nti3gYAX513wvhp8IiLL6ZDyOm.jpg'
  },
  {
    movie_id: 225,
    title: 'A Quiet Place: Day One',
    original_title: 'A Quiet Place: Day One',
    directors: 'Michael Sarnoski',
    genres: 'Horror, Science Fiction, Thriller',
    release_date: '2024-06-26T00:00:00.000Z',
    runtime_minutes: 100,
    overview: 'As New York City is invaded by alien creatures who hunt by sound, a woman named Sam fights to survive with her cat.',
    budget: '67000000',
    revenue: '261907653',
    mpa_rating: 'PG-13',
    poster_url: '/hU42CRk14JuPEdqZG3AWmagiPAP.jpg',
    backdrop_url: '/6XjMwQTvnICBz6TguiDKkDVHvgS.jpg'
  },
  {
    movie_id: 131,
    title: 'A Real Pain',
    original_title: 'A Real Pain',
    directors: 'Jesse Eisenberg',
    genres: 'Comedy, Drama',
    release_date: '2024-11-01T00:00:00.000Z',
    runtime_minutes: 90,
    overview:
      'Mismatched cousins David and Benji reunite for a tour through Poland to honor their beloved grandmother. The adventure takes a turn when the pair&apos;s old tensions resurface against the backdrop of their family history.',
    budget: '3000000',
    revenue: '24856027',
    mpa_rating: 'R',
    poster_url: '/67xRIXm5TxXRT4nV2V4AEJ9yq2d.jpg',
    backdrop_url: '/fViElUGfdoZjtnVxvSpJX8TwxY6.jpg'
  },
  {
    movie_id: 53,
    title: 'A Working Man',
    original_title: 'A Working Man',
    directors: 'David Ayer',
    genres: 'Action, Crime, Thriller',
    release_date: '2025-03-26T00:00:00.000Z',
    runtime_minutes: 116,
    overview:
      'Levon Cade left behind a decorated military career in the black ops to live a simple life working construction. But when his boss&apos;s daughter, who is like family to him, is taken by human traffickers, his search to bring her home uncovers a world of corruption far greater than he ever could have imagined.',
    budget: '40000000',
    revenue: '99068160',
    mpa_rating: 'R',
    poster_url: '/6FRFIogh3zFnVWn7Z6zcYnIbRcX.jpg',
    backdrop_url: '/fTrQsdMS2MUw00RnzH0r3JWHhts.jpg'
  },
  {
    movie_id: 263,
    title: 'Abigail',
    original_title: 'Abigail',
    directors: 'Matt Bettinelli-Olpin, Tyler Gillett',
    genres: 'Horror, Thriller',
    release_date: '2024-04-16T00:00:00.000Z',
    runtime_minutes: 109,
    overview:
      'A group of criminals kidnap a teenage ballet dancer, the daughter of a notorious gang leader, in order to obtain a ransom of $50 million, but over time, they discover that she is not just an ordinary girl. After the kidnappers begin to diminish, one by one, they discover, to their increasing horror, that they are locked inside with no normal little girl.',
    budget: '28000000',
    revenue: '43015969',
    mpa_rating: 'R',
    poster_url: '/5gKKSoD3iezjoL7YqZONjmyAiRA.jpg',
    backdrop_url: '/2TPoqmatGDfBOiRxqNoL11ncCJe.jpg'
  },
  {
    movie_id: 133,
    title: 'Absolution',
    original_title: 'Absolution',
    directors: 'Hans Petter Moland',
    genres: 'Action, Crime, Mystery, Thriller',
    release_date: '2024-10-31T00:00:00.000Z',
    runtime_minutes: 112,
    overview:
      'An aging ex-boxer gangster working as muscle for a Boston crime boss receives an upsetting diagnosis.  Despite a faltering memory, he attempts to rectify the sins of his past and reconnect with his estranged children. He is determined to leave a positive legacy for his grandson, but the criminal underworld isn&apos;t done with him and won&apos;t loosen their grip willingly.',
    budget: '30000000',
    revenue: '3854594',
    mpa_rating: 'R',
    poster_url: '/gt70JOD9xsPlpJnuBJAWdOT4yRg.jpg',
    backdrop_url: '/7bIWKyWdT04HTY3PqLETT8CH7jo.jpg'
  }
];

// ==============================|| MOVIES PAGE ||============================== //

export default function MoviesPage() {
  const router = useRouter();
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<'single' | 'multi'>('multi');
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const moviesPerPage = 9;

  // Cache to store fetched movies and reduce redundant API calls
  const [movieCache, setMovieCache] = useState<Map<string, { data: Movie[]; totalPages: number; timestamp: number }>>(new Map());

  // Fetch movies from API with debounce for search
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create cache key based on search parameters
        const limit = viewMode === 'multi' ? moviesPerPage : 20; // Reduced from 100 to 20
        const currentPage = viewMode === 'multi' ? page : 1;
        const cacheKey = `${searchText || 'all'}-${currentPage}-${limit}`;

        // Check cache first (cache valid for 5 minutes)
        const cached = movieCache.get(cacheKey);
        const now = Date.now();
        const cacheExpiry = 5 * 60 * 1000; // 5 minutes

        if (cached && now - cached.timestamp < cacheExpiry) {
          console.log('Using cached data for:', cacheKey);
          setMovies(cached.data);
          setTotalPages(cached.totalPages);
          setSelectedMovieIndex(0);
          setLoading(false);
          return;
        }

        // Fetch from API if not in cache or cache expired
        console.log('Fetching from API:', cacheKey);

        // Only include title filter if search text has at least 2 characters
        const titleFilter = searchText && searchText.length >= 2 ? searchText : undefined;

        const response = await movieApi.getMovies({
          title: titleFilter,
          page: currentPage,
          limit: limit
        });

        setMovies(response.data);
        setTotalPages(response.pagination.totalPages);

        // Update cache
        setMovieCache(
          (prevCache) =>
            new Map(
              prevCache.set(cacheKey, {
                data: response.data,
                totalPages: response.pagination.totalPages,
                timestamp: now
              })
            )
        );

        // Reset selected movie index when data changes
        setSelectedMovieIndex(0);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again.');
        // Fallback to mock data on error
        setMovies(MOCK_MOVIES);
        setTotalPages(Math.ceil(MOCK_MOVIES.length / moviesPerPage));
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(
      () => {
        fetchMovies();
      },
      searchText ? 500 : 0
    ); // 500ms debounce for search, immediate for other changes

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, page, viewMode]);

  const selectedMovie = movies[selectedMovieIndex];

  const formatCurrency = (amount: string) => {
    const num = parseInt(amount);
    if (num === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewChange = (_event: React.MouseEvent<HTMLElement>, newView: 'single' | 'multi' | null) => {
    if (newView !== null) {
      setViewMode(newView);
      setPage(1);
    }
  };

  const handlePreviousMovie = () => {
    setSelectedMovieIndex((prev) => (prev > 0 ? prev - 1 : movies.length - 1));
  };

  const handleNextMovie = () => {
    setSelectedMovieIndex((prev) => (prev < movies.length - 1 ? prev + 1 : 0));
  };

  const handleMovieClick = (movie: Movie) => {
    // Navigate to movie detail page
    router.push(`/movies/${movie.movie_id}`);
  };

  // DESIGN-ONLY: Delete functionality - no backend API calls
  // This only opens/closes the modal for UI/UX demonstration
  const handleDeleteClick = (e: React.MouseEvent, movie: Movie) => {
    e.stopPropagation(); // Prevent card click
    setMovieToDelete(movie);
    setDeleteModalOpen(true);
  };

  // DESIGN-ONLY: Only closes the modal, no actual deletion
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setMovieToDelete(null);
  };

  const displayedMovies = viewMode === 'multi' ? movies : selectedMovie ? [selectedMovie] : [];

  // Show loading or error states
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
        <Typography variant="h4">Loading movies...</Typography>
      </Box>
    );
  }

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
            href="/add-movie"
            variant="contained"
            startIcon={<PlusOutlined />}
            size="medium"
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add Movie
          </Button>
        </Stack>

        <TextField
          placeholder="Search movies..."
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

      {/* Movie Display Card */}
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
        {movies.length === 0 ? (
          /* No Movies Found */
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}
          >
            <Typography variant="h4" color="text.secondary">
              No movies found
            </Typography>
          </Box>
        ) : viewMode === 'single' ? (
          /* Single Movie View */
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              height: '100%'
            }}
          >
            {/* Left Arrow */}
            <IconButton onClick={handlePreviousMovie} sx={{ flexShrink: 0, height: 'fit-content' }} size="large">
              <LeftOutlined style={{ fontSize: '2rem' }} />
            </IconButton>

            {/* Movie Content */}
            <Grid container spacing={3} sx={{ flex: 1 }}>
              {/* Movie Poster */}
              <Grid item xs={12} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => router.push(`/movies/${selectedMovie.movie_id}`)}
                >
                  <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_url}`}
                    alt={selectedMovie.title}
                    sx={{ borderRadius: 2 }}
                  />
                </Card>
              </Grid>

              {/* Movie Details */}
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
                        {selectedMovie.title}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteOutlined />}
                        onClick={() => handleDeleteClick({ stopPropagation: () => {} } as React.MouseEvent, selectedMovie)}
                        sx={{ ml: 2 }}
                      >
                        Delete
                      </Button>
                    </Box>
                    {selectedMovie.original_title !== selectedMovie.title && (
                      <Typography variant="h5" color="text.secondary" gutterBottom>
                        Original Title: {selectedMovie.original_title}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip label={selectedMovie.mpa_rating} color="primary" size="small" />
                      <Chip label={`${selectedMovie.runtime_minutes} min`} variant="outlined" size="small" />
                      <Chip label={formatDate(selectedMovie.release_date)} variant="outlined" size="small" />
                    </Stack>
                  </Box>

                  {/* Genres */}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Genres
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {selectedMovie.genres.split(', ').map((genre) => (
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
                      {selectedMovie.overview}
                    </Typography>
                  </Box>

                  {/* Director */}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Director
                    </Typography>
                    <Typography variant="body1">{selectedMovie.directors}</Typography>
                  </Box>

                  {/* Budget and Revenue */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Budget
                      </Typography>
                      <Typography variant="h6">{formatCurrency(selectedMovie.budget)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Revenue
                      </Typography>
                      <Typography variant="h6">{formatCurrency(selectedMovie.revenue)}</Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
            </Grid>

            {/* Right Arrow */}
            <IconButton onClick={handleNextMovie} sx={{ flexShrink: 0, height: 'fit-content' }} size="large">
              <RightOutlined style={{ fontSize: '2rem' }} />
            </IconButton>
          </Box>
        ) : (
          /* Multi Movie View */
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Grid container spacing={3}>
              {displayedMovies.map((movie, index) => {
                return (
                  <Grid item xs={12} sm={6} md={4} key={movie.movie_id}>
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
                      onClick={() => handleMovieClick(movie)}
                    >
                      {/* Delete Icon Button */}
                      <IconButton
                        onClick={(e) => handleDeleteClick(e, movie)}
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
                        image={`https://image.tmdb.org/t/p/w500${movie.poster_url}`}
                        alt={movie.title}
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
                          {movie.title}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                          <Chip label={movie.mpa_rating} size="small" color="primary" />
                          <Chip label={`${movie.runtime_minutes} min`} size="small" variant="outlined" />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {movie.genres}
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
                          {movie.overview}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
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
        title="Delete Movie"
        itemName={movieToDelete?.title || ''}
        itemType="movie"
      />
    </Box>
  );
}
