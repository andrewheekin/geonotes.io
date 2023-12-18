'use server';

import { Avatar, Typography, Card, Chip, CardContent } from '@mui/material';
import { getCountryCode } from '../_lib/CountriesList';
import StreetViewThumbnail from './StreetViewThumbnail';
import { fetchGeoNotes } from '../_lib/actions';

export default async function GeoNotesList() {
  const geoNotes = await fetchGeoNotes();

  return (
    <div className="m-4 mx-auto max-w-[900px]">
      {geoNotes && geoNotes.length > 0 ? (
        geoNotes.map((note, index) => (
          <div key={index} className="mb-4 border-4 border-black bg-gray-200 relative shadow rounded">
            {note.region && note.region.length > 0 && (
              <Chip
                label={
                  <Typography style={{ fontFamily: 'monospace', fontSize: '0.7rem', margin: 0, padding: '1px' }}>
                    REGIONAL
                  </Typography>
                }
                sx={{
                  position: 'absolute',
                  top: 8, // Adjust as needed
                  right: 8, // Adjust as needed
                  zIndex: 1, // To ensure it stays on top
                  borderRadius: 0,
                  padding: 0,
                  lineHeight: 1,
                }}
              />
            )}
            <CardContent style={{ padding: '1rem' }}>
              <Typography variant="h5" component="div" style={{ fontFamily: 'monospace', color: 'black' }}>
                {note.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" style={{ fontFamily: 'monospace', color: 'black' }}>
                {note.description}
              </Typography>
              <div style={{ marginTop: '10px' }}>
                {/* Country chip */}
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
                {/* Regions chip */}
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
            </CardContent>
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
