'use client';

import { useState, useEffect }from 'react';
import {
  Query,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  FirestoreError,
  collection,
} from 'firebase/firestore';

import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useMemoFirebase } from '../provider';

type WithId<T> = T & { id: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

export function useCollection<T>(
  memoizedTargetRefOrQuery: (Query<DocumentData> & {__memo?: boolean}) | null | undefined
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    // if a ref is not provided then don't do anything
    if (!memoizedTargetRefOrQuery) {
      setIsLoading(false);
      setData([]);
      return;
    }

    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      (snapshot: QuerySnapshot) => {
        const a: WithId<T>[] = [];
        snapshot.forEach((doc) => {
          a.push({ id: doc.id, ...(doc.data() as T) });
        });
        setData(a);
        setIsLoading(false);
      },
      (error) => {
        const contextualError = new FirestorePermissionError({
          path: (memoizedTargetRefOrQuery as CollectionReference).path,
          operation: 'list'
        });

        setError(contextualError);
        setIsLoading(false);
        setData(null);

        // trigger global error propagation
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return unsubscribe;
  }, [memoizedTargetRefOrQuery]);
  
  if(memoizedTargetRefOrQuery && !memoizedTargetRefOrQuery.__memo) {
    throw new Error('useCollection was not properly memoized using useMemoFirebase');
  }

  return { data, isLoading, error };
}
