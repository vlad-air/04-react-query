import type { Movie } from './movie';

export interface MovieApiResponse {
  results: Movie[];
  total_pages: number;
}
