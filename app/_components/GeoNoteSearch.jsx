import Select from 'react-select';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import CountriesList from '../_lib/CountriesList';
import CategoriesList from '../_lib/CategoriesList';
import RegionsList from '../_lib/RegionsList';

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
  { label: 'Countries', options: CountriesListOptions },
  { label: 'Categories', options: CategoriesListOptions },
  { label: 'Regions', options: RegionsListOptions },
];

export default function GeoNoteSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChange = (selectedOptions) => {

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
    <Select
      options={groupedOptions}
      value={selectedOptionObjects}
      placeholder="Countries, categories, regions..."
      onChange={handleChange}
      isMulti
      classNames={{
        container: (state) => 'w-full',
        control: (state) => 'border-gray-400 bg-transparent p-2 rounded-lg',
        option: (state) => 'bg-transparent hover:bg-gray-100',
        menu: (state) => 'bg-gray-100 rounded-lg',
        placeholder: (state) => 'text-sm tracking-tight font-normal',
        multiValue: (state) => 'text-lg tracking-tight bg-gray-300 rounded-2xl px-2 py-1',
        multiValueRemove: (state) =>
          'text-xl tracking-tight bg-gray-300 px-2 py-0 rounded-2xl hover:bg-gray-400 hover:text-gray-800',
      }}
    />
  );
}
