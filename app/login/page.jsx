import AuthForm from '../_components/AuthForm';

export default function Login() {
  return (
    <div className="max-w-xl w-full flex justify-center p-8">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-semibold tracking-tight mb-4">Signup & Login</h1>
        <p className="text-md text-black font-semibold tracking-tight my-2 py-2">
          Login to GeoNotes.io to submit and comment on GeoNotes.
        </p>
        <p className="text-sm text-black font-medium tracking-tight my-2 py-2">Enter your email to sign up or login using the same magic link from our auth provider, Supabase.</p>
        <AuthForm />
      </div>
    </div>
  );
}
