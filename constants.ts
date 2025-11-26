// NOTE: In a real environment, these should be populated via import.meta.env.VITE_...
// You must replace these placeholder strings with your actual Appwrite Project IDs.

export const APPWRITE_CONFIG = {
  ENDPOINT: 'https://sgp.cloud.appwrite.io/v1', // Or your self-hosted endpoint
  PROJECT_ID: '692460e80033f24ebcfd',
  DATABASE_ID: 'DatabaseId',
  USERS_COLLECTION_ID: 'users',
  ORDERS_COLLECTION_ID: 'orders',
  SUBMISSIONS_COLLECTION_ID: 'tasks',
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
