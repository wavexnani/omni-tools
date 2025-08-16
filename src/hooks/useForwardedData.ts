import { useEffect, useState } from 'react';

async function getFileFromIndexedDB(key: string): Promise<File | null> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('OmniToolsDB', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files');
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('files', 'readonly');
      const store = tx.objectStore('files');
      const getRequest = store.get(key);
      getRequest.onsuccess = () => {
        resolve(getRequest.result || null);
      };
      getRequest.onerror = reject;
    };
    request.onerror = reject;
  });
}

async function removeFileFromIndexedDB(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Attempting to remove file from IndexedDB with key:', key);
    const request = indexedDB.open('OmniToolsDB', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files');
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      const deleteRequest = store.delete(key);
      deleteRequest.onsuccess = () => {
        console.log('Delete request successful for key:', key);
        resolve();
      };
      deleteRequest.onerror = (error) => {
        console.error('Delete request failed for key:', key, error);
        reject(error);
      };
    };
    request.onerror = (error) => {
      console.error('Failed to open IndexedDB:', error);
      reject(error);
    };
  });
}

export interface ForwardedData {
  file: File | null;
  toolName: string;
  timestamp: number;
}

export function useForwardedData() {
  const [forwardedData, setForwardedData] = useState<ForwardedData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkForForwardedData = async () => {
      const isForwarded = localStorage.getItem('isForwarded');
      console.log('Checking for forwarded data, isForwarded:', isForwarded);
      if (isForwarded === 'true') {
        setIsLoading(true);
        try {
          const toolName = localStorage.getItem('forwardTool');
          console.log('Tool name from localStorage:', toolName);
          if (toolName) {
            const file = await getFileFromIndexedDB(toolName);
            console.log('File retrieved from IndexedDB:', file);
            if (file) {
              const data = {
                file,
                toolName,
                timestamp: Date.now()
              };
              console.log('Setting forwarded data:', data);
              setForwardedData(data);
            }
          }
        } catch (error) {
          console.error('Error loading forwarded data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkForForwardedData();
  }, []);

  const clearForwardedData = async () => {
    if (forwardedData) {
      try {
        console.log(
          'Clearing forwarded data for tool:',
          forwardedData.toolName
        );
        await removeFileFromIndexedDB(forwardedData.toolName);
        console.log('File removed from IndexedDB');
        localStorage.removeItem('isForwarded');
        localStorage.removeItem('forwardTool');
        console.log('localStorage cleared');
        setForwardedData(null);
        console.log('Forwarded data state cleared');
      } catch (error) {
        console.error('Error clearing forwarded data:', error);
      }
    }
  };

  return {
    forwardedData,
    isLoading,
    clearForwardedData
  };
}
