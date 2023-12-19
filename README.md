<div align="center">
  <h1 align="center">GeoNotes.io</h1>
  <h3>GeoNotes.io is the open source platform for community-contributed<br />Street View notes for GeoGuessr</h3>
</div>

<div align="center">
  <a href="https://geonotes.io">geonotes.io</a>
</div>

<br/>

<div align="center">
  <a href="https://github.com/andrewheekkin/geonotes.io/stargazers"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/andrewheekin/geonotes.io"></a>
  <a href="https://github.com/andrewheekin/geonotes.io/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-AGPLv3-purple"></a>
</div>

<br/>

GeoNotes.io is the open source platform for community-contributed Street View notes. Built with Next.js on [Vercel](http://vercel.com/) and [Supabase](https://supabase.com/).

## Demo

<div align="center">
  <p>Home page</p>
  <img src="https://github.com/andrewheekin/geonotes.io/assets/4684591/9c112c93-6f14-46fb-b5e1-d0144fbf6668">
</div>
<br />
<div align="center">
  <p>With cateogry filter</p>
  <img src="https://github.com/andrewheekin/geonotes.io/assets/4684591/178a0a9c-7717-4a1b-bd20-3f7a1db8a163">
</div>

## Contributing

GeoNotes is open source and contributions are welcome!

## Supabase
Installing the [Supabase CLI](https://github.com/supabase/cli).

You can easily pull the database schema down to your local project with the Supabase CLI by running the `db pull` command. Read the local [development docs](https://supabase.com/docs/guides/cli/local-development#link-your-project) for detailed instructions.
```
supabase link --project-ref <project-id>
# You can get <project-id> from your project's dashboard URL: https://supabase.com/dashboard/project/<project-id>
supabase db pull
```

Guide to [Supabase Database migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations) 

#### Sync the remote database schema to local project
```
# Capture any changes that you have made to your remote database
supabase db pull

# To apply the new migration to your local database:
supabase migration up
```

#### Create a local database migration
```
supabase migration new your_migration_name
```

#### Deploy any local database migrations
```
# To apply the new migration to your local database:
supabase db reset

# To apply the new migration to your remote database:
supabase db push
```

#### If a local migration says it has been applied, but isn't showing up in the remote database
On the Supabase dashboard, go to Table Editor > supabase_migrations schema > schema_migrations table. Delete the row for the migration that is not showing up. Then run `supabase db push` again. Note, this must be done from the SQL editor. Ex:
```
delete from supabase_migrations.schema_migrations where version='20231219141738'
```


## Google Street View and Maps Notes

### [Street View Static API Docs](https://developers.google.com/maps/documentation/streetview/request-streetview)

- pitch: (default is 0) specifies the pitch angle of the camera relative to the Street View vehicle. Positive values angle the camera up (with 90 degrees indicating straight up); negative values angle the camera down (with -90 indicating straight down).

### [Street View Panorama Docs](https://developers.google.com/maps/documentation/urls/get-started#street-view-action)

Ex, https://www.google.com/maps/@?api=1&map_action=pano&parameters

- heading: Indicates the compass heading of the camera in degrees clockwise from North. Accepted values are from -180 to 360 degrees. If omitted, a default heading is chosen based on the viewpoint (if specified) of the query and the actual location of the image.
- pitch: Specifies the angle, up or down, of the camera. The pitch is specified in degrees from -90 to 90. Positive values will angle the camera up, while negative values will angle the camera down. The default pitch of 0 is set based on on the position of the camera when the image was captured. Because of this, a pitch of 0 is often, but not always, horizontal. For example, an image taken on a hill will likely exhibit a default pitch that is not horizontal.
- fov: Determines the horizontal field of view of the image. The field of view is expressed in degrees, with a range of 10 - 100. It defaults to 90. When dealing with a fixed-size viewport, the field of view is considered the zoom level, with smaller numbers indicating a higher level of zoom.

### Google Maps Street View link format

Ex, https://www.google.com/maps/@35.6934524,139.7344228,3a,73.9y,7.76h,85.87t/data=!3m6!1e1!3m4!1svBVErdzbPNOtYbPQAd57FA!2e0!7i16384!8i8192?entry=ttu

- @lat,lng
- h: heading, 0 = due north, 180 = due south, 359 = almost north
- t: pitch, 0 = looking down, 180 = looking up - Note, this differs from the Street View Static API, in which the value range is -90 (looking straight down) to 90 (looking straight up)
- y: fov (zoom), 90 = most zoomed out, 15 = most zoomed in
- a: unsure here...
