import { openDB } from 'idb';

const DB_NAME = 'app-storage';
const STORE_NAME = 'pinia-store';

const dbPromise = openDB(DB_NAME, 3, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME);
    }
  },
});

export const getItem = async <T = any>(key: string): Promise<T | null> => {
  const db = await dbPromise;
  return db.get(STORE_NAME, key);
};

export const setItem = async (key: string, value: any) => {
  const db = await dbPromise;
  await db.put(STORE_NAME, value, key);
};

export const removeItem = async (key: string) => {
  const db = await dbPromise;
  return db.delete(STORE_NAME, key);
};
