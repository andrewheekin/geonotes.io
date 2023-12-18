import { Suspense } from 'react';
import GeoNotesList from './_components/GeoNotesList';
import GeoNotesContainer from './_components/GeoNotesContainer';
import ContributorBanner from './_components/ContributorBanner';

export default async function Home({ searchParams }) {
  return (
    <>
      <ContributorBanner />
      <GeoNotesContainer />
      <Suspense fallback={null}>
        {/* GeoNotesList is wrapped in Suspense because it is making a fetch request */}
        <GeoNotesList searchParams={searchParams} />
      </Suspense>
    </>
  );
}
