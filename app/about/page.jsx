export default function About() {
  return (
    <div className="max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold text-black">About GeoNotes.io</h1>
      <p className="text-lg text-black my-4 bg-green-200 p-4 rounded-md">
        GeoNotes.io was created by <a href="https://www.geoguessr.com/user/5f0524fe657099387000f26e" className="underline">@geoheek</a> to
        help share tips about Google Street View clues from around the 🌎 (Note, GeoNotes is not affiliated with
        GeoGuessr)
      </p>
      <p className="text-md text-black my-4 bg-gray-300 p-4 rounded-md">
        NOTE ON CHEATING ⛔️ This site is intended to be a fun way to share tips about Google Street View clues and use
        them to get better. Please do NOT use this site to cheat on GeoGuessr. It is not fun for you or your opponents.
        It is also not fun for the GeoGuessr community.
      </p>
      <p className="text-md text-black my-4 bg-blue-200 p-4 rounded-md">
        Feedback is welcome! The project is also{' '}
        <b>
          actively looking for collaborators - software engineers (Next.js) or just anyone passionate about GeoGuessr
        </b>{' '}
        to help build out GeoNotes.io 👇👇
      </p>
      <a
        href="https://github.com/users/andrewheekin/projects/1/views/1"
        className="text-blue-800 text-xl my-8 hover:text-gray-400"
      >
        ROADMAP
      </a>
      <a
        href="https://github.com/andrewheekin/geonotes.io"
        className="text-blue-800 text-xl my-8 ml-10 hover:text-gray-400"
      >
        GITHUB
      </a>
    </div>
  );
}