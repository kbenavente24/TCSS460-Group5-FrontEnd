'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

// icons
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';

// project imports
import MainCard from 'components/MainCard';

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
  'Western',
];

interface Studio {
  studio_name: string;
  logo_url: string;
  country: string;
}

interface CastMember {
  actor_name: string;
  character_name: string;
  actor_order: number;
  profile_url: string;
}

export default function AddMovieView() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [runtimeMinutes, setRuntimeMinutes] = useState('');
  const [overview, setOverview] = useState('');
  const [budget, setBudget] = useState('');
  const [revenue, setRevenue] = useState('');
  const [mpaRating, setMpaRating] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');

  // Array fields
  const [genres, setGenres] = useState<string[]>(['']);
  const [directors, setDirectors] = useState<string[]>(['']);
  const [producers, setProducers] = useState<string[]>(['']);
  const [studios, setStudios] = useState<Studio[]>([
    { studio_name: '', logo_url: '', country: '' },
  ]);
  const [cast, setCast] = useState<CastMember[]>([
    { actor_name: '', character_name: '', actor_order: 1, profile_url: '' },
  ]);

  const handleAddGenre = () => setGenres([...genres, '']);
  const handleRemoveGenre = (index: number) =>
    setGenres(genres.filter((_, i) => i !== index));
  const handleGenreChange = (index: number, value: string) => {
    const newGenres = [...genres];
    newGenres[index] = value;
    setGenres(newGenres);
  };

  const handleAddDirector = () => setDirectors([...directors, '']);
  const handleRemoveDirector = (index: number) =>
    setDirectors(directors.filter((_, i) => i !== index));
  const handleDirectorChange = (index: number, value: string) => {
    const newDirectors = [...directors];
    newDirectors[index] = value;
    setDirectors(newDirectors);
  };

  const handleAddProducer = () => setProducers([...producers, '']);
  const handleRemoveProducer = (index: number) =>
    setProducers(producers.filter((_, i) => i !== index));
  const handleProducerChange = (index: number, value: string) => {
    const newProducers = [...producers];
    newProducers[index] = value;
    setProducers(newProducers);
  };

  const handleAddStudio = () =>
    setStudios([...studios, { studio_name: '', logo_url: '', country: '' }]);
  const handleRemoveStudio = (index: number) =>
    setStudios(studios.filter((_, i) => i !== index));
  const handleStudioChange = (
    index: number,
    field: keyof Studio,
    value: string
  ) => {
    const newStudios = [...studios];
    newStudios[index][field] = value;
    setStudios(newStudios);
  };

  const handleAddCast = () =>
    setCast([
      ...cast,
      {
        actor_name: '',
        character_name: '',
        actor_order: cast.length + 1,
        profile_url: '',
      },
    ]);
  const handleRemoveCast = (index: number) =>
    setCast(cast.filter((_, i) => i !== index));
  const handleCastChange = (
    index: number,
    field: keyof CastMember,
    value: string | number
  ) => {
    const newCast = [...cast];
    newCast[index] = { ...newCast[index], [field]: value };
    setCast(newCast);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const movieData = {
        title,
        original_title: originalTitle || title,
        release_date: releaseDate,
        runtime_minutes: parseInt(runtimeMinutes),
        overview,
        budget: parseFloat(budget) || 0,
        revenue: parseFloat(revenue) || 0,
        mpa_rating: mpaRating,
        collection_name: collectionName || undefined,
        poster_url: posterUrl || undefined,
        backdrop_url: backdropUrl || undefined,
        genres: genres.filter((g) => g.trim()),
        directors: directors.filter((d) => d.trim()),
        producers: producers.filter((p) => p.trim()),
        studios: studios.filter((s) => s.studio_name.trim()),
        cast: cast.filter((c) => c.actor_name.trim()),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MOVIE_API_URL}/movies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.NEXT_PUBLIC_MOVIE_API_KEY || '',
          },
          body: JSON.stringify(movieData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create movie');
      }

      setSuccess(true);
      // Reset form after 2 seconds
      setTimeout(() => {
        router.push('/movies');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating movie:', err);
      setError(err.message || 'Failed to create movie. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <MainCard>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={() => router.push('/movies')} size="large">
              <ArrowLeftOutlined style={{ fontSize: '1.5rem' }} />
            </IconButton>
            <Typography variant="h2">Add New Movie</Typography>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Success/Error Messages */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Movie created successfully! Redirecting to movies page...
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {/* Basic Information */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      fullWidth
                      required
                      helperText="Movie title (required)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Original Title"
                      value={originalTitle}
                      onChange={(e) => setOriginalTitle(e.target.value)}
                      fullWidth
                      helperText="Original title (optional, defaults to title)"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Release Date"
                      type="date"
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Runtime (minutes)"
                      type="number"
                      value={runtimeMinutes}
                      onChange={(e) => setRuntimeMinutes(e.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="MPA Rating"
                      value={mpaRating}
                      onChange={(e) => setMpaRating(e.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Overview"
                      value={overview}
                      onChange={(e) => setOverview(e.target.value)}
                      fullWidth
                      required
                      multiline
                      rows={4}
                      helperText="Movie description/plot summary"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Financial Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Budget"
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      fullWidth
                      helperText="Budget in USD (optional)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Revenue"
                      type="number"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      fullWidth
                      helperText="Revenue in USD (optional)"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Media & Collection */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Media & Collection
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Poster URL"
                      value={posterUrl}
                      onChange={(e) => setPosterUrl(e.target.value)}
                      fullWidth
                      helperText="URL to movie poster image"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Backdrop URL"
                      value={backdropUrl}
                      onChange={(e) => setBackdropUrl(e.target.value)}
                      fullWidth
                      helperText="URL to backdrop/banner image"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Collection Name"
                      value={collectionName}
                      onChange={(e) => setCollectionName(e.target.value)}
                      fullWidth
                      helperText="Movie collection/franchise (optional)"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Genres */}
            <Card variant="outlined">
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h4">Genres</Typography>
                  <Button
                    startIcon={<PlusOutlined />}
                    onClick={handleAddGenre}
                    size="small"
                  >
                    Add Genre
                  </Button>
                </Stack>
                <Stack spacing={2}>
                  {genres.map((genre, index) => (
                    <Stack direction="row" spacing={2} key={index}>
                      <FormControl fullWidth>
                        <InputLabel>Genre {index + 1}</InputLabel>
                        <Select
                          value={genre}
                          label={`Genre ${index + 1}`}
                          onChange={(e) =>
                            handleGenreChange(index, e.target.value)
                          }
                        >
                          <MenuItem value="">
                            <em>Select a genre</em>
                          </MenuItem>
                          {MOVIE_GENRES.map((g) => (
                            <MenuItem key={g} value={g}>
                              {g}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {genres.length > 1 && (
                        <IconButton
                          onClick={() => handleRemoveGenre(index)}
                          color="error"
                        >
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Directors */}
            <Card variant="outlined">
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h4">Directors</Typography>
                  <Button
                    startIcon={<PlusOutlined />}
                    onClick={handleAddDirector}
                    size="small"
                  >
                    Add Director
                  </Button>
                </Stack>
                <Stack spacing={2}>
                  {directors.map((director, index) => (
                    <Stack direction="row" spacing={2} key={index}>
                      <TextField
                        label={`Director ${index + 1}`}
                        value={director}
                        onChange={(e) =>
                          handleDirectorChange(index, e.target.value)
                        }
                        fullWidth
                      />
                      {directors.length > 1 && (
                        <IconButton
                          onClick={() => handleRemoveDirector(index)}
                          color="error"
                        >
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Producers */}
            <Card variant="outlined">
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h4">Producers</Typography>
                  <Button
                    startIcon={<PlusOutlined />}
                    onClick={handleAddProducer}
                    size="small"
                  >
                    Add Producer
                  </Button>
                </Stack>
                <Stack spacing={2}>
                  {producers.map((producer, index) => (
                    <Stack direction="row" spacing={2} key={index}>
                      <TextField
                        label={`Producer ${index + 1}`}
                        value={producer}
                        onChange={(e) =>
                          handleProducerChange(index, e.target.value)
                        }
                        fullWidth
                      />
                      {producers.length > 1 && (
                        <IconButton
                          onClick={() => handleRemoveProducer(index)}
                          color="error"
                        >
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Studios */}
            <Card variant="outlined">
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h4">Studios</Typography>
                  <Button
                    startIcon={<PlusOutlined />}
                    onClick={handleAddStudio}
                    size="small"
                  >
                    Add Studio
                  </Button>
                </Stack>
                <Stack spacing={3}>
                  {studios.map((studio, index) => (
                    <Box
                      key={index}
                      sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Typography variant="h6">Studio {index + 1}</Typography>
                        {studios.length > 1 && (
                          <IconButton
                            onClick={() => handleRemoveStudio(index)}
                            color="error"
                            size="small"
                          >
                            <DeleteOutlined />
                          </IconButton>
                        )}
                      </Stack>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="Studio Name"
                            value={studio.studio_name}
                            onChange={(e) =>
                              handleStudioChange(
                                index,
                                'studio_name',
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="Logo URL"
                            value={studio.logo_url}
                            onChange={(e) =>
                              handleStudioChange(
                                index,
                                'logo_url',
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="Country"
                            value={studio.country}
                            onChange={(e) =>
                              handleStudioChange(
                                index,
                                'country',
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Cast */}
            <Card variant="outlined">
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h4">Cast</Typography>
                  <Button
                    startIcon={<PlusOutlined />}
                    onClick={handleAddCast}
                    size="small"
                  >
                    Add Cast Member
                  </Button>
                </Stack>
                <Stack spacing={3}>
                  {cast.map((member, index) => (
                    <Box
                      key={index}
                      sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Typography variant="h6">
                          Cast Member {index + 1}
                        </Typography>
                        {cast.length > 1 && (
                          <IconButton
                            onClick={() => handleRemoveCast(index)}
                            color="error"
                            size="small"
                          >
                            <DeleteOutlined />
                          </IconButton>
                        )}
                      </Stack>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <TextField
                            label="Actor Name"
                            value={member.actor_name}
                            onChange={(e) =>
                              handleCastChange(
                                index,
                                'actor_name',
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            label="Character Name"
                            value={member.character_name}
                            onChange={(e) =>
                              handleCastChange(
                                index,
                                'character_name',
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            label="Order"
                            type="number"
                            value={member.actor_order}
                            onChange={(e) =>
                              handleCastChange(
                                index,
                                'actor_order',
                                parseInt(e.target.value)
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="Profile URL"
                            value={member.profile_url}
                            onChange={(e) =>
                              handleCastChange(
                                index,
                                'profile_url',
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => router.push('/movies')}
                size="large"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveOutlined />}
                size="large"
                disabled={loading}
              >
                {loading ? 'Creating Movie...' : 'Create Movie'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </MainCard>
    </Box>
  );
}
