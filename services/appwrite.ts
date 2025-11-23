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

// --- User Services ---

export const createUserDocument = async (userId: string, name: string, email: string, role: UserRole = UserRole.CLIENT) => {
  try {
    return await databases.createDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.USERS_COLLECTION_ID,
      userId, // Use auth ID as document ID for easy lookup
      {
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
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
};

export const getClientOrders = async (userId: string): Promise<Order[]> => {
  const response = await databases.listDocuments(
    APPWRITE_CONFIG.DATABASE_ID,
    APPWRITE_CONFIG.ORDERS_COLLECTION_ID,
    [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
  );
  return response.documents as unknown as Order[];
};

export const getAllOrders = async (): Promise<Order[]> => {
  const response = await databases.listDocuments(
    APPWRITE_CONFIG.DATABASE_ID,
    APPWRITE_CONFIG.ORDERS_COLLECTION_ID,
    [Query.orderDesc('$createdAt')]
  );
  return response.documents as unknown as Order[];
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  return await databases.updateDocument(
    APPWRITE_CONFIG.DATABASE_ID,
    APPWRITE_CONFIG.ORDERS_COLLECTION_ID,
    orderId,
    { status }
  );
};

// --- File Services ---

export const uploadFile = async (file: File) => {
  return await storage.createFile(
    APPWRITE_CONFIG.BUCKET_ID,
    ID.unique(),
    file
  );
};

export const getFileView = (fileId: string) => {
  return storage.getFileView(APPWRITE_CONFIG.BUCKET_ID, fileId).href;
};

export const getFileDownload = (fileId: string) => {
  return storage.getFileDownload(APPWRITE_CONFIG.BUCKET_ID, fileId).href;
};
