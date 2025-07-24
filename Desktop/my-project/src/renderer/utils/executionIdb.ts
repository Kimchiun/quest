import { openDB, IDBPDatabase } from 'idb';
import { Execution } from '@/main/app/domains/executions/models/Execution';

const DB_NAME = 'itms-offline';
const STORE_NAME = 'executions';

async function getDb() {
    return openDB(DB_NAME, 1, {
        upgrade(db: IDBPDatabase<any>) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'localId', autoIncrement: true });
            }
        },
    });
}

export async function saveOfflineExecution(exec: Omit<Execution, 'id' | 'createdAt' | 'updatedAt'>) {
    const db = await getDb();
    await db.add(STORE_NAME, { ...exec, localId: Date.now() });
}

export async function getOfflineExecutions(): Promise<Omit<Execution, 'id' | 'createdAt' | 'updatedAt'>[]> {
    const db = await getDb();
    const all = await db.getAll(STORE_NAME);
    return all;
}

export async function clearOfflineExecutions() {
    const db = await getDb();
    await db.clear(STORE_NAME);
} 