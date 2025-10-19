'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error('Caught Firestore Permission Error:', error);
      // We throw the error here to make it visible in the Next.js development overlay.
      // This is crucial for developers to see the detailed security rule context.
      // NOTE: This will intentionally cause a crash in development to highlight the error.
      // In a production build, you might want to handle this differently (e.g., just show a toast).
      if (process.env.NODE_ENV === 'development') {
        throw error;
      } else {
        toast({
            variant: 'destructive',
            title: 'Permission Denied',
            description: 'You do not have permission to perform this action.',
        });
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  // This component does not render anything itself.
  return null;
}
