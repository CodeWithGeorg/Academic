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

// --- Mock Data for Demo Mode ---
const MOCK_ORDERS: Order[] = [
  {
    $id: 'mock-1',
    $collectionId: 'orders',
    $databaseId: 'db',
    $createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    $sequence: 0,
    userId: 'admin-1',
    title: 'Assignment 1: Quantum Physics Intro',
    description: 'Read the attached PDF and answer the questions on page 5 regarding error correction.',
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    status: OrderStatus.PENDING,
    fileId: 'mock-file',
  },
  {
    $id: 'mock-2',
    $collectionId: 'orders',
    $databaseId: 'db',
    $createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    $sequence: 0,
    userId: 'admin-1',
    title: 'Project: Market Trends Analysis',
    description: 'Use the provided dataset to analyze Q3 market trends. Submit your report as a PDF.',
    deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
    status: OrderStatus.IN_PROGRESS,
  },
  {
    $id: 'mock-3',
    $collectionId: 'orders',
    $databaseId: 'db',
    $createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: [],
    $sequence: 0,
    userId: 'admin-1',
    title: 'Essay: The Great Depression',
    description: 'Write a 1500 word essay on the economic impact of the Great Depression.',
    deadline: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: OrderStatus.COMPLETED,
  }
];

// const MOCK_SUBMISSIONS: Submission[] = [
//     {
//         $id: 'sub-1',
//         $collectionId: 'submissions',
//         $databaseId: 'db',
//         $createdAt: new Date().toISOString(),
//         $updatedAt: new Date().toISOString(),
//         assignmentId: 'mock-3',
//         studentId: 'user-1',
//         fileId: 'mock-file-sub',
//         submittedAt: new Date().toISOString(),
//         status: 'graded',
//         grade: 'A-'
//     }
// ];

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

// --- Assignment/Order Services ---

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
    return {
      $id: 'temp-mock-id-' + Date.now(),
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

// Now used to fetch ALL Assignments for the students
export const getClientOrders = async (userId: string): Promise<Order[]> => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.ORDERS_COLLECTION_ID,
      [Query.orderDesc('$createdAt')]
    );
    return response.documents as unknown as Order[];
  } catch (error) {
    console.warn("Fetch client orders failed (using demo data).", error);
    // Return ALL mock orders regardless of user, as these are assignments
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

// --- Submission Services ---

export const submitAssignment = async (assignmentId: string, studentId: string, fileId: string, notes?: string) => {
    try {
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
    } catch (error) {
        console.warn("Submission failed (demo mode).");
        return { $id: 'mock-submission-id' };
    }
}

export const getUserSubmissions = async (userId: string): Promise<Submission[]> => {
    try {
        const response = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.SUBMISSIONS_COLLECTION_ID,
            [
                Query.equal('studentId', userId),
                Query.orderDesc('submittedAt')
            ]
        );
        return response.documents as unknown as Submission[];
    } catch (error) {
        console.warn("Fetch submissions failed (using demo data).");
        // return MOCK_SUBMISSIONS;
    }
}

export const getAllSubmissions = async (): Promise<Submission[]> => {
    try {
        const response = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.SUBMISSIONS_COLLECTION_ID,
            [Query.orderDesc('submittedAt'), Query.limit(100)]
        );
        return response.documents as unknown as Submission[];
    } catch (error) {
        // return MOCK_SUBMISSIONS;
    }
};

export const updateSubmissionStatus = async (submissionId: string, status: string, grade?: string) => {
    try {
        return await databases.updateDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.SUBMISSIONS_COLLECTION_ID,
            submissionId,
            { status, grade }
        );
    } catch (error) {
        console.warn("Update submission failed (demo mode)");
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