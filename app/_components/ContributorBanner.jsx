export default function ContributorBanner() {
  return (
    <div className="flex flex-row items-start justify-center">
      <div className="m-4 p-2 bg-green-300 rounded-lg max-w-[900px]">
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
