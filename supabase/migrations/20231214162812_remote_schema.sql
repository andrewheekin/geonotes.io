
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."parse_streetview_url"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  -- Declare variables to hold the extracted values
  lat_value TEXT;
  lng_value TEXT;
  heading_value TEXT;
  zoom_value TEXT;
  pitch_value TEXT;
BEGIN
  -- -- OLD Use regex to extract the values
  -- lat_value := substring(NEW.streetviewurl FROM '@(-?\d+\.\d+),');
  -- lng_value := substring(NEW.streetviewurl FROM '@-?\d+\.\d+,(-?\d+\.\d+)');
  -- heading_value := substring(NEW.streetviewurl FROM ',(\d+\.?\d*)h,');
  -- zoom_value := substring(NEW.streetviewurl FROM ',(\d+\.?\d*)y,');
  -- pitch_value := substring(NEW.streetviewurl FROM ',(\d+\.?\d*)t');
  
  -- -- OLD Update the new row with the extracted values
  -- NEW.lat := lat_value;
  -- NEW.lng := lng_value;
  -- NEW.heading := heading_value;
  -- NEW.zoom := zoom_value;
  -- NEW.pitch := pitch_value;

  -- Example regex to parse the streetviewurl (this will depend on your specific URL format)
  SELECT (regexp_matches(NEW.streetviewurl, '@(-?\d+\.\d+),'))[1] INTO lat_value;
  SELECT (regexp_matches(NEW.streetviewurl, '@-?\d+\.\d+,(-?\d+\.\d+)'))[1] INTO lng_value;
  SELECT (regexp_matches(NEW.streetviewurl, ',(\d+\.?\d*)h,'))[1] INTO heading_value;
  SELECT (regexp_matches(NEW.streetviewurl, ',(\d+\.?\d*)y,'))[1] INTO zoom_value;
  SELECT (regexp_matches(NEW.streetviewurl, ',(\d+\.?\d*)t'))[1] INTO pitch_value;

  -- Update the new record with the parsed values
  UPDATE "public"."geonote"
  SET "lat" = lat_value, "lng" = lng_value, "heading" = heading_value, "zoom" = zoom_value, "pitch" = pitch_value
  WHERE id = NEW.id;
  
  -- Return the updated row
  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."parse_streetview_url"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."geonote" (
    "id" bigint NOT NULL,
    "title" "text",
    "description" "text",
    "categories" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "author" "text",
    "country" "text",
    "streetviewurl" "text",
    "imageurl" "text",
    "lat" double precision,
    "lng" double precision,
    "heading" double precision,
    "zoom" double precision,
    "pitch" double precision,
    "region" "text"[]
);

ALTER TABLE "public"."geonote" OWNER TO "postgres";

ALTER TABLE "public"."geonote" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."geonote_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."geonote"
    ADD CONSTRAINT "geonote_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "trigger_parse_streetview_url" AFTER INSERT ON "public"."geonote" FOR EACH ROW EXECUTE FUNCTION "public"."parse_streetview_url"();

CREATE POLICY "Allow public read-only access." ON "public"."geonote" FOR SELECT USING (true);

ALTER TABLE "public"."geonote" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."parse_streetview_url"() TO "anon";
GRANT ALL ON FUNCTION "public"."parse_streetview_url"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."parse_streetview_url"() TO "service_role";

GRANT ALL ON TABLE "public"."geonote" TO "anon";
GRANT ALL ON TABLE "public"."geonote" TO "authenticated";
GRANT ALL ON TABLE "public"."geonote" TO "service_role";

GRANT ALL ON SEQUENCE "public"."geonote_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."geonote_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."geonote_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
