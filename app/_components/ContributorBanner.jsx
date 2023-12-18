export default function ContributorBanner() {
  return (
    <div className="max-w-5xl justify-center">
      <div className="m-4 p-2 bg-green-300 rounded-lg">
        <p className="text-black text-sm tracking-tighter font-semibold ">
          GeoNotes.io is looking for open source contributors. If you are interested in helping build the site, visit
          our{' '}
          <a href="https://github.com/andrewheekin/geonotes.io/issues" className="text-blue-800 underline">
            GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
