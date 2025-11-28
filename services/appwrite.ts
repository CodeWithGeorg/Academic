import { Client, Account, Databases, Storage, ID, Query, Models } from 'appwrite';
import { APPWRITE_CONFIG, OrderStatus, UserRole } from '../constants';
import { Order, UserProfile, Submission } from '../types';

const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.ENDPOINT)
  .setProject(APPWRITE_CONFIG.PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Helper to create unique IDs
export const uniqueId = () => ID.unique();

// Helper for Realtime Subscriptions
export const subscribeToCollection = (collectionId: string, callback: (payload: any) => void) => {
  return client.subscribe(`databases.${APPWRITE_CONFIG.DATABASE_ID}.collections.${collectionId}.documents`, callback);
};

// --- User Services ---

export const createUserDocument = async (userId: string, name: string, email: string, role: UserRole = UserRole.CLIENT) => {
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
    console.error("Could not fetch user role, defaulting to client.", error);
    return UserRole.CLIENT;
  }
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
    const response = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.USERS_COLLECTION_ID,
        [
            Query.orderDesc('createdAt'), 
            Query.limit(5000) // Increased limit to fetch all users
        ]
    );
    return response.documents as unknown as UserProfile[];
};

// --- Assignment/Order Services ---

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

// Fetch ALL Assignments for the students
export const getClientOrders = async (userId: string): Promise<Order[]> => {
    // We ignore userId here because assignments are public to all students
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.ORDERS_COLLECTION_ID,
      [
          Query.orderDesc('$createdAt'),
          Query.limit(1000) // Ensure students see all active assignments
      ]
    );
    return response.documents as unknown as Order[];
};

export const getAllOrders = async (): Promise<Order[]> => {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.ORDERS_COLLECTION_ID,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(5000) // Increased limit to fetch all assignments
      ]
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

// --- Submission Services ---

export const submitAssignment = async (assignmentId: string, studentId: string, fileId: string, notes?: string) => {
    return await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.SUBMISSIONS_COLLECTION_ID,
        ID.unique(),
        {
            assignmentId,
            studentId,
            fileId,
            notes,
            submittedAt: new Date().toISOString(),
            status: 'submitted'
        }
    );
}

export const getUserSubmissions = async (userId: string): Promise<Submission[]> => {
    const response = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.SUBMISSIONS_COLLECTION_ID,
        [
            Query.equal('studentId', userId),
            Query.orderDesc('submittedAt'),
            Query.limit(1000)
        ]
    );
    return response.documents as unknown as Submission[];
}

export const getAllSubmissions = async (): Promise<Submission[]> => {
    const response = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.SUBMISSIONS_COLLECTION_ID,
        [
            Query.orderDesc('submittedAt'), 
            Query.limit(5000) // Increased limit to fetch all submissions
        ]
    );
    return response.documents as unknown as Submission[];
};

export const updateSubmissionStatus = async (submissionId: string, status: string, grade?: string) => {
    return await databases.updateDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.SUBMISSIONS_COLLECTION_ID,
        submissionId,
        { status, grade }
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
