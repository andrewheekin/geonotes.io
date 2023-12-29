import Link from 'next/link';
import { fetchGeoNotes } from '../_lib/actions';
import GeoNoteCard from './GeoNoteCard';

export default async function GeoNotesList({ searchParams }) {
  const geoNotes = await fetchGeoNotes({ searchParams });

  // console.log('geoNotes', geoNotes);

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
            <GeoNoteCard key={index} note={note} />
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
