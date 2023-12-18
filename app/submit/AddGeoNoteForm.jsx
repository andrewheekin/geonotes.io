'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';
import { createGeoNote } from '../_lib/actions';
import categories from '../_lib/CategoriesList';
import countries from '../_lib/CountriesList';
import regions from '../_lib/RegionsList';

const initialState = { message: null, errors: {} };

export default function AddGeoNoteForm() {
  const [state, formAction] = useFormState(createGeoNote, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md py-4 md:py-6">
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full rounded-md border border-gray-200 p-2 text-sm"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            className="w-full rounded-md border border-gray-200 p-2 text-sm"
          ></textarea>
        </div>

        {/* Street View Link */}
        <div className="mb-4">
          <label htmlFor="streetViewLink" className="mb-2 block text-sm font-medium">
            Street View Link
          </label>
          <input
            id="streetViewLink"
            name="streetViewLink"
            type="text"
            required
            className="w-full rounded-md border border-gray-200 p-2 text-sm"
          />
        </div>

        {/* Categories */}
        <div className="mb-4">
          <label htmlFor="categories" className="mb-2 block text-sm font-medium">
            Categories
          </label>
          <select
            id="categories"
            name="categories"
            multiple
            required
            className="w-full rounded-md border border-gray-200 p-2 text-sm"
          >
            {categories.map((category, idx) => (
              <option key={idx} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Country */}
        <div className="mb-4">
          <label htmlFor="country" className="mb-2 block text-sm font-medium">
            Country
          </label>
          <select id="country" name="country" required className="w-full rounded-md border border-gray-200 p-2 text-sm">
            {countries.map((country, idx) => (
              <option key={idx} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>

        {/* Region */}
        {/* <div className="mb-4">
          <label htmlFor="region" className="mb-2 block text-sm font-medium">
            Region (Optional)
          </label>
          <select id="region" name="region" multiple className="w-full rounded-md border border-gray-200 p-2 text-sm">
            {regions.map((region, idx) => (
              <option key={idx} value={region.region}>
                {region.region}
              </option>
            ))}
          </select>
        </div> */}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <button className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50">
          Add GeoNote
        </button>
      </div>
    </form>
  );
}
