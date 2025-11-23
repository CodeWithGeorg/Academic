import React from 'react';
import { Order, UserProfile } from '../types';
import { OrderStatus, UserRole } from '../constants';
import { getFileDownload } from '../services/appwrite';
import Button from './Button';

interface OrderCardProps {
  order: Order;
  role: UserRole | null;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
}

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [OrderStatus.REVISION]: 'bg-orange-100 text-orange-800',
  [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [OrderStatus.APPROVED]: 'bg-purple-100 text-purple-800',
};

const OrderCard: React.FC<OrderCardProps> = ({ order, role, onStatusChange }) => {
  const dateStr = new Date(order.$createdAt).toLocaleDateString();
  const deadlineStr = new Date(order.deadline).toLocaleDateString();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{order.title}</h3>
          <p className="text-sm text-gray-500">Ordered on {dateStr}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <p className="text-gray-700 text-sm leading-relaxed">{order.description}</p>
        <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Deadline:</span> {deadlineStr}
        </div>
        {order.fileId && (
            <a 
                href={getFileDownload(order.fileId)}
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center text-sm text-primary hover:underline mt-2"
            >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Attachment
            </a>
        )}
      </div>

      {role === UserRole.ADMIN && onStatusChange && (
        <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Update Status</label>
            <select
                className="w-full sm:w-auto text-sm border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 border"
                value={order.status}
                onChange={(e) => onStatusChange(order.$id, e.target.value as OrderStatus)}
            >
                {Object.values(OrderStatus).map((status) => (
                    <option key={status} value={status}>
                        {status.replace('-', ' ').toUpperCase()}
                    </option>
                ))}
            </select>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
