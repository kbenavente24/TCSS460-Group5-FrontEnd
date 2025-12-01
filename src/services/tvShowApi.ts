// src/services/tvShowApi.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_TV_SHOW_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_TV_SHOW_API_KEY;

// Create axios instance with default config
const tvShowApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-API-Key': API_KEY,
    accept: 'application/json'
  }
});

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

export const tvShowApi = {
  // Get all TV shows with optional filters
  getTVShows: async (filters?: TVShowFilters): Promise<TVShowsResponse> => {
    console.log('Fetching TV shows with filters:', filters);
    console.log('API Base URL:', API_BASE_URL);
    console.log('API Key:', API_KEY ? 'Present' : 'Missing');

    const response = await tvShowApiClient.get('/tv-shows', {
      params: filters
    });

    console.log('API Response:', response.data);

    // Transform the response to match our interface
    const responseData = response.data;
    let tvShows: TVShow[] = [];
    
    // Handle different response structures
    if (Array.isArray(responseData)) {
      tvShows = responseData;
    } else if (responseData?.data && Array.isArray(responseData.data)) {
      tvShows = responseData.data;
    } else if (responseData?.data && typeof responseData.data === 'object' && !Array.isArray(responseData.data)) {
      // Single TV show object wrapped in data
      tvShows = [responseData.data];
    } else {
      tvShows = [];
    }

    return {
      data: tvShows,
      pagination: responseData?.meta
        ? {
            page: responseData.meta.page || 1,
            limit: responseData.meta.limit || filters?.limit || 20,
            total: responseData.meta.total || tvShows.length,
            totalPages: responseData.meta.pages || 1
          }
        : {
            page: 1,
            limit: filters?.limit || 20,
            total: tvShows.length,
            totalPages: 1
          }
    };
  },

  // Get a single TV show by ID
  getTVShowById: async (id: number): Promise<TVShow> => {
    const response = await tvShowApiClient.get(`/tv-shows/${id}`);
    return response.data;
  },

  // Search TV shows by name
  searchTVShows: async (name: string, page = 1, limit = 20): Promise<TVShowsResponse> => {
    return tvShowApi.getTVShows({ name, page, limit });
  }
};

export default tvShowApi;

