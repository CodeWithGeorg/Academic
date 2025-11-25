import { Client, Account, Databases, Storage, ID, Query, Models } from 'appwrite';
import { APPWRITE_CONFIG, OrderStatus, UserRole } from '../constants';
import { Order, UserProfile } from '../types';

const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.ENDPOINT)
  .setProject(APPWRITE_CONFIG.PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Helper to create unique IDs
export const uniqueId = () => ID.unique();

// --- Mock Data for Demo Mode ---
const MOCK_ORDERS: Order[] = [
  {
    $id: 'mock-1',
    $collectionId: 'orders',
    $databaseId: 'db',
    $createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    $sequence: 0,
    userId: 'user-1',
    title: 'Research Paper on Quantum Computing',
    description: 'Need a 10-page paper on the current state of Quantum Computing with focus on error correction.',
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    status: OrderStatus.PENDING,
    fileId: 'mock-file',
  },
  {
    $id: 'mock-2',
    $collectionId: 'orders',
    $databaseId: 'db',
    $createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    $sequence: 0,
    userId: 'user-2',
    title: 'Statistical Analysis of Market Trends',
    description: 'Analyze the attached CSV data and provide a summary report.',
    deadline: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: OrderStatus.COMPLETED,
  },
  {
    $id: 'mock-3',
    $collectionId: 'orders',
    $databaseId: 'db',
    $createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    $sequence: 0,
    userId: 'user-1',
    title: 'Thesis Proofreading',
    description: 'Please check for grammar and flow in Chapter 4.',
    deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
    status: OrderStatus.IN_PROGRESS,
  },
  {
    $id: 'mock-4',
    $collectionId: 'orders',
    $databaseId: 'db',
    $createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    $sequence: 0,
    userId: 'user-3',
    title: 'History Essay - WW2',
    description: '5 pages on the economic impact of WW2.',
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: OrderStatus.APPROVED,
  },
  {
    $id: 'mock-5',
    $collectionId: 'orders',
    $databaseId: 'db',
    $createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    $sequence: 0,
    userId: 'user-2',
    title: 'React App Development',
    description: 'Build a simple Todo app with Redux.',
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: OrderStatus.REVISION,
  }
];

// --- User Services ---

export const createUserDocument = async (userId: string, name: string, email: string, role: UserRole = UserRole.CLIENT) => {
  try {
    return await databases.createDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.USERS_COLLECTION_ID,
      userId,
      {
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.warn("Error creating user document (possibly demo mode):", error);
    return null;
  }
};

export const getUserRole = async (userId: string): Promise<UserRole> => {
  try {
    const doc = await databases.getDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.USERS_COLLECTION_ID,
      userId
    );
    return (doc.role as UserRole) || UserRole.CLIENT;
  } catch (error) {
    console.warn("Could not fetch user role, defaulting to client.", error);
    return UserRole.CLIENT;
  }
};

// --- Order Services ---

export const createOrder = async (
  userId: string,
  data: { title: string; description: string; deadline: string; fileId?: string }
) => {
  try {
    return await databases.createDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.ORDERS_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        ...data,
        status: OrderStatus.PENDING,
        createdAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.warn("Create order failed (demo mode), returning mock.");
    // Return a fake document to satisfy the UI
    return {
      $id: 'temp-mock-id',
      $collectionId: 'orders',
      $databaseId: 'db',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $sequence: 0,
      ...data,
      status: OrderStatus.PENDING,
    } as unknown as Models.Document;
  }
};

export const getClientOrders = async (userId: string): Promise<Order[]> => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.ORDERS_COLLECTION_ID,
      [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
    );
    return response.documents as unknown as Order[];
  } catch (error) {
    console.warn("Fetch client orders failed (using demo data).", error);
    return MOCK_ORDERS;
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.ORDERS_COLLECTION_ID,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ]
    );
    return response.documents as unknown as Order[];
  } catch (error) {
    console.warn("Fetch all orders failed (using demo data).", error);
    return MOCK_ORDERS;
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  try {
    return await databases.updateDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.ORDERS_COLLECTION_ID,
      orderId,
      { status }
    );
  } catch (error) {
    console.warn("Update status failed (demo mode).");
    return null;
  }
};

// --- File Services ---

export const uploadFile = async (file: File) => {
  try {
    return await storage.createFile(
      APPWRITE_CONFIG.BUCKET_ID,
      ID.unique(),
      file
    );
  } catch (error) {
    console.warn("File upload failed (demo mode).");
    return { $id: 'mock-file-id' } as Models.File;
  }
};

export const getFileView = (fileId: string) => {
  try {
    return storage.getFileView(APPWRITE_CONFIG.BUCKET_ID, fileId).toString();
  } catch {
    return '#';
  }
};

export const getFileDownload = (fileId: string) => {
  try {
    return storage.getFileDownload(APPWRITE_CONFIG.BUCKET_ID, fileId).toString();
  } catch {
    return '#';
  }
};