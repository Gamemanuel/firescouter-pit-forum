import { db } from '@/utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const syncOfflineData = async (collectionName: string) => {
  const forms = JSON.parse(localStorage.getItem('unsyncedForms') || '[]');
  if (!forms.length) return;

  const stillUnsynced = [];

  for (const entry of forms) {
    try {
      await addDoc(collection(db, collectionName), {
        ...entry,
        syncedAt: serverTimestamp(),
      });
    } catch {
      stillUnsynced.push(entry);
    }
  }

  localStorage.setItem('unsyncedForms', JSON.stringify(stillUnsynced));
};