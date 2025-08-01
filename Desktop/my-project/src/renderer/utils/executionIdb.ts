import { Execution } from '@/main/app/domains/executions/models/Execution';

interface IndexedDBConfig {
  name: string;
  version: number;
  stores: {
    name: string;
    keyPath: string;
    indexes?: { name: string; keyPath: string; options?: IDBIndexParameters }[];
  }[];
}

const config: IndexedDBConfig = {
  name: 'ITMSExecutionDB',
  version: 1,
  stores: [
    {
      name: 'executions',
      keyPath: 'id',
      indexes: [
        { name: 'testCaseId', keyPath: 'testCaseId' },
        { name: 'releaseId', keyPath: 'releaseId' },
        { name: 'status', keyPath: 'status' },
        { name: 'executedBy', keyPath: 'executedBy' },
      ],
    },
  ],
};

class ExecutionIDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(config.name, config.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        config.stores.forEach(storeConfig => {
          if (!db.objectStoreNames.contains(storeConfig.name)) {
            const store = db.createObjectStore(storeConfig.name, { keyPath: storeConfig.keyPath });
            
            storeConfig.indexes?.forEach(indexConfig => {
              store.createIndex(indexConfig.name, indexConfig.keyPath, indexConfig.options);
            });
          }
        });
      };
    });
  }

  async saveExecution(execution: Execution): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['executions'], 'readwrite');
      const store = transaction.objectStore('executions');
      const request = store.put(execution);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getExecution(id: number): Promise<Execution | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['executions'], 'readonly');
      const store = transaction.objectStore('executions');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllExecutions(): Promise<Execution[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['executions'], 'readonly');
      const store = transaction.objectStore('executions');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteExecution(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['executions'], 'readwrite');
      const store = transaction.objectStore('executions');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAll(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['executions'], 'readwrite');
      const store = transaction.objectStore('executions');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const executionIdb = new ExecutionIDB(); 