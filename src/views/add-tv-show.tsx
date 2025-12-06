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

// TV Show Genres (from TMDB API)
const TV_SHOW_GENRES = [
  'Action & Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'History',
  'Kids',
  'Mystery',
  'News',
  'Reality',
  'Romance',
  'Sci-Fi & Fantasy',
  'Soap',
  'Talk',
  'War & Politics',
  'Western'
];

// TV Show Status Options
const TV_SHOW_STATUSES = ['Canceled', 'Ended', 'Pilot', 'Returning Series'];

export default function AddTVShowView() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [firstAirDate, setFirstAirDate] = useState('');
  const [lastAirDate, setLastAirDate] = useState('');
  const [numberOfSeasons, setNumberOfSeasons] = useState('');
  const [numberOfEpisodes, setNumberOfEpisodes] = useState('');
  const [status, setStatus] = useState('');
  const [overview, setOverview] = useState('');
  const [popularity, setPopularity] = useState('');
  const [tmdbRating, setTmdbRating] = useState('');
  const [voteCount, setVoteCount] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');

  // Array fields
  const [genres, setGenres] = useState<string[]>(['']);
  const [creators, setCreators] = useState<string[]>(['']);
  const [networks, setNetworks] = useState<string[]>(['']);
  const [productionCompanies, setProductionCompanies] = useState<string[]>(['']);

  const handleAddGenre = () => setGenres([...genres, '']);
  const handleRemoveGenre = (index: number) => setGenres(genres.filter((_, i) => i !== index));
  const handleGenreChange = (index: number, value: string) => {
    const newGenres = [...genres];
    newGenres[index] = value;
    setGenres(newGenres);
  };

  const handleAddCreator = () => setCreators([...creators, '']);
  const handleRemoveCreator = (index: number) => setCreators(creators.filter((_, i) => i !== index));
  const handleCreatorChange = (index: number, value: string) => {
    const newCreators = [...creators];
    newCreators[index] = value;
    setCreators(newCreators);
  };

  const handleAddNetwork = () => setNetworks([...networks, '']);
  const handleRemoveNetwork = (index: number) => setNetworks(networks.filter((_, i) => i !== index));
  const handleNetworkChange = (index: number, value: string) => {
    const newNetworks = [...networks];
    newNetworks[index] = value;
    setNetworks(newNetworks);
  };

  const handleAddProductionCompany = () => setProductionCompanies([...productionCompanies, '']);
  const handleRemoveProductionCompany = (index: number) => setProductionCompanies(productionCompanies.filter((_, i) => i !== index));
  const handleProductionCompanyChange = (index: number, value: string) => {
    const newCompanies = [...productionCompanies];
    newCompanies[index] = value;
    setProductionCompanies(newCompanies);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Filter and prepare data
      const filteredGenres = genres.filter((g) => g.trim());
      const filteredCreators = creators.filter((c) => c.trim()).map((c) => ({ creator_name: c }));
      const filteredNetworks = networks.filter((n) => n.trim()).map((n) => ({ network_name: n }));
      const filteredStudios = productionCompanies.filter((p) => p.trim()).map((p) => ({ studio_name: p }));

      const tvShowData: any = {
        name,
        original_name: originalName || name,
        first_air_date: firstAirDate,
        last_air_date: lastAirDate || firstAirDate, // API requires this field, use first_air_date as default
        seasons: parseInt(numberOfSeasons) || 1,
        episodes: parseInt(numberOfEpisodes) || 0,
        status: status || 'Unknown',
        overview,
        popularity: parseFloat(popularity) || 0,
        tmdb_rating: parseFloat(tmdbRating) || 0,
        vote_count: parseInt(voteCount) || 0,
        genres: filteredGenres.length > 0 ? filteredGenres : ['Unknown'] // API requires genres array
      };

      // Add optional fields only if they have values
      if (posterUrl) tvShowData.poster_url = posterUrl;
      if (backdropUrl) tvShowData.backdrop_url = backdropUrl;
      if (filteredCreators.length > 0) tvShowData.creators = filteredCreators;
      if (filteredNetworks.length > 0) tvShowData.networks = filteredNetworks;
      if (filteredStudios.length > 0) tvShowData.studios = filteredStudios;

      console.log('Sending TV Show Data:', JSON.stringify(tvShowData, null, 2));

      // Use local Next.js API route
      const response = await fetch('/api/tv-shows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tvShowData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);

        // Extract detailed error message
        let errorMessage = 'Failed to create TV show';
        if (errorData.details?.errors) {
          errorMessage = errorData.details.errors.map((e: any) => `${e.path}: ${e.msg}`).join(', ');
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('TV Show created successfully:', result);

      setSuccess(true);
      setTimeout(() => {
        router.push('/tv-shows');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating TV show:', err);
      console.error('Error details:', err.message);
      setError(err.message || 'Failed to create TV show. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <MainCard>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={() => router.push('/tv-shows')} size="large">
              <ArrowLeftOutlined style={{ fontSize: '1.5rem' }} />
            </IconButton>
            <Typography variant="h2">Add New TV Show</Typography>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Success/Error Messages */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            TV Show created successfully! Redirecting to TV shows page...
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
                      label="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                      required
                      helperText="TV Show name (required)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Original Name"
                      value={originalName}
                      onChange={(e) => setOriginalName(e.target.value)}
                      fullWidth
                      helperText="Original name (optional, defaults to name)"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="First Air Date"
                      type="date"
                      value={firstAirDate}
                      onChange={(e) => setFirstAirDate(e.target.value)}
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Last Air Date"
                      type="date"
                      value={lastAirDate}
                      onChange={(e) => setLastAirDate(e.target.value)}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      helperText="Optional - leave blank if still airing"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                        <MenuItem value="">
                          <em>Select a status</em>
                        </MenuItem>
                        {TV_SHOW_STATUSES.map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Number of Seasons"
                      type="number"
                      value={numberOfSeasons}
                      onChange={(e) => setNumberOfSeasons(e.target.value)}
                      fullWidth
                      required
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Number of Episodes"
                      type="number"
                      value={numberOfEpisodes}
                      onChange={(e) => setNumberOfEpisodes(e.target.value)}
                      fullWidth
                      required
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Popularity"
                      type="number"
                      value={popularity}
                      onChange={(e) => setPopularity(e.target.value)}
                      fullWidth
                      inputProps={{ min: 0, step: 0.001 }}
                      helperText="Popularity score"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="TMDB Rating"
                      type="number"
                      value={tmdbRating}
                      onChange={(e) => setTmdbRating(e.target.value)}
                      fullWidth
                      inputProps={{ min: 0, max: 10, step: 0.1 }}
                      helperText="Rating out of 10"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Vote Count"
                      type="number"
                      value={voteCount}
                      onChange={(e) => setVoteCount(e.target.value)}
                      fullWidth
                      inputProps={{ min: 0 }}
                      helperText="Number of votes"
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
                      helperText="TV Show description/plot summary"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Media */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Media
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Poster URL"
                      value={posterUrl}
                      onChange={(e) => setPosterUrl(e.target.value)}
                      fullWidth
                      helperText="URL to TV show poster image"
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
                </Grid>
              </CardContent>
            </Card>

            {/* Genres */}
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h4">Genres</Typography>
                  <Button startIcon={<PlusOutlined />} onClick={handleAddGenre} size="small">
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
                          onChange={(e) => handleGenreChange(index, e.target.value)}
                        >
                          <MenuItem value="">
                            <em>Select a genre</em>
                          </MenuItem>
                          {TV_SHOW_GENRES.map((g) => (
                            <MenuItem key={g} value={g}>
                              {g}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {genres.length > 1 && (
                        <IconButton onClick={() => handleRemoveGenre(index)} color="error">
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Creators */}
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h4">Creators</Typography>
                  <Button startIcon={<PlusOutlined />} onClick={handleAddCreator} size="small">
                    Add Creator
                  </Button>
                </Stack>
                <Stack spacing={2}>
                  {creators.map((creator, index) => (
                    <Stack direction="row" spacing={2} key={index}>
                      <TextField
                        label={`Creator ${index + 1}`}
                        value={creator}
                        onChange={(e) => handleCreatorChange(index, e.target.value)}
                        fullWidth
                      />
                      {creators.length > 1 && (
                        <IconButton onClick={() => handleRemoveCreator(index)} color="error">
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Networks */}
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h4">Networks</Typography>
                  <Button startIcon={<PlusOutlined />} onClick={handleAddNetwork} size="small">
                    Add Network
                  </Button>
                </Stack>
                <Stack spacing={2}>
                  {networks.map((network, index) => (
                    <Stack direction="row" spacing={2} key={index}>
                      <TextField
                        label={`Network ${index + 1}`}
                        value={network}
                        onChange={(e) => handleNetworkChange(index, e.target.value)}
                        fullWidth
                      />
                      {networks.length > 1 && (
                        <IconButton onClick={() => handleRemoveNetwork(index)} color="error">
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Production Companies */}
            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h4">Production Companies</Typography>
                  <Button startIcon={<PlusOutlined />} onClick={handleAddProductionCompany} size="small">
                    Add Company
                  </Button>
                </Stack>
                <Stack spacing={2}>
                  {productionCompanies.map((company, index) => (
                    <Stack direction="row" spacing={2} key={index}>
                      <TextField
                        label={`Production Company ${index + 1}`}
                        value={company}
                        onChange={(e) => handleProductionCompanyChange(index, e.target.value)}
                        fullWidth
                      />
                      {productionCompanies.length > 1 && (
                        <IconButton onClick={() => handleRemoveProductionCompany(index)} color="error">
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => router.push('/tv-shows')} size="large" disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" startIcon={<SaveOutlined />} size="large" disabled={loading}>
                {loading ? 'Creating TV Show...' : 'Create TV Show'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </MainCard>
    </Box>
  );
}

