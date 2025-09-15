import axios from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

interface FetchMoviesParams {
  query: string;
}

interface TMDBResponse {
  results: Movie[];
}

export const fetchMovies = async ({ query }: FetchMoviesParams): Promise<TMDBResponse> => {
  const response = await axios.get<TMDBResponse>(BASE_URL, {
    params: {
      query,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });

  return response.data;
};
