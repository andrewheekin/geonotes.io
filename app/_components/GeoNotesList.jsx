'use server';

import { Avatar, Typography, Chip } from '@mui/material';
import { getCountryCode } from '../_lib/CountriesList';
import StreetViewThumbnail from './StreetViewThumbnail';
import { fetchGeoNotes } from '../_lib/actions';

export default async function GeoNotesList({ searchParams }) {
  const geoNotes = await fetchGeoNotes({ searchParams });

  return (
    <div className="max-w-5xl w-full">
      {geoNotes && geoNotes.length > 0 ? (
        geoNotes.map((note, index) => (
          <div key={index} className="mb-4 border-4 border-black bg-gray-200 relative shadow rounded">
            {note.region && note.region.length > 0 && (
              <div className="absolute top-2 right-2 rounded-lg bg-gray-300 py-1 px-2">
                <p className="text-xs text-gray font-semibold">regional</p>
              </div>
            )}
            <div className="p-2 md:p-3">
              <p className="text-xl text-black font-semibold tracking-tighter">{note.title}</p>
              <p className="text-sm text-black font-normal tracking-tight">{note.description}</p>
              <div style={{ marginTop: '10px' }}>
                <Chip
                  label={note.country}
                  style={{ marginRight: '5px', marginBottom: '5px', fontFamily: 'monospace' }}
                  avatar={
                    <Avatar
                      alt=""
                      // variant='square'
                      src={`https://flagcdn.com/w80/${getCountryCode(note.country).toLowerCase()}.png`}
                    />
                  }
                />
                {note.region &&
                  note.region.length > 0 &&
                  note.region.map((reg, index) => (
                    <Chip
                      key={index}
                      label={reg}
                      style={{
                        marginRight: '5px',
                        marginBottom: '5px',
                        fontFamily: 'monospace',
                        backgroundColor: 'rgb(214, 246, 214)',
                      }}
                    />
                  ))}
                {note.categories &&
                  note.categories.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      style={{ marginRight: '5px', marginBottom: '5px', fontFamily: 'monospace' }}
                    />
                  ))}
                {note.author && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'grey', margin: '0 0 5px 0' }}
                  >
                    added by {note.author}
                  </Typography>
                )}
              </div>
              <StreetViewThumbnail
                lat={note.lat}
                lng={note.lng}
                width={2000} // 1.82 ratio of w:h
                height={1100}
                heading={note.heading}
                pitch={note.pitch}
                zoom={note.zoom}
              />
            </div>
          </div>
        ))
      ) : (
        <Typography
          variant="h6"
          component="div"
          style={{ fontFamily: 'monospace', color: 'black', textAlign: 'center', marginTop: '2rem' }}
        >
          No GeoNotes yet for this search :(
        </Typography>
      )}
    </div>
  );
}
