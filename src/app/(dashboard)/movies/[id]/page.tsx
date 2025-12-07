'use client';

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import MovieDetailPage from 'views/movie-detail';
import Loader from 'components/Loader';

// ==============================|| MOVIE DETAIL PAGE ||============================== //

function MovieDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return <Loader />;
  }

  return <MovieDetailPage id={id} />;
}

export default function MovieDetail() {
  return (
    <Suspense fallback={<Loader />}>
      <MovieDetailContent />
    </Suspense>
  );
}
