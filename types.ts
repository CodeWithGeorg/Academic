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
  userId: string; // The Admin who created the assignment
  title: string;
  description: string;
  deadline: string;
  fileId?: string;
  status: OrderStatus;
  // Explicitly defining Appwrite document fields to ensure they exist in the type
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $sequence: number;
}

export interface Submission extends Models.Document {
  assignmentId: string;
  studentId: string;
  fileId: string;
  notes?: string;
  submittedAt: string;
  status: 'submitted' | 'approved' | 'rejected' | 'graded';
  grade?: string;
  // Explicit fields
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $sequence: number;
}

export interface Message extends Models.Document {
    senderId: string;
    senderName: string;
    subject: string;
    content: string;
    sentAt: string;
    $id: string;
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    $sequence: number;
}

export interface OrderStats {
  name: string;
  value: number;
}
