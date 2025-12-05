/// <reference types="vite/client" />

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_ENDPOINT: string;
  readonly VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_APPWRITE_DATABASE_ID: string;
  readonly VITE_APPWRITE_USERS_COLLECTION_ID: string;
  readonly VITE_APPWRITE_ORDERS_COLLECTION_ID: string;
  readonly VITE_APPWRITE_SUBMISSIONS_COLLECTION_ID: string;
  readonly VITE_APPWRITE_BUCKET_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
