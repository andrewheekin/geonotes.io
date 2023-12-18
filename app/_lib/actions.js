'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function fetchGeoNotes() {
  noStore();

  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  // const { data, error } = await supabase.from('geonote').select('*'); //.limit(20);
  const data = {};
  const error = '';

  if (error) {
    console.error('Database Error: ', error);
    return {
      message: 'Database Error: Failed to Fetch GeoNotes.',
    };
  }

  return data;
}

export async function createGeoNote(prevState, formData) {
  // const {
  //   data: {
  //     user: { email },
  //   },
  // } = await supabase.auth.getUser();
  const email = 'abc';

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
  const pitch = streetviewurl.match(/,(\d+\.?\d*)t/)[1];

  console.log('lat: ' + lat);
  console.log('lng: ' + lng);
  console.log('heading: ' + heading);
  console.log('zoom: ' + zoom);
  console.log('pitch: ' + pitch);

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
