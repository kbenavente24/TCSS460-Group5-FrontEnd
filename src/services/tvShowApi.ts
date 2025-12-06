// src/services/tvShowApi.ts
import axios from 'axios';

// Use local Next.js API routes to avoid CORS issues
const API_BASE_URL = '/api/tv-shows';

// Create axios instance with default config
// No API key needed here since the Next.js API route handles it
const tvShowApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    accept: 'application/json'
  }
});

// Raw API response interface
export interface TVShowApiResponse {
  id: number;
  name: string;
  original_name: string;
  first_air_date: string;
  last_air_date: string;
  seasons: number;
  episodes: number;
  status: string;
  overview: string;
  popularity: string;
  tmdb_rating: string;
  vote_count: number;
  poster_url: string;
  backdrop_url: string;
  genres: string[];
}

// Component-expected interface
export interface TVShow {
  tv_show_id: number;
  name: string;
  original_name: string;
  creators: string;
  genres: string;
  first_air_date: string;
  last_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number;
  overview: string;
  networks: string;
  production_companies: string;
  vote_average: number;
  poster_url: string;
  backdrop_url: string;
}

export interface TVShowsResponse {
  data: TVShow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TVShowFilters {
  page?: number;
  limit?: number;
  name?: string;
  year?: number;
  genre?: string;
  network?: string;
  creator?: string;
  minSeasons?: number;
  maxSeasons?: number;
  minEpisodes?: number;
  maxEpisodes?: number;
  startDate?: string;
  endDate?: string;
}

/**
 * Transform API response to match component expectations
 */
const transformTVShowData = (apiShow: TVShowApiResponse): TVShow => {
  return {
    tv_show_id: apiShow.id,
    name: apiShow.name,
    original_name: apiShow.original_name,
    creators: 'N/A', // Not available in basic API response
    genres: Array.isArray(apiShow.genres) ? apiShow.genres.join(', ') : '',
    first_air_date: apiShow.first_air_date,
    last_air_date: apiShow.last_air_date,
    number_of_seasons: apiShow.seasons,
    number_of_episodes: apiShow.episodes,
    episode_run_time: 0, // Not available in basic API response
    overview: apiShow.overview,
    networks: 'N/A', // Not available in basic API response
    production_companies: 'N/A', // Not available in basic API response
    vote_average: parseFloat(apiShow.tmdb_rating) || 0,
    poster_url: apiShow.poster_url,
    backdrop_url: apiShow.backdrop_url
  };
};

export const tvShowApi = {
  // Get all TV shows with optional filters
  getTVShows: async (filters?: TVShowFilters): Promise<TVShowsResponse> => {
    console.log('Fetching TV shows with filters:', filters);
    console.log('API Base URL:', API_BASE_URL);

    const response = await tvShowApiClient.get('', {
      params: {
        page: filters?.page || 1,
        limit: filters?.limit || 20,
        q: filters?.name // Use 'q' parameter for search
      }
    });

    console.log('API Response:', response.data);

    const responseData = response.data;
    let tvShows: TVShow[] = [];

    // Handle API response structure: { success: true, data: [...], page, limit, total }
    if (responseData?.success && Array.isArray(responseData.data)) {
      tvShows = responseData.data.map(transformTVShowData);
    } else if (Array.isArray(responseData.data)) {
      tvShows = responseData.data.map(transformTVShowData);
    } else {
      tvShows = [];
    }

    return {
      data: tvShows,
      pagination: {
        page: responseData?.page || 1,
        limit: responseData?.limit || filters?.limit || 20,
        total: responseData?.total || tvShows.length,
        totalPages: Math.ceil((responseData?.total || tvShows.length) / (responseData?.limit || filters?.limit || 20))
      }
    };
  },

  // Get a single TV show by ID
  getTVShowById: async (id: number): Promise<TVShow> => {
    const response = await tvShowApiClient.get(`/${id}`);

    // Handle response structure
    const responseData = response.data;
    let apiShow: TVShowApiResponse;

    if (responseData?.success && responseData.data) {
      apiShow = responseData.data;
    } else if (responseData?.data) {
      apiShow = responseData.data;
    } else {
      apiShow = responseData;
    }

    return transformTVShowData(apiShow);
  },

  // Search TV shows by name
  searchTVShows: async (name: string, page = 1, limit = 20): Promise<TVShowsResponse> => {
    return tvShowApi.getTVShows({ name, page, limit });
  }
};

export default tvShowApi;

