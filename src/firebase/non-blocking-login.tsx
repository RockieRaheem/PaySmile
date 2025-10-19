'use client';

import {
  signInWithPopup,
  signOut,
  User,
  AuthProvider,
  getAuth,
} from 'firebase/auth';

/**
 * Initiates a non-blocking sign-in with a popup.
 * Updates UI optimistically and handles errors in the background.
 */
export function signInWithPopupNonBlocking(provider: AuthProvider) {
  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      // User is considered signed in. UI updates are handled by onAuthStateChanged.
      console.log('Sign-in successful for:', result.user.displayName);
    })
    .catch((error) => {
      // Handle sign-in errors.
      // You can use a global error handler or a toast notification here.
      console.error('Sign-in error:', error);
    });
}

/**
 * Initiates a non-blocking sign-out.
 * Updates UI optimistically and handles potential errors.
 */
export function signOutNonBlocking() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // User is considered signed out. UI updates are handled by onAuthStateChanged.
      console.log('Sign-out successful');
    })
    .catch((error) => {
      // Handle sign-out errors.
      console.error('Sign-out error:', error);
    });
}
