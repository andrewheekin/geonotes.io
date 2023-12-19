'use server';

// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
// import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NUM_INITIAL_GEONOTES } from './helpers';

export async function fetchGeoNotes({ searchParams }) {
  noStore();

  console.log('searchParams in fetchGeoNotes', searchParams);

  /**
   * If searchParams is empty, return all the GeoNotes
   *
   * Otherwise, return the GeoNotes that match the searchParams
   * Example searchParams:
   * {
   *   countries: 'Albania,Bhutan,United States',
   *   categories: 'Cars, Trucks (Non-Google)',
   *   regions: 'Alberta'
   * }
   */

  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const hasCountries =
    Object.prototype.hasOwnProperty.call(searchParams, 'countries') && searchParams.countries.length > 0;
  const hasCategories =
    Object.prototype.hasOwnProperty.call(searchParams, 'categories') && searchParams.categories.length > 0;
  const hasAuthor = Object.prototype.hasOwnProperty.call(searchParams, 'author') && searchParams.author.length > 0;

  let countries = [];
  let categories = [];
  let author = '';

  if (hasCountries) {
    countries = searchParams.countries.split(',');
  }
  if (hasCategories) {
    categories = searchParams.categories.split(',');
  }
  if (hasAuthor) {
    author = searchParams.author;
  }

  if (hasAuthor) {
    /**
     * Case where author is provided
     */
    const { data, error } = await supabase.from('geonote').select('*').eq('author_id', author);

    if (error) {
      console.error('Database Error: ', error);
      return {
        message: 'Database Error: Failed to Fetch GeoNotes.',
      };
    }

    return data;
  }

  if (hasCountries && hasCategories) {
    /**
     * Case where both countries and categories are provided
     */
    // Fetch geonote IDs from the mapping table that match all categories
    const { data: mappingData, error: mappingError } = await supabase
      .from('geonote_category_mapping')
      .select('*')
      .in('category_name', categories);

    if (mappingError) {
      console.error('Database Error: ', mappingError);
      return {
        message: 'Database Error: Failed to Fetch GeoNote Categories.',
      };
    }

    // Group the mappingData by geonote_id
    const geonoteCategoryMap = mappingData.reduce((acc, item) => {
      if (!acc[item.geonote_id]) {
        acc[item.geonote_id] = new Set();
      }
      acc[item.geonote_id].add(item.category_name);
      return acc;
    }, {});

    const filteredGeonoteIds = Object.entries(geonoteCategoryMap)
      .filter(([_, categorySet]) => categories.every((cat) => categorySet.has(cat)))
      .map(([geonoteId, _]) => geonoteId);

    // Fetch the geonotes that match these IDs and are in the selected countries
    const { data, error } = await supabase
      .from('geonote')
      .select('*')
      .in('id', filteredGeonoteIds)
      .in('country', countries);

    if (error) {
      console.error('Database Error: ', error);
      return {
        message: 'Database Error: Failed to Fetch GeoNotes.',
      };
    }

    return data;
  } else if (hasCountries) {
    /**
     * Case where only countries are provided
     */
    // Only countries filter is provided
    const { data: countriesData, error: countriesError } = await supabase
      .from('geonote')
      .select('*')
      .in('country', countries);

    if (countriesError) {
      console.error('Database Error: ', countriesError);
      return {
        message: 'Database Error: Failed to Fetch GeoNotes.',
      };
    }

    return countriesData;
  } else if (hasCategories) {
    /**
     * Case where only categories are provided
     */
    const { data: mappingData, error: mappingError } = await supabase
      .from('geonote_category_mapping')
      .select('*')
      .in('category_name', categories);

    if (mappingError) {
      console.error('Database Error: ', mappingError);
      return {
        message: 'Database Error: Failed to Fetch GeoNote Categories.',
      };
    }

    // Group the mappingData by geonote_id
    const geonoteCategoryMap = mappingData.reduce((acc, item) => {
      if (!acc[item.geonote_id]) {
        acc[item.geonote_id] = new Set();
      }
      acc[item.geonote_id].add(item.category_name);
      return acc;
    }, {});

    const filteredGeonoteIds = Object.entries(geonoteCategoryMap)
      .filter(([_, categorySet]) => categories.every((cat) => categorySet.has(cat)))
      .map(([geonoteId, _]) => geonoteId);

    const { data: categoryData, error: categoryError } = await supabase
      .from('geonote')
      .select('*')
      .in('id', filteredGeonoteIds);

    if (categoryError) {
      console.error('Database Error: ', categoryError);
      return {
        message: 'Database Error: Failed to Fetch GeoNotes.',
      };
    }

    return categoryData;
  } else {
    /**
     * Case where No filters provided, return default set of GeoNotes
     *
     */

    const { data, error } = await supabase.from('geonote').select('*').limit(NUM_INITIAL_GEONOTES);

    if (error) {
      console.error('Database Error: ', error);
      return {
        message: 'Database Error: Failed to Fetch GeoNotes.',
      };
    }

    return data;
  }
}

export async function createGeoNote(formData) {
  noStore();

  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });
  const {
    data: {
      user: { id },
    },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.from('profiles').select('username').eq('id', id);

  // Supabase returns results as an array, take the first element
  const username = data[0].username;

  const { title, description, categories, country, region, streetViewLink } = formData;
  const created_at = new Date();

  /**
   * Parse out the Street View URL
   */
  const lat = streetViewLink.match(/@(-?\d+\.\d+),/)[1];
  const lng = streetViewLink.match(/@-?\d+\.\d+,(-?\d+\.\d+)/)[1];
  const heading = streetViewLink.match(/,(\d+\.?\d*)h,/)[1];
  const zoom = streetViewLink.match(/,(\d+\.?\d*)y,/)[1];
  const pitch = parseFloat(streetViewLink.match(/,(\d+\.?\d*)t/)[1]) - 90.0;

  try {
    let addedGeoNote = await supabase
      .from('geonote')
      .insert([
        {
          title,
          description,
          categories,
          created_at,
          author: username,
          author_id: id,
          country,
          streetviewurl: streetViewLink,
          region,
          lat,
          lng,
          heading,
          zoom,
          pitch,
        },
      ])
      .select();

    console.log('GeoNote created successfully!', addedGeoNote);

    // Insert into geonote_category_mapping table
    await supabase.from('geonote_category_mapping').insert(
      categories.map((category) => ({
        geonote_id: addedGeoNote?.data[0].id,
        category_name: category,
      }))
    );

    // TODO: refactor this redirect
    // revalidatePath('/');
    // redirect('/');

    // Giving the error:
    //  ⨯ Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported. at stringify (<anonymous>)
    // return NextResponse.redirect(`${process.env.SITE_URL}/`, { status: 302 });
  } catch (error) {
    console.error('Database Error: ', error);
    return {
      message: 'Database Error: Failed to Create GeoNote.',
    };
  }
}
