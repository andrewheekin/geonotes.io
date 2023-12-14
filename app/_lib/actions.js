import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGeoNote(prevState, formData) {
  console.log('formData: ', formData);
  console.log('prevState: ', prevState);

  // Extract form data
  // const { title, description, categories, country, region, author, streetViewLink } = formData;

  console.log('formData: ', formData);

  try {
    // Assuming you have a SQL query function set up (like 'sql' from 'postgres')
    // Update the query according to your database schema
    // await sql`INSERT INTO geonotes (title, description, categories, country, region, author, streetViewLink)
    // VALUES (${title}, ${description}, ${categories}, ${country}, ${region}, ${author}, ${streetViewLink})`;

    // If the database operation is successful, revalidate and redirect
    // revalidatePath("/");
    // redirect("/"); // Update the redirect path as needed

  } catch (error) {
    console.error("Database Error: ", error);
    return {
      message: "Database Error: Failed to Create GeoNote.",
    };
  }
}
