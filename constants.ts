// NOTE: In a real environment, these should be populated via import.meta.env.VITE_...
// You must replace these placeholder strings with your actual Appwrite Project IDs.

export const APPWRITE_CONFIG = {
  ENDPOINT: import.meta.env.VITE_APPWRITE_ENDPOINT,
  PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  USERS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  ORDERS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID,
  SUBMISSIONS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_SUBMISSIONS_COLLECTION_ID,
  MESSAGES_COLLECTION_ID: import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID,
  BUCKET_ID: import.meta.env.VITE_APPWRITE_BUCKET_ID,
};


export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  REVISION = 'revision',
  COMPLETED = 'completed',
  APPROVED = 'approved',
}

export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
}
