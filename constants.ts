// NOTE: In a real environment, these should be populated via import.meta.env.VITE_...
// You must replace these placeholder strings with your actual Appwrite Project IDs.

export const APPWRITE_CONFIG = {
  ENDPOINT: 'ttps://sgp.cloud.appwrite.io/v1', // Or your self-hosted endpoint
  PROJECT_ID: '69219b32003852cf85b2',
  DATABASE_ID: '',
  USERS_COLLECTION_ID: 'users',
  ORDERS_COLLECTION_ID: 'orders',
  BUCKET_ID: '6921a9b6000fffc90abd',
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
