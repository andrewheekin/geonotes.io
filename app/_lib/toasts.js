import { Toaster, toast } from 'sonner';
import Link from 'next/link';

export const loginToAddGeoNotesToast = () =>
  toast('Login to add GeoNotes!', {
    description: (
      <div className="font-semibold">
        Please{' '}
        <Link href="/login" className="underline">
          log in
        </Link>{' '}
        to add new GeoNotes
      </div>
    ),
  });

export const loginToFilterGeoNotes = () =>
  toast('Login to sort and filter GeoNotes!', {
    description: (
      <div className="font-semibold">
        Please{' '}
        <Link href="/login" className="underline">
          log in
        </Link>{' '}
        to sort and filter GeoNotes
      </div>
    ),
  });

export const loginToSearchGeoNotes = () =>
  toast('Login to search GeoNotes!', {
    description: (
      <div className="font-semibold">
        Please{' '}
        <Link href="/login" className="underline">
          log in
        </Link>{' '}
        to search GeoNotes
      </div>
    ),
  });

export default function GeoNotesToaster({ font }) {
  return (
    <Toaster
      closeButton
      richColors
      theme={'system'}
      position="top-center"
      duration={1500}
      toastOptions={{
        classNames: {
          title: `${font.className} text-xl md:text-lg tracking-tighter font-bold pt-2 px-4`,
          description: `${font.className} text-lg md:text-md tracking-tight font-semibold py-2 px-4`,
          // toast?: string;
          // loader?: string;
          // closeButton?: string;
          // cancelButton?: string;
          // actionButton?: string;
          // success?: string;
          // error?: string;
          // info?: string;
          // warning?: string;
        },
      }}
      // style: { fontSize: '1rem', padding: '20px', opacity: '0.9' }
      // toastOptions={{
      //   unstyled: true,
      //   classNames: {
      //     toast: 'bg-blue-400',
      //     title: 'text-red-400',
      //     description: 'text-red-400',
      //     actionButton: 'bg-zinc-400',
      //     cancelButton: 'bg-orange-400',
      //     closeButton: 'bg-lime-400',
      //   },
      // }}
    />
  );
}
