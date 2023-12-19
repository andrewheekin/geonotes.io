-- New column "author_id" on table "geonote" is a foreign key to "profiles.id"
ALTER TABLE "public"."geonote" ADD COLUMN "author_id" uuid;

-- We don't want to delete their GeoNotes if a user is deleted, so we'll leave out "ON DELETE CASCADE ON UPDATE CASCADE" 
ALTER TABLE "public"."geonote" ADD CONSTRAINT "geonote_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id");
