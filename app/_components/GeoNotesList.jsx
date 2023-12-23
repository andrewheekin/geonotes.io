import Link from 'next/link';
import { Avatar, Chip } from '@mui/material';
import { getCountryCode } from '../_lib/CountriesList';
import StreetViewThumbnail from './StreetViewThumbnail';
import { fetchGeoNotes } from '../_lib/actions';

export default async function GeoNotesList({ searchParams }) {
  const geoNotes = await fetchGeoNotes({ searchParams });

  const createMissingGeoNoteText = (searchParams) => {
    const hasCountries =
      Object.prototype.hasOwnProperty.call(searchParams, 'countries') && searchParams.countries.length > 0;
    const hasCategories =
      Object.prototype.hasOwnProperty.call(searchParams, 'categories') && searchParams.categories.length > 0;

    let countries = [];
    let categories = [];

    if (hasCountries) {
      countries = searchParams.countries.split(',');
    }
    if (hasCategories) {
      categories = searchParams.categories.split(',');
    }

    let combined = [...countries, ...categories];

    return `No GeoNotes yet for ${combined.length > 0 ? combined.join(', ') : 'this search'}`;
  };

  const missingGeoNoteText = createMissingGeoNoteText(searchParams);

  const isGrid = searchParams?.displayType === 'grid';

  return (
    <>
      {geoNotes && geoNotes.length > 0 ? (
        <div className={`${isGrid ? 'grid grid-cols-2 gap-4' : 'flex flex-col'}`}>
          {geoNotes.map((note, index) => (
            <div key={index} className="mb-4 border-4 border-black bg-gray-200 relative shadow rounded">
              {note.region && note.region.length > 0 && (
                <div className="absolute top-2 right-2 rounded-lg bg-gray-300 py-1 px-2">
                  <p className="text-xs text-gray font-semibold">regional</p>
                </div>
              )}
              <div className="p-2 md:p-3">
                <p className="text-xl text-black font-semibold tracking-tighter">{note.title}</p>
                <p className="text-sm text-black font-medium tracking-tight">{note.description}</p>
                <div style={{ marginTop: '10px' }}>
                  <Chip
                    label={note.country}
                    className="mr-1 mb-2"
                    avatar={
                      <Avatar
                        alt=""
                        src={`https://flagcdn.com/w80/${getCountryCode(note.country).toLowerCase()}.png`}
                      />
                    }
                  />
                  {note.region &&
                    note.region.length > 0 &&
                    note.region.map((reg, index) => (
                      <Chip className="mr-1 mb-2 bg-green-200" key={index} label={reg} />
                    ))}
                  {note.categories &&
                    note.categories.map((category, index) => (
                      <Chip className="mr-1 mb-2" key={index} label={category} />
                    ))}
                  {note.author && (
                    <p className="text-gray-500 font-normal tracking-tight text-xs mb-2">added by {note.author}</p>
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
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl text-black font-semibold tracking-tighter">{missingGeoNoteText}</p>
          <p className="text-xl text-black font-normal tracking-tight"> :(</p>
          <div className="m-8">
            <Link href="/submit" className="text-lg underline hover:text-gray-500">
              Add one!
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
