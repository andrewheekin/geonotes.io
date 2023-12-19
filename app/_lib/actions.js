'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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

  /**
   * Countries filtering
   *
   */
  
  if (Object.prototype.hasOwnProperty.call(searchParams, 'countries') && searchParams.countries.length > 0) {
    const countries = searchParams.countries.split(',');
    console.log('countries', countries);

    const { data, error } = await supabase.from('geonote').select('*').in('country', countries);

    if (error) {
      console.error('Database Error: ', error);
      return {
        message: 'Database Error: Failed to Fetch GeoNotes.',
      };
    }

    return data;
  }

  /**
   * Categories filtering
   */
  if (Object.prototype.hasOwnProperty.call(searchParams, 'categories') && searchParams.categories.length > 0) {
    const categories = searchParams.categories.split(',');

    console.log('categories', categories);
    // Fetch geonote IDs from the mapping table. Rows must match all categories.
    const { data: mappingData, error: mappingError } = await supabase
      .from('geonote_category_mapping')
      .select('*')
      .in('category_name', categories);

    console.log('mappingData', mappingData);

    // Here is an example of mappingData:
    // mappingData [
    //   { geonote_id: 36, category_name: 'Utility Poles' },
    //   { geonote_id: 39, category_name: 'Utility Poles' },
    //   { geonote_id: 18, category_name: 'Utility Poles' },
    //   { geonote_id: 19, category_name: 'Utility Poles' },
    //   { geonote_id: 20, category_name: 'Utility Poles' },
    //   { geonote_id: 36, category_name: 'Bollards' },
    //   { geonote_id: 23, category_name: 'Bollards' },
    //   { geonote_id: 24, category_name: 'Bollards' },
    //   { geonote_id: 25, category_name: 'Utility Poles' },
    //   { geonote_id: 32, category_name: 'Bollards' },
    //   { geonote_id: 47, category_name: 'Bollards' },
    //   { geonote_id: 49, category_name: 'Bollards' },
    //   { geonote_id: 50, category_name: 'Bollards' },
    //   { geonote_id: 51, category_name: 'Bollards' },
    //   { geonote_id: 52, category_name: 'Bollards' },
    //   { geonote_id: 3, category_name: 'Utility Poles' }
    // ]

    // Please only return the geonote ID's that match ALL the categories. For example, geonote_id 36 matches both Utility Poles and Bollards, but geonote_id 25 only matches Utility Poles. So, only return geonote_id 36.

    // Group the mappingData by geonote_id
    const geonoteCategoryMap = mappingData.reduce((acc, item) => {
      if (!acc[item.geonote_id]) {
        acc[item.geonote_id] = new Set();
      }
      acc[item.geonote_id].add(item.category_name);
      return acc;
    }, {});

    // Filter out geonote_id that match all categories
    const filteredGeonoteIds = Object.entries(geonoteCategoryMap)
      .filter(([_, categorySet]) => categories.every((cat) => categorySet.has(cat)))
      .map(([geonoteId, _]) => geonoteId);

    // Use filteredGeonoteIds instead of mappingData for further operations

    if (mappingError) {
      console.error('Database Error: ', mappingError);
      return {
        message: 'Database Error: Failed to Fetch GeoNote Categories.',
      };
    }

    // Fetch the geonotes that match these IDs (aka that match all categories)
    const { data, error } = await supabase.from('geonote').select('*').in('id', filteredGeonoteIds);

    if (error) {
      console.error('Database Error: ', error);
      return {
        message: 'Database Error: Failed to Fetch GeoNotes.',
      };
    }

    return data;
  }

  /**
   * Author filtering
   *
   */
  if (Object.prototype.hasOwnProperty.call(searchParams, 'author') && searchParams.author.length > 0) {
    const author = searchParams.author;

    const { data, error } = await supabase.from('geonote').select('*').eq('author_id', author);

    if (error) {
      console.error('Database Error: ', error);
      return {
        message: 'Database Error: Failed to Fetch GeoNotes.',
      };
    }

    return data;
  }

  const { data, error } = await supabase.from('geonote').select('*').limit(NUM_INITIAL_GEONOTES);

  if (error) {
    console.error('Database Error: ', error);
    return {
      message: 'Database Error: Failed to Fetch GeoNotes.',
    };
  }

  return data;
}

export async function createGeoNote(prevState, formData) {
  noStore();

  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });
  const {
    data: {
      user: { email },
    },
  } = await supabase.auth.getUser();

  const { title, description, categories, country, region, author, streetviewurl, created_at } = {
    title: formData.get('title'),
    description: formData.get('description'),
    categories: formData.getAll('categories'),
    country: formData.get('country'),
    region: formData.getAll('region'),
    streetviewurl: formData.get('streetViewLink'),
    created_at: new Date(),
    author: email,
  };

  /**
   * Parse out the Street View URL
   */

  const lat = streetviewurl.match(/@(-?\d+\.\d+),/)[1];
  const lng = streetviewurl.match(/@-?\d+\.\d+,(-?\d+\.\d+)/)[1];
  const heading = streetviewurl.match(/,(\d+\.?\d*)h,/)[1];
  const zoom = streetviewurl.match(/,(\d+\.?\d*)y,/)[1];
  const pitch = parseFloat(streetviewurl.match(/,(\d+\.?\d*)t/)[1]) - 90.0;

  try {
    await supabase.from('geonote').insert([
      {
        title,
        description,
        categories,
        created_at,
        author,
        country,
        streetviewurl,
        region,
        lat,
        lng,
        heading,
        zoom,
        pitch,
      },
    ]);

    console.log('GeoNote created successfully!');

    // If the database operation is successful, revalidate and redirect
    // revalidatePath("/account");
    // redirect("/account");
  } catch (error) {
    console.error('Database Error: ', error);
    return {
      message: 'Database Error: Failed to Create GeoNote.',
    };
  }
}
