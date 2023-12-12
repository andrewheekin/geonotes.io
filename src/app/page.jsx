// src/app/page.js

import { Suspense } from 'react';
import { Typography } from '@mui/material';
import { unstable_noStore as noStore } from 'next/cache';
import GeoNotesContainer from './GeoNotesContainer';
import { supabase } from './SupabaseClient';

export default async function Home() {
  noStore();
  const { data: geoNotes } = await supabase.from('geonote').select('*');

  return (
    <>
      <div className="flex flex-row items-start justify-center">
        <p
          className="font-mono text-black my-0 mx-4 mb-4 bg-green-300 p-2 rounded-lg justify-center max-w-[900px] px-2"
        >
          GeoNotes.io is looking for open source contributors 👀 If you are interested in helping build the site,
          visit our <a href="https://github.com/andrewheekin/geonotes.io/issues" className="text-blue-800 underline">GitHub</a>!
        </p>
      </div>
      <Suspense>
        <GeoNotesContainer geoNotes={geoNotes} />
      </Suspense>
    </>
  );
}
