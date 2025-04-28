import { openDB } from "idb";

const DB_NAME = "CaloratorDB";
const DB_VERSION = 1;
const STORE_NAME = "graphData";

// Initialize the database
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" }); // Use "id" as the primary key
      }
    },
  });
};

// Save data to IndexedDB
export const saveData = async (id, data) => {
  const db = await initDB();
  return db.put(STORE_NAME, { id, data });
};

// Retrieve data from IndexedDB
export const getData = async (id) => {
  const db = await initDB();
  return db.get(STORE_NAME, id);
};

// Delete data from IndexedDB
export const deleteData = async (id) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};

// Clear all data from IndexedDB
export const clearAllData = async () => {
  const db = await initDB();
  return db.clear(STORE_NAME);
};
