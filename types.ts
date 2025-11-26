import { Models } from 'appwrite';
import { OrderStatus, UserRole } from './constants';

export interface UserProfile {
  $id: string; // Appwrite User ID
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Order extends Models.Document {
  userId: string;
  title: string;
  description: string;
  deadline: string;
  fileId?: string;
  status: OrderStatus;

  $id: string
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $sequence?: number;
}

export interface OrderStats {
  name: string;
  value: number;
}
