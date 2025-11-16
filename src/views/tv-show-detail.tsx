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

// Mock TV show data (same as in tv-shows.tsx)
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
      'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
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
      'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the twentieth century.',
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
    overview:
      'A young chef from the fine dining world returns to Chicago to run his family\'s Italian beef sandwich shop.',
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
      'Ted Lasso, an American football coach, moves to England when he\'s hired to manage a soccer team—despite having no experience. With cynical players and a doubtful town, will he get them to see the Ted Lasso Way?',
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

// ==============================|| TV SHOW DETAIL PAGE ||============================== //

export default function TVShowDetailPage({ id }: { id?: string }) {
  const router = useRouter();
  const [tvShow, setTvShow] = useState<typeof MOCK_TV_SHOWS[0] | null>(null);

  useEffect(() => {
    if (!id) {
      setTvShow(null);
      return;
    }
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      setTvShow(null);
      return;
    }
    const show = MOCK_TV_SHOWS.find((s) => s.tv_show_id === parsedId);
    setTvShow(show || null);
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (!tvShow) {
    return (
      <Box sx={{ height: 'calc(100vh - 80px)', p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <MainCard sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4">TV Show not found</Typography>
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
      <Button
        startIcon={<ArrowLeftOutlined />}
        onClick={() => router.push('/tv-shows')}
        sx={{ mb: 2 }}
        variant="outlined"
      >
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
                <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                  <Chip label={`⭐ ${tvShow.vote_average}/10`} color="primary" size="small" />
                  <Chip label={`${tvShow.episode_run_time} min/episode`} variant="outlined" size="small" />
                  <Chip label={`${tvShow.number_of_seasons} Seasons`} variant="outlined" size="small" />
                  <Chip label={`${tvShow.number_of_episodes} Episodes`} variant="outlined" size="small" />
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

              {/* Creators */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Creators
                </Typography>
                <Typography variant="body1">{tvShow.creators}</Typography>
              </Box>

              {/* Networks and Production */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Network
                  </Typography>
                  <Typography variant="body1">{tvShow.networks}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Production Companies
                  </Typography>
                  <Typography variant="body1">{tvShow.production_companies}</Typography>
                </Grid>
              </Grid>

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
