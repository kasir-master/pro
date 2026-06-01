// db.js
const DB_NAME = 'KasirMiniDB';
const DB_VERSION = 1;

class OfflineDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
      
      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(true);
      };
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async saveProduct(product) {
    const tx = this.db.transaction('products', 'readwrite');
    tx.objectStore('products').put(product);
    return tx.complete;
  }

  async getAllProducts() {
    const tx = this.db.transaction('products', 'readonly');
    return new Promise((resolve) => {
      const request = tx.objectStore('products').getAll();
      request.onsuccess = () => resolve(request.result);
    });
  }
  
  async saveSetting(key, value) {
    const tx = this.db.transaction('settings', 'readwrite');
    tx.objectStore('settings').put({ key, value });
    return tx.complete;
  }

  async getSetting(key) {
    const tx = this.db.transaction('settings', 'readonly');
    return new Promise((resolve) => {
      const request = tx.objectStore('settings').get(key);
      request.onsuccess = () => resolve(request.result ? request.result.value : null);
    });
  }
}

const db = new OfflineDB();
