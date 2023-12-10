// src/app/page.js

import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";
import GeoNotesContainer from "./GeoNotesContainer";
import { supabase } from "./SupabaseClient";

export default async function Home() {
  noStore();
  const { data: geoNotes } = await supabase.from("geonote").select("*");

  return (
    <Suspense>
      <GeoNotesContainer geoNotes={geoNotes} />
    </Suspense>
  );
}
