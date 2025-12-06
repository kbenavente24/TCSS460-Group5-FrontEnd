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
const MOCK_TV_SHOWS = [
  {
    tv_show_id: 1,
    name: 'Breaking Bad',
    original_name: 'Breaking Bad',
    creators: 'Vince Gilligan',
    genres: 'Crime, Drama, Thriller',
    first_air_date: '2008-01-20T00:00:00.000Z',
    last_air_date: '2013-09-29T00:00:00.000Z',
    number_of_seasons: 5,
    number_of_episodes: 62,
    episode_run_time: 47,
    overview:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    networks: 'AMC',
    production_companies: 'High Bridge Entertainment, Gran Via Productions',
    vote_average: 9.5,
    poster_url: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    backdrop_url: '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg'
  },
  {
    tv_show_id: 2,
    name: 'Game of Thrones',
    original_name: 'Game of Thrones',
    creators: 'David Benioff, D.B. Weiss',
    genres: 'Action, Adventure, Drama, Fantasy',
    first_air_date: '2011-04-17T00:00:00.000Z',
    last_air_date: '2019-05-19T00:00:00.000Z',
    number_of_seasons: 8,
    number_of_episodes: 73,
    episode_run_time: 57,
    overview:
      'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    networks: 'HBO',
    production_companies: 'HBO Entertainment, Bighead Littlehead, 360 Television',
    vote_average: 8.5,
    poster_url: '/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
    backdrop_url: '/2OMB0ynKlyIenMJWI2Dy9IWT4cM.jpg'
  },
  {
    tv_show_id: 3,
    name: 'Stranger Things',
    original_name: 'Stranger Things',
    creators: 'Matt Duffer, Ross Duffer',
    genres: 'Drama, Fantasy, Horror, Mystery, Science Fiction',
    first_air_date: '2016-07-15T00:00:00.000Z',
    last_air_date: '2022-07-01T00:00:00.000Z',
    number_of_seasons: 4,
    number_of_episodes: 42,
    episode_run_time: 51,
    overview:
      'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    networks: 'Netflix',
    production_companies: '21 Laps Entertainment, Monkey Massacre',
    vote_average: 8.7,
    poster_url: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdrop_url: '/nTvM4mhqNlHIvUkI1gVnW6XP7GG.jpg'
  },
  {
    tv_show_id: 4,
    name: 'The Office',
    original_name: 'The Office',
    creators: 'Greg Daniels',
    genres: 'Comedy',
    first_air_date: '2005-03-24T00:00:00.000Z',
    last_air_date: '2013-05-16T00:00:00.000Z',
    number_of_seasons: 9,
    number_of_episodes: 201,
    episode_run_time: 22,
    overview:
      'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.',
    networks: 'NBC',
    production_companies: 'Reveille Productions, Deedle-Dee Productions',
    vote_average: 8.5,
    poster_url: '/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg',
    backdrop_url: '/9a2z3QIubPGNgRzA7WO7fmK3S5x.jpg'
  },
  {
    tv_show_id: 5,
    name: 'The Crown',
    original_name: 'The Crown',
    creators: 'Peter Morgan',
    genres: 'Drama, History',
    first_air_date: '2016-11-04T00:00:00.000Z',
    last_air_date: '2023-12-14T00:00:00.000Z',
    number_of_seasons: 6,
    number_of_episodes: 60,
    episode_run_time: 58,
    overview:
      "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    networks: 'Netflix',
    production_companies: 'Left Bank Pictures, Sony Pictures Television',
    vote_average: 8.2,
    poster_url: '/1M876KPjulVwppEpldhdc8V4o68.jpg',
    backdrop_url: '/fVpOOt95sfdb5jfe6Yb0tf50rkv.jpg'
  },
  {
    tv_show_id: 6,
    name: 'The Mandalorian',
    original_name: 'The Mandalorian',
    creators: 'Jon Favreau',
    genres: 'Action, Adventure, Fantasy, Science Fiction, Western',
    first_air_date: '2019-11-12T00:00:00.000Z',
    last_air_date: '2023-04-19T00:00:00.000Z',
    number_of_seasons: 3,
    number_of_episodes: 24,
    episode_run_time: 40,
    overview:
      'After the fall of the Galactic Empire, lawlessness has spread throughout the galaxy. A lone gunfighter makes his way through the outer reaches, earning his keep as a bounty hunter.',
    networks: 'Disney+',
    production_companies: 'Lucasfilm, Golem Creations, Fairview Entertainment',
    vote_average: 8.5,
    poster_url: '/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg',
    backdrop_url: '/9ijMGlJKqcslswWUzTEwScM82EB.jpg'
  },
  {
    tv_show_id: 7,
    name: 'Succession',
    original_name: 'Succession',
    creators: 'Jesse Armstrong',
    genres: 'Comedy, Drama',
    first_air_date: '2018-06-03T00:00:00.000Z',
    last_air_date: '2023-05-28T00:00:00.000Z',
    number_of_seasons: 4,
    number_of_episodes: 39,
    episode_run_time: 60,
    overview:
      'Follow the lives of the Roy family as they contemplate their future once their aging father begins to step back from the media and entertainment conglomerate they control.',
    networks: 'HBO',
    production_companies: 'Gary Sanchez Productions, Hyperobject Industries, Project Zeus',
    vote_average: 8.7,
    poster_url: '/d7iVuo8Z7v6Eb7LkCk7OoiwMxrk.jpg',
    backdrop_url: '/7vKp7j2sgyjEhCxHWdAFb9pCQDI.jpg'
  },
  {
    tv_show_id: 8,
    name: 'The Bear',
    original_name: 'The Bear',
    creators: 'Christopher Storer',
    genres: 'Comedy, Drama',
    first_air_date: '2022-06-23T00:00:00.000Z',
    last_air_date: '2024-06-27T00:00:00.000Z',
    number_of_seasons: 3,
    number_of_episodes: 30,
    episode_run_time: 30,
    overview: "A young chef from the fine dining world returns to Chicago to run his family's Italian beef sandwich shop.",
    networks: 'FX',
    production_companies: 'FX Productions',
    vote_average: 8.6,
    poster_url: '/9fzNf2Qkshv1i3j0zv3n9rs2Txv.jpg',
    backdrop_url: '/rUb1wTffCXZGsWz5XYNWx9vBCvH.jpg'
  },
  {
    tv_show_id: 9,
    name: 'The Last of Us',
    original_name: 'The Last of Us',
    creators: 'Craig Mazin, Neil Druckmann',
    genres: 'Action, Adventure, Drama, Horror, Thriller',
    first_air_date: '2023-01-15T00:00:00.000Z',
    last_air_date: '2023-03-12T00:00:00.000Z',
    number_of_seasons: 1,
    number_of_episodes: 9,
    episode_run_time: 59,
    overview:
      'Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey, as they both must traverse the United States and depend on each other for survival.',
    networks: 'HBO',
    production_companies: 'HBO Entertainment, Sony Pictures Television, Naughty Dog',
    vote_average: 8.8,
    poster_url: '/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    backdrop_url: '/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg'
  },
  {
    tv_show_id: 10,
    name: 'Ted Lasso',
    original_name: 'Ted Lasso',
    creators: 'Bill Lawrence, Jason Sudeikis, Brendan Hunt, Joe Kelly',
    genres: 'Comedy, Drama, Sport',
    first_air_date: '2020-08-14T00:00:00.000Z',
    last_air_date: '2023-05-31T00:00:00.000Z',
    number_of_seasons: 3,
    number_of_episodes: 34,
    episode_run_time: 30,
    overview:
      "Ted Lasso, an American football coach, moves to England when he's hired to manage a soccer team—despite having no experience. With cynical players and a doubtful town, will he get them to see the Ted Lasso Way?",
    networks: 'Apple TV+',
    production_companies: 'Doozer Productions, Universal Television, Warner Bros. Television',
    vote_average: 8.7,
    poster_url: '/4kBHvhe4uY6sO0qZ1uw2K8mKmrg.jpg',
    backdrop_url: '/yY76zq9X2lnn6N5H3PzHPqnyZsO.jpg'
  },
  {
    tv_show_id: 11,
    name: 'House of the Dragon',
    original_name: 'House of the Dragon',
    creators: 'Ryan Condal, George R.R. Martin',
    genres: 'Action, Adventure, Drama, Fantasy',
    first_air_date: '2022-08-21T00:00:00.000Z',
    last_air_date: '2024-08-04T00:00:00.000Z',
    number_of_seasons: 2,
    number_of_episodes: 20,
    episode_run_time: 60,
    overview:
      'The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Most empires crumble from such heights. In the case of the Targaryens, their slow fall begins when King Viserys breaks with a century of tradition by naming his daughter Rhaenyra heir to the Iron Throne.',
    networks: 'HBO',
    production_companies: 'HBO Entertainment, Bastard Sword, GRRM',
    vote_average: 8.5,
    poster_url: '/z2yahl2uefxDCl0nogcRBstwruJ.jpg',
    backdrop_url: '/ztJfdBMQpC1cEkZRLExtYOLXsKK.jpg'
  },
  {
    tv_show_id: 12,
    name: 'Wednesday',
    original_name: 'Wednesday',
    creators: 'Alfred Gough, Miles Millar',
    genres: 'Comedy, Crime, Fantasy, Mystery, Supernatural',
    first_air_date: '2022-11-23T00:00:00.000Z',
    last_air_date: '2022-11-23T00:00:00.000Z',
    number_of_seasons: 1,
    number_of_episodes: 8,
    episode_run_time: 47,
    overview:
      'Wednesday Addams is sent to Nevermore Academy, a bizarre boarding school where she attempts to master her psychic powers, stop a monstrous killing spree of the town citizens, and solve the supernatural mystery that affected her family 25 years ago — all while navigating her new relationships.',
    networks: 'Netflix',
    production_companies: 'MGM Television, Tee and Charles Addams Foundation',
    vote_average: 8.1,
    poster_url: '/jeGtaMwGxPmQN5xM4ClnwPQcNQz.jpg',
    backdrop_url: '/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg'
  }
];

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
  const [showCache, setShowCache] = useState<Map<string, {
    data: TVShow[];
    totalPages: number;
    timestamp: number
  }>>(new Map());

  const selectedShow = tvShows[selectedShowIndex];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
        // Fallback to mock data on error
        setTVShows(MOCK_TV_SHOWS);
        setTotalPages(Math.ceil(MOCK_TV_SHOWS.length / showsPerPage));
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
  const handleDeleteClick = (e: React.MouseEvent, show: typeof MOCK_TV_SHOWS[0]) => {
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
      <Box sx={{ height: 'calc(100vh - 80px)', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h4">Loading TV shows...</Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ height: 'calc(100vh - 80px)', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="h4" color="text.secondary">
              No TV shows found
            </Typography>
          </Box>
        ) : viewMode === 'single' ? (
          /* Single TV Show View */
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
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
                    <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
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
