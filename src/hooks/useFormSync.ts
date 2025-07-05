import { useEffect } from 'react';
import { syncOfflineData } from '../utils/syncOffline';

export const useFormSync = (collectionName: string) => {
  useEffect(() => {
    const sync = () => syncOfflineData(collectionName);

    window.addEventListener('load', sync);
    window.addEventListener('online', sync);
    return () => {
      window.removeEventListener('load', sync);
      window.removeEventListener('online', sync);
    };
  }, [collectionName]);
};