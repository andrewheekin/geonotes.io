import {Suspense } from 'react';
import GeoNotesList from './_components/GeoNotesList';
import GeoNotesContainer from './_components/GeoNotesContainer';
import ContributorBanner from './_components/ContributorBanner';

export default async function Home() {
  return (
    <>
      <ContributorBanner />
      <GeoNotesContainer />
      <Suspense fallback={null}>
        <GeoNotesList />
      </Suspense>
    </>
  );
}
