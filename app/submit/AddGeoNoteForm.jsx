'use client';

import React, { useState } from 'react';
import Select from 'react-select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createGeoNote } from '../_lib/actions';
import countries from '../_lib/CountriesList';
import regions from '../_lib/RegionsList';
import categories from '../_lib/CategoriesList';

export default function AddGeoNoteForm() {
  const router = useRouter();

  // State variables for each form field
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [streetViewLink, setStreetViewLink] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegions, setSelectedRegions] = useState([]);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      title,
      description,
      streetViewLink,
      categories: selectedCategories,
      country: selectedCountry,
      region: selectedRegions,
    };
    createGeoNote(formData);

    // Route user to the homepage with Next.js router
    router.push('/account');
  };

  // Handlers for each form field
  const handleCountryChange = (selectedOption) => {
    console.log('country selectedOptions: ', selectedOption);
    setSelectedCountry(selectedOption.value);
  };
  const selectedCountryObject = countries.filter((country) => selectedCountry.includes(country.value));

  const handleCategoryChange = (selectedOptions) => {
    const chosen = selectedOptions.map((option) => option.value);
    setSelectedCategories(chosen);
  };
  const selectedCategoryObjects = categories.filter((category) => selectedCategories.includes(category.value));

  const handleRegionChange = (selectedOptions) => {
    const chosen = selectedOptions.map((option) => option.value);
    setSelectedRegions(chosen);
  };
  const selectedRegionObjects = regions.filter((region) => selectedRegions.includes(region.value));

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-lg p-4 md:py-6 bg-sky-100">
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Title*
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-200 p-2 text-sm"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-200 p-2 text-sm"
          ></textarea>
        </div>

        {/* Street View Link */}
        <div className="mb-4">
          <label htmlFor="streetViewLink" className="mb-2 block text-sm font-medium">
            Street View Link*
          </label>
          <input
            id="streetViewLink"
            name="streetViewLink"
            type="text"
            required
            value={streetViewLink}
            onChange={(e) => setStreetViewLink(e.target.value)}
            className="w-full rounded-md border border-gray-200 p-2 text-sm"
          />
        </div>

        {/* Categories */}
        <div className="mb-4">
          <label htmlFor="categories" className="mb-2 block text-sm font-medium">
            Categories*
          </label>
          <Select
            instanceId="wo17xk" // added to prevent Next.js hydration error: https://github.com/JedWatson/react-select/issues/5459
            options={categories}
            isMulti
            required
            placeholder="Pick categories..."
            onChange={handleCategoryChange}
            value={selectedCategoryObjects}
            classNames={{
              container: (state) => 'w-full',
              control: (state) => 'border-gray-400 p-1 rounded-lg',
              // option: (state) => 'bg-transparent hover:bg-gray-100',
              menu: (state) => 'bg-gray-100 rounded-lg',
              placeholder: (state) => 'text-sm tracking-tight font-normal',
              multiValue: (state) => 'text-lg tracking-tight bg-gray-300 rounded-2xl px-2 py-0',
              multiValueRemove: (state) =>
                'text-xl tracking-tight bg-gray-300 px-2 py-0 rounded-2xl hover:bg-gray-400 hover:text-gray-800',
            }}
          />
        </div>

        {/* Country */}
        <div className="mb-4">
          <label htmlFor="country" className="mb-2 block text-sm font-medium">
            Country*
          </label>
          <Select
            instanceId="2iu1iu" // added to prevent Next.js hydration error: https://github.com/JedWatson/react-select/issues/5459
            options={countries}
            required
            placeholder="Pick country..."
            onChange={handleCountryChange}
            value={selectedCountryObject}
            classNames={{
              container: (state) => 'w-full',
              control: (state) => 'border-gray-400 p-1 rounded-lg',
              // option: (state) => 'bg-transparent hover:bg-gray-100',
              menu: (state) => 'bg-gray-100 rounded-lg',
              placeholder: (state) => 'text-sm tracking-tight font-normal',
            }}
          />
        </div>

        {/* Region */}
        <div className="mb-4">
          <label htmlFor="region" className="mb-2 block text-sm font-medium">
            Region (optional)
          </label>
          <Select
            instanceId="xcj28j" // added to prevent Next.js hydration error: https://github.com/JedWatson/react-select/issues/5459
            options={regions}
            isMulti
            placeholder="Pick regions..."
            onChange={handleRegionChange}
            value={selectedRegionObjects}
            classNames={{
              container: (state) => 'w-full',
              control: (state) => 'border-gray-400 p-1 rounded-lg',
              // option: (state) => 'bg-transparent hover:bg-gray-100',
              menu: (state) => 'bg-gray-100 rounded-lg',
              placeholder: (state) => 'text-sm tracking-tight font-normal',
              multiValue: (state) => 'text-lg tracking-tight bg-gray-300 rounded-2xl px-2 py-0',
              multiValueRemove: (state) =>
                'text-xl tracking-tight bg-gray-300 px-2 py-0 rounded-2xl hover:bg-gray-400 hover:text-gray-800',
            }}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          Add GeoNote
        </button>
      </div>
    </form>
  );
}
