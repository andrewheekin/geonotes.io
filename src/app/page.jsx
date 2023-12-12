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
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' }}>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{
            fontFamily: 'monospace',
            color: 'black',
            margin: '0px 0 10px 0',
            background: '#c6fbc6',
            padding: '10px',
            borderRadius: '10px',
            width: '50%',
            justifyContent: 'center',
          }}
        >
          GeoNotes.io is looking for open source contributors! If you are interested in helping build the site,
          pick up an issue at <a href="https://github.com/andrewheekin/geonotes.io/issues" style={{
            color: 'navy',
            textDecoration: 'underline',
          }}>GitHub</a>!
        </Typography>
      </div>
      <Suspense>
        <GeoNotesContainer geoNotes={geoNotes} />
      </Suspense>
    </>
  );
}
