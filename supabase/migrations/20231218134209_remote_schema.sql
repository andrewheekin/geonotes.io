create extension if not exists "http" with schema "extensions";


drop trigger if exists "trigger_parse_streetview_url" on "public"."geonote";

drop function if exists "public"."parse_streetview_url"();

create policy "Enable insert for authenticated users only"
on "public"."geonote"
as permissive
for insert
to authenticated
with check (true);



