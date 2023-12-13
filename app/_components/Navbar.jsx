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
    <AppBar position="static" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
      <Toolbar style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
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
              variant="h5"
              component="div"
              style={{ color: 'black', fontWeight: '500', display: 'flex', flexDirection: 'column' }}
            >
              <span style={{ lineHeight: '1.2' }}>GeoNotes</span>
              {/* <span style={{ fontSize: '0.7rem' }}>Learn the world</span> */}
              {/* <span style={{ fontSize: "0.7rem" }}>Launched Nov 2023 🎉</span> */}
            </Typography>
          </Link>
        </div>
        <div style={{ display: 'flex' }}>
          <Link href="https://github.com/andrewheekin/geonotes.io">
            <IconButton sx={{ color: 'black', '&:hover': { color: 'lightgray' } }}>
              <GitHubIcon />
            </IconButton>
          </Link>
          <Link href="/about">
            <Button style={{ color: 'black' }}>About</Button>
          </Link>
          <Link href="/submit">
            <Button style={{ letterSpacing: '-0.8px', color: 'black' }}>Submit a GeoNote</Button>
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
              style={{ fontSize: '0.9rem', letterSpacing: '-0.6px', color: 'black' }}
            >
              SIGN IN
            </SignInButton>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
