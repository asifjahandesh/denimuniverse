/**
 * IndexedDB storage engine for local PDF manuals.
 * Bypasses the strict 5MB localStorage quota, allowing technical PDFs (up to hundreds of MBs)
 * to be stored and retrieved directly in the browser with zero data loss or quota errors.
 */

const DB_NAME = "denim_universe_pdf_db";
const DB_VERSION = 1;
const STORE_NAME = "pdf_files";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not supported in this browser"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error("Failed to open IndexedDB"));
    };
  });
}

/**
 * Converts a base64 string (or Data URL) into a Uint8Array binary array.
 */
export function base64ToUint8Array(base64Str: string): Uint8Array {
  try {
    const commaIdx = base64Str.indexOf(",");
    const rawBase64 = commaIdx !== -1 ? base64Str.slice(commaIdx + 1) : base64Str;
    const clean = rawBase64.replace(/\s/g, "");
    const binary = atob(clean);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch (err) {
    console.error("Failed to decode base64 string to Uint8Array:", err);
    throw err;
  }
}

/**
 * Saves a PDF File, Blob, or base64 Data URL to IndexedDB under the given resource ID.
 * Returns the indexeddb: reference URI.
 */
export async function savePdfToIndexedDb(resourceId: string, data: File | Blob | string): Promise<string> {
  try {
    const db = await openDb();
    let blobToStore: Blob;

    if (data instanceof Blob) {
      blobToStore = data;
    } else if (typeof data === "string" && data.startsWith("data:")) {
      const bytes = base64ToUint8Array(data);
      blobToStore = new Blob([bytes], { type: "application/pdf" });
    } else {
      // If it's already an indexeddb: or http: url string, no need to store
      return data;
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(blobToStore, resourceId);

      req.onsuccess = () => {
        resolve(`indexeddb:${resourceId}`);
      };

      req.onerror = () => {
        console.error("IndexedDB store.put error:", req.error);
        reject(req.error || new Error("Failed to save PDF into IndexedDB"));
      };
    });
  } catch (err) {
    console.error("Error saving PDF to IndexedDB:", err);
    // If IndexedDB fails, return original data as fallback
    if (typeof data === "string") return data;
    return "";
  }
}

/**
 * Retrieves a PDF from IndexedDB by resource ID.
 * Returns the Blob or null if not found.
 */
export async function getPdfFromIndexedDb(resourceId: string): Promise<Blob | null> {
  try {
    const db = await openDb();
    const cleanId = resourceId.replace(/^indexeddb:/, "");

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(cleanId);

      req.onsuccess = () => {
        if (req.result instanceof Blob) {
          resolve(req.result);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => {
        console.warn("Failed to get PDF from IndexedDB for:", cleanId, req.error);
        resolve(null);
      };
    });
  } catch (err) {
    console.warn("IndexedDB getPdf error:", err);
    return null;
  }
}

/**
 * Deletes a stored PDF from IndexedDB.
 */
export async function deletePdfFromIndexedDb(resourceId: string): Promise<void> {
  try {
    const db = await openDb();
    const cleanId = resourceId.replace(/^indexeddb:/, "");
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(cleanId);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {
    // Ignore error
  }
}
