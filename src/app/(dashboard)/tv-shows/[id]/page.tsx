'use client';

import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import TVShowDetailPage from 'views/tv-show-detail';
import Loader from 'components/Loader';

// ==============================|| TV SHOW DETAIL PAGE ||============================== //

function TVShowDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return <Loader />;
  }

  return <TVShowDetailPage id={id} />;
}

export default function TVShowDetail() {
  return (
    <Suspense fallback={<Loader />}>
      <TVShowDetailContent />
    </Suspense>
  );
}
