import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

export interface FetchMoviesParams {
  query: string;
  page?: number; // параметр пагінації
}

export interface TMDBResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async ({
  query,
  page = 1,
}: FetchMoviesParams): Promise<TMDBResponse> => {
  const response = await axios.get<TMDBResponse>(BASE_URL, {
    params: {
      query,
      page,
      include_adult: false,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });

  return response.data;
};
