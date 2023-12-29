'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Select from 'react-select';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import CountriesList from '../_lib/CountriesList';
import CategoriesList from '../_lib/CategoriesList';
import RegionsList from '../_lib/RegionsList';
import { loginToSearchGeoNotes } from '../_lib/toasts';

const CountriesListOptions = CountriesList.map((country) => ({
  label: country.label,
  value: country.value,
  type: 'country',
}));

const CategoriesListOptions = CategoriesList.map((category) => ({
  label: category.label,
  value: category.value,
  type: 'category',
}));

const RegionsListOptions = RegionsList.map((region) => ({
  label: region.label,
  value: region.value,
  type: 'region',
}));

const groupedOptions = [
  { label: 'Categories', options: CategoriesListOptions },
  { label: 'Countries', options: CountriesListOptions },
  { label: 'Regions', options: RegionsListOptions },
];

export default function GeoNoteSearch() {
  const supabase = createClientComponentClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // async useEffect that checks if user is authenticated within a try catch block
  useEffect(() => {
    const checkIfAuthenticated = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkIfAuthenticated();
  }, []);

  const handleChange = (selectedOptions) => {
    // ALLOW UNLIMITED SEARCHING FOR UNAUTHENTICATED USERS
    // If user is unauthenticated, allow them to search N times then show the login toast
    // if (!isAuthenticated) {
    //   const unauthenticatedSearchCount = parseInt(Cookies.get('unauthenticatedSearchCount') || '0');
    //   if (unauthenticatedSearchCount >= 30) {
    //     loginToSearchGeoNotes();
    //     return;
    //   }
    //   Cookies.set('unauthenticatedSearchCount', unauthenticatedSearchCount + 1, { expires: 14 });
    // }

    // Split selected options by type
    const selectedCountries = selectedOptions.filter((option) => option.type === 'country');
    const selectedCategories = selectedOptions.filter((option) => option.type === 'category');
    const selectedRegions = selectedOptions.filter((option) => option.type === 'region');

    const params = new URLSearchParams(searchParams);

    // Get the values of each type and set them to the search params
    const countryValues = selectedCountries.map((option) => option.value);
    const categoryValues = selectedCategories.map((option) => option.value);
    const regionValues = selectedRegions.map((option) => option.value);

    // Set the selected values to the search params
    params.set('countries', countryValues.join(','));
    params.set('categories', categoryValues.join(','));
    params.set('regions', regionValues.join(','));

    const newParams = `${pathname}?${params.toString()}`;
    replace(newParams);
  };

  const selectedCountries = searchParams.get('countries')?.split(',') || [];
  const selectedCategories = searchParams.get('categories')?.split(',') || [];
  const selectedRegions = searchParams.get('regions')?.split(',') || [];

  const selectedOptionObjects = groupedOptions
    .flatMap((group) => group.options)
    .filter((option) => {
      const selectedValues = [...selectedCountries, ...selectedCategories, ...selectedRegions];
      return selectedValues.includes(option.value);
    });

  return (
    <div className="flex flex-row mb-4 mt-2 w-full">
      <Select
        instanceId="8z7h1o" // added to prevent Next.js hydration error: https://github.com/JedWatson/react-select/issues/5459
        options={groupedOptions}
        value={selectedOptionObjects}
        placeholder="Search countries, categories, regions..."
        onChange={handleChange}
        isMulti
        classNames={{
          container: () => 'w-full',
          control: () => 'border-2 border-gray-400 hover:border-gray-500 bg-transparent p-2 rounded-lg',
          option: () => 'bg-transparent hover:bg-gray-200 duration-100  font-semibold',
          menu: () => 'bg-gray-100 rounded-lg',
          placeholder: () => 'text-md tracking-tight font-semibold',
          multiValue: () => 'text-lg tracking-tight font-semibold bg-gray-300 rounded-2xl px-2 py-1',
          multiValueRemove: () =>
            'text-xl tracking-tight bg-gray-300 px-2 py-0 rounded-2xl hover:bg-gray-400 hover:text-gray-800 duration-100',
        }}
      />
    </div>
  );
}
