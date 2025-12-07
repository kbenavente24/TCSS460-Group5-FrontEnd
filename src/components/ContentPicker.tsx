'use client';

import { useState, useEffect } from 'react';

// material-ui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

// icons
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';

// project imports
import { movieApi, type Movie } from 'services/movieApi';
import { tvShowApi, type TVShow } from 'services/tvShowApi';

// ==============================|| CONTENT PICKER COMPONENT ||============================== //

export interface SelectedContent {
  id: number;
  type: 'movie' | 'tv-show';
  title: string;
  posterUrl: string;
}

interface ContentPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (content: SelectedContent) => void;
  listType: 'movies' | 'tv-shows' | 'mixed';
  currentRank: number;
}

export default function ContentPicker({
  open,
  onClose,
  onSelect,
  listType,
  currentRank
}: ContentPickerProps) {
  const [contentType, setContentType] = useState<'movie' | 'tv-show'>(
    listType === 'tv-shows' ? 'tv-show' : 'movie'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSearchQuery('');
      setMovies([]);
      setTVShows([]);
      setError(null);
      // Set default content type based on list type
      if (listType === 'tv-shows') {
        setContentType('tv-show');
      } else if (listType === 'movies') {
        setContentType('movie');
      }
    }
  }, [open, listType]);

  // Fetch content when search query changes
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setMovies([]);
      setTVShows([]);
      return;
    }

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        if (contentType === 'movie') {
          const response = await movieApi.searchMovies(searchQuery, 1, 12);
          setMovies(response.data);
          setTVShows([]);
        } else {
          const response = await tvShowApi.searchTVShows(searchQuery, 1, 12);
          setTVShows(response.data);
          setMovies([]);
        }
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to search. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchContent, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, contentType]);

  const handleContentTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: 'movie' | 'tv-show' | null
  ) => {
    if (newType !== null) {
      setContentType(newType);
      setSearchQuery('');
      setMovies([]);
      setTVShows([]);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    onSelect({
      id: movie.movie_id,
      type: 'movie',
      title: movie.title,
      posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_url}`
    });
    onClose();
  };

  const handleSelectTVShow = (tvShow: TVShow) => {
    onSelect({
      id: tvShow.tv_show_id,
      type: 'tv-show',
      title: tvShow.name,
      posterUrl: `https://image.tmdb.org/t/p/w500${tvShow.poster_url}`
    });
    onClose();
  };

  const displayedMovies = contentType === 'movie' ? movies : [];
  const displayedTVShows = contentType === 'tv-show' ? tvShows : [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, minHeight: '600px' } }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h3">Add to Rank #{currentRank}</Typography>
          <Button
            onClick={onClose}
            sx={{ minWidth: 'auto', p: 1 }}
            color="inherit"
          >
            <CloseOutlined />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {/* Content Type Toggle (only show if list type is mixed) */}
          {listType === 'mixed' && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ToggleButtonGroup
                value={contentType}
                exclusive
                onChange={handleContentTypeChange}
                size="small"
              >
                <ToggleButton value="movie">Movies</ToggleButton>
                <ToggleButton value="tv-show">TV Shows</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}

          {/* Search Field */}
          <TextField
            fullWidth
            placeholder={`Search for ${contentType === 'movie' ? 'movies' : 'TV shows'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined style={{ fontSize: '1.2rem' }} />
                </InputAdornment>
              )
            }}
          />

          {/* Results */}
          <Box sx={{ minHeight: 400, maxHeight: 400, overflow: 'auto' }}>
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              </Box>
            ) : !searchQuery || searchQuery.length < 2 ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Start typing to search for{' '}
                  {contentType === 'movie' ? 'movies' : 'TV shows'}
                </Typography>
              </Box>
            ) : displayedMovies.length === 0 &&
              displayedTVShows.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No results found
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {/* Display Movies */}
                {displayedMovies.map((movie) => (
                  <Grid item xs={6} sm={4} md={3} key={movie.movie_id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 4
                        }
                      }}
                      onClick={() => handleSelectMovie(movie)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={`https://image.tmdb.org/t/p/w500${movie.poster_url}`}
                        alt={movie.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ p: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            fontSize: '0.75rem'
                          }}
                        >
                          {movie.title}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}

                {/* Display TV Shows */}
                {displayedTVShows.map((tvShow) => (
                  <Grid item xs={6} sm={4} md={3} key={tvShow.tv_show_id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 4
                        }
                      }}
                      onClick={() => handleSelectTVShow(tvShow)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={`https://image.tmdb.org/t/p/w500${tvShow.poster_url}`}
                        alt={tvShow.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ p: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            fontSize: '0.75rem'
                          }}
                        >
                          {tvShow.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
