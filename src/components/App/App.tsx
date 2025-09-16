import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';

import styles from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import type { TMDBResponse } from '../../services/movieService';
import { fetchMovies } from '../../services/movieService';

import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useQuery<TMDBResponse>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies({ query, page }),
    enabled: !!query,
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (isError) {
      toast.error('Something went wrong. Please try again.');
    }
  }, [isError]);

  useEffect(() => {
    if (query && data) {
      if (data.results.length === 0) {
        toast.error('No movies found for your request');
      } else {
        toast.success('Movies loaded successfully');
      }
    }
  }, [data, query]);

  return (
    <div className={styles.container}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      {(isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage />}

      {isSuccess && movies.length > 0 && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={movies} onSelect={(movie) => setSelectedMovie(movie)} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
};

export default App;
