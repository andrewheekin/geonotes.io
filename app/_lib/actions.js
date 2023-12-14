import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { supabase } from './SupabaseClient';

export async function createGeoNote(prevState, formData) {
  console.log('formData: ', formData);
  console.log('prevState: ', prevState);

  // Extract form data
  // const { title, description, categories, country, region, author, streetViewLink } = formData;

  console.log('formData: ', formData);

  try {
    // Insert new GeoNote into database
    // Here's a sample SQL insert:
    /*
insert into
public.geonote (  title,  description,  categories,  created_at,  author,  country,  streetviewurl,  imageurl,  lat,  lng,
  heading,  zoom,  pitch, region )
values
(
  'Sample Title',
  'Sample Description',
  array['Category1', 'Category2'],
  now(),
  'John Doe',
  'USA',
  'https://samplestreetviewurl.com',
  'https://sampleimageurl.com',
  37.7749,
  -122.4194,
  90.0,
  10.0,
  0.0,
  array['Region1', 'Region2']
);
*/
    supabase
      .from('geonote')
      .insert([
        {
          title: 'Sample Title',
          description: 'Sample Description',
          categories: ['Category1', 'Category2'],
          created_at: new Date(),
          author: 'John Doe',
          country: 'USA',
          streetviewurl: 'https://samplestreetviewurl.com',
          imageurl: 'https://sampleimageurl.com',
          lat: 37.7749,
          lng: -122.4194,
          heading: 90.0,
          zoom: 10.0,
          pitch: 0.0,
          region: ['Region1', 'Region2'],
        },
      ])
      .then(({ data, error }) => {
        if (error) {
          console.log('error: ', error);
          throw error;
        }
        console.log('data: ', data);
      });

    // Assuming you have a SQL query function set up (like 'sql' from 'postgres')
    // Update the query according to your database schema
    // await sql`INSERT INTO geonotes (title, description, categories, country, region, author, streetViewLink)
    // VALUES (${title}, ${description}, ${categories}, ${country}, ${region}, ${author}, ${streetViewLink})`;

    // If the database operation is successful, revalidate and redirect
    // revalidatePath("/");
    // redirect("/"); // Update the redirect path as needed
    return {
      message: 'Success: GeoNote Created.',
    };
  } catch (error) {
    console.error('Database Error: ', error);
    return {
      message: 'Database Error: Failed to Create GeoNote.',
    };
  }
}
