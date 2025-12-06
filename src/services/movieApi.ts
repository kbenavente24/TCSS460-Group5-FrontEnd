// src/services/movieApi.ts
import axios from 'axios';

// Use local Next.js API routes to avoid CORS issues
const API_BASE_URL = '/api/movies';

// Create axios instance with default config
// No API key needed here since the Next.js API route handles it
const movieApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    accept: 'application/json'
  }
});

export interface Movie {
  movie_id: number;
  title: string;
  original_title: string;
  directors: string;
  genres: string;
  release_date: string;
  runtime_minutes: number;
  overview: string;
  budget: string;
  revenue: string;
  mpa_rating: string;
  poster_url: string;
  backdrop_url: string;
}

export interface MoviesResponse {
  data: Movie[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MovieFilters {
  page?: number;
  limit?: number;
  title?: string;
  year?: number;
  genre?: string;
  rating?: string;
  actor?: string;
  director?: string;
  studio?: string;
  collection?: string;
  minBudget?: number;
  maxBudget?: number;
  minRevenue?: number;
  maxRevenue?: number;
  startDate?: string;
  endDate?: string;
}

export const movieApi = {
  // Get all movies with optional filters
  getMovies: async (filters?: MovieFilters): Promise<MoviesResponse> => {
    try {
      console.log('Fetching movies with filters:', filters);
      console.log('API Base URL:', API_BASE_URL);

      const response = await movieApiClient.get('', {
        params: filters
      });

      console.log('API Response:', response.data);

      // The API returns { data: [...], meta: {...} } but we expect pagination
      // Transform the response to match our interface
      const responseData = response.data;
      let movies: Movie[] = [];

      // Handle different response structures
      if (Array.isArray(responseData)) {
        movies = responseData;
      } else if (responseData?.data && Array.isArray(responseData.data)) {
        movies = responseData.data;
      } else if (responseData?.data && typeof responseData.data === 'object' && !Array.isArray(responseData.data)) {
        // Single movie object wrapped in data
        movies = [responseData.data];
      } else {
        movies = [];
      }

      return {
        data: movies,
        pagination: responseData?.meta
          ? {
              page: responseData.meta.page || 1,
              limit: responseData.meta.limit || filters?.limit || 20,
              total: responseData.meta.total || movies.length,
              totalPages: responseData.meta.pages || 1
            }
          : {
              page: 1,
              limit: filters?.limit || 20,
              total: movies.length,
              totalPages: 1
            }
      };
    } catch (error) {
      console.error('Error fetching movies:', error);
      // Return empty result instead of throwing
      return {
        data: [],
        pagination: {
          page: 1,
          limit: filters?.limit || 20,
          total: 0,
          totalPages: 0
        }
      };
    }
  },

  // Get a single movie by ID
  getMovieById: async (id: number): Promise<Movie> => {
    const response = await movieApiClient.get(`/${id}`);
    return response.data;
  },

  // Search movies by title
  searchMovies: async (title: string, page = 1, limit = 20): Promise<MoviesResponse> => {
    return movieApi.getMovies({ title, page, limit });
  }
};

export default movieApi;
