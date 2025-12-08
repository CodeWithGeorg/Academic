
import { Client, Account, Databases, Storage, ID, Query, Models, Permission, Role as AppwriteRole } from 'appwrite';
import { APPWRITE_CONFIG, OrderStatus, UserRole } from '../constants';
import { Order, UserProfile, Submission, Message } from '../types';

// Validation: Warn if Project ID is set
if (!APPWRITE_CONFIG.PROJECT_ID) {
    console.warn("WARN: Appwrite Project ID is missing. The app will load, but API calls will fail. Check .env if this is unintentional.");
}

// Initialize Client with fallback to avoid immediate crash if config is missing
const client = new Client();

if (APPWRITE_CONFIG.ENDPOINT) {
    client.setEndpoint(APPWRITE_CONFIG.ENDPOINT);
}

if (APPWRITE_CONFIG.PROJECT_ID) {
    client.setProject(APPWRITE_CONFIG.PROJECT_ID);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Helper to create unique IDs
export const uniqueId = () => ID.unique();

// Helper for Realtime Subscriptions
export const subscribeToCollection = (collectionId: string, callback: (payload: any) => void) => {
    if (!APPWRITE_CONFIG.DATABASE_ID || !collectionId) {
        console.warn("Skipping subscription: Missing Database ID or Collection ID");
        return () => {};
    }
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
            Query.limit(5000) 
        ]
    );
    return response.documents as unknown as UserProfile[];
};

// --- Assignment/Order Services ---

export const createOrder = async (
  userId: string,
  data: { title: string; description: string; deadline: string; fileId?: string }
) => {
    // Ensure undefined fileId isn't passed to the API
    const payload = {
        userId,
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        status: OrderStatus.PENDING,
        createdAt: new Date().toISOString(),
        ...(data.fileId ? { fileId: data.fileId } : {})
    };

    // Explicitly set permissions so ALL users can read, but only Creator (Admin) can edit/delete
    return await databases.createDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.ORDERS_COLLECTION_ID,
      ID.unique(),
      payload,
      [
        Permission.read(AppwriteRole.users()),      
        Permission.read(AppwriteRole.user(userId)), 
        Permission.update(AppwriteRole.user(userId)), 
        Permission.delete(AppwriteRole.user(userId)), 
      ]
    );
};

export const getClientOrders = async (): Promise<Order[]> => {
    // Fetch all assignments available to students
    // Limit increased to 5000 to match Admin dashboard and show all items
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.ORDERS_COLLECTION_ID,
      [
          Query.orderDesc('createdAt'),
          Query.limit(5000) 
      ]
    );
    return response.documents as unknown as Order[];
};

export const getAllOrders = async (): Promise<Order[]> => {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.ORDERS_COLLECTION_ID,
      [
        Query.orderDesc('createdAt'), 
        Query.limit(5000) 
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
};

export const getAllSubmissions = async (): Promise<Submission[]> => {
    const response = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.SUBMISSIONS_COLLECTION_ID,
        [
            Query.orderDesc('submittedAt'), 
            Query.limit(5000) 
        ]
    );
    return response.documents as unknown as Submission[];
};

export const updateSubmissionStatus = async (submissionId: string, status: 'submitted' | 'approved' | 'rejected' | 'graded', grade?: string) => {
    return await databases.updateDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.SUBMISSIONS_COLLECTION_ID,
        submissionId,
        { status, grade }
    );
};

// --- Message Services (Contact) ---

export const createMessage = async (senderId: string, senderName: string, subject: string, content: string) => {
    return await databases.createDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.MESSAGES_COLLECTION_ID,
        ID.unique(),
        {
            senderId,
            senderName,
            subject,
            content,
            sentAt: new Date().toISOString()
        }
    );
}

export const getAllMessages = async (): Promise<Message[]> => {
     const response = await databases.listDocuments(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.MESSAGES_COLLECTION_ID,
        [
            Query.orderDesc('sentAt'),
            Query.limit(5000)
        ]
    );
    return response.documents as unknown as Message[];
}


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
