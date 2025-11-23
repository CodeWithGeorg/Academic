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
}

export interface OrderStats {
  name: string;
  value: number;
}
