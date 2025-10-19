'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore, DocumentReference, Query, collection, doc } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextType {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  firebaseApp: null,
  auth: null,
  firestore: null,
});

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = () => {
  const { firebaseApp } = useFirebase();
  if (!firebaseApp) {
    throw new Error('Firebase App not available. Make sure you are wrapping your component in a FirebaseProvider.');
  }
  return firebaseApp;
};

export const useAuth = () => {
  const { auth } = useFirebase();
  if (!auth) {
    throw new Error('Firebase Auth not available. Make sure you are wrapping your component in a FirebaseProvider.');
  }
  return auth;
};

export const useFirestore = () => {
  const { firestore } = useFirebase();
  if (!firestore) {
    throw new Error('Firestore not available. Make sure you are wrapping your component in a FirebaseProvider.');
  }
  return firestore;
};

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseProvider({
  children,
  firebaseApp,
  auth,
  firestore,
}: FirebaseProviderProps) {
  const value = { firebaseApp, auth, firestore };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
}

// Hook that properly memoizes a Firestore reference.
export function useMemoFirebase<T>(
  callback: () => T,
  deps: React.DependencyList | undefined,
): (T & {__memo: boolean}) | undefined {
  return useMemo(() => {
    const value = callback()
    // value might be undefined, but if it is we can't memoize it
    if (value) {
      // @ts-ignore - we're adding a property to the object to track that it's memoized
      value.__memo = true
    }
    return value
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps) as any
}
