import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { UserButton, auth, currentUser, SignInButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import GitHubIcon from '@mui/icons-material/GitHub';

export default async function Navbar() {
  /**
   * Clerk.com Auth-related Code
   */
  // Get the userId from auth() -- if null, the user is not logged in
  const { userId } = auth();

  if (userId) {
    // Query DB for user specific information or display assets only to logged in users
  }

  // Get the User object when you need access to the user's information
  const user = await currentUser();
  // Use `user` to render user details or create UI element

  return (
    <AppBar position="static" style={{ backgroundColor: 'black', border: '3px solid black' }}>
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
          <Image
            src="https://media.tenor.com/dhfraztxBo8AAAAj/globe-joypixels.gif"
            alt="Globe"
            width={40}
            height={40}
            unoptimized
            style={{ margin: '0 8px 0 0' }}
          />
          <Link href="/">
            <Typography
              variant="h6"
              component="div"
              style={{ color: 'white', fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}
            >
              <span style={{ lineHeight: '1.2' }}>GeoNotes</span>
              <span style={{ fontSize: '0.7rem' }}>Learn the world</span>
              {/* <span style={{ fontSize: "0.7rem" }}>Launched Nov 2023 🎉</span> */}
            </Typography>
          </Link>
        </div>
        <div style={{ display: 'flex' }}>
          <Link href="https://github.com/andrewheekin/geonotes.io">
            <IconButton sx={{ color: 'white', '&:hover': { color: 'lightgray' } }}>
              <GitHubIcon />
            </IconButton>
          </Link>
          <Link href="/about">
            <Button color="inherit" style={{ fontFamily: 'monospace' }}>
              About
            </Button>
          </Link>
          <Link href="/submit">
            <Button color="inherit" style={{ fontFamily: 'monospace', letterSpacing: '-0.8px' }}>
              Submit a GeoNote
            </Button>
          </Link>
          {userId ? (
            <div style={{ margin: '0 0 0 10px' }}>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <SignInButton
              mode="modal"
              afterSignInUrl="/"
              afterSignUpUrl="/"
              style={{ fontFamily: 'monospace', fontSize: '0.9rem', letterSpacing: '-0.6px' }}
            >
              SIGN IN
            </SignInButton>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
