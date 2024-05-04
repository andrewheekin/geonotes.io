import Link from 'next/link';
import { headers } from 'next/headers';
import { fetchGeoNotes } from '../_lib/actions';
import GeoNoteCard from './GeoNoteCard';

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

    let _missingGeoNoteText;

    const headersList = headers();
    const nextUrl = headersList.get('next-url');
    if (nextUrl === '/account') {
      // If user is on the account page, show a different message
      _missingGeoNoteText = `You haven't added any GeoNotes yet.`;
    } else {
      _missingGeoNoteText = `No GeoNotes yet for ${combined.length > 0 ? combined.join(', ') : 'this search'}`;
    }

    return _missingGeoNoteText;
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
        <div className="text-center bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.05)] p-4 rounded-lg">
          <p className="text-xl text-black dark:text-white font-semibold tracking-tighter">{missingGeoNoteText}</p>
          <p className="text-xl text-black dark:text-white font-normal tracking-tight"> :(</p>
          <div className="m-8">
            <Link href="/submit" className="text-lg underline hover:text-gray-500 dark:hover:text-gray-400 font-semibold p-2">
              Add one!
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
