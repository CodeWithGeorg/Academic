import React, { useState } from 'react';
import { Order, Submission } from '../types';
import { OrderStatus, UserRole } from '../constants';
import { getFileDownload, uploadFile, submitAssignment } from '../services/appwrite';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

interface OrderCardProps {
  order: Order;
  role: UserRole | null;
  existingSubmission?: Submission; // New Prop
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
  onSubmissionSuccess?: (submission: Submission) => void;
}

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [OrderStatus.REVISION]: 'bg-orange-100 text-orange-800',
  [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [OrderStatus.APPROVED]: 'bg-purple-100 text-purple-800',
};

const OrderCard: React.FC<OrderCardProps> = ({ order, role, existingSubmission, onStatusChange, onSubmissionSuccess }) => {
  const { user } = useAuth();
  const dateStr = new Date(order.$createdAt).toLocaleDateString();
  const deadlineStr = new Date(order.deadline).toLocaleDateString();
  
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [localSubmitted, setLocalSubmitted] = useState(false); // To update UI immediately before refresh

  // Logic to determine if assignment is closed by Admin
  const isAssignmentClosed = order.status === OrderStatus.COMPLETED || order.status === OrderStatus.APPROVED;
  
  // Logic to check if user has already submitted (either via prop or local state)
  const hasSubmitted = !!existingSubmission || localSubmitted;

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!user || !submissionFile) return;
    
    setSubmitting(true);
    try {
        const file = await uploadFile(submissionFile);
        const result = await submitAssignment(order.$id, user.$id, file.$id);
        
        setLocalSubmitted(true);
        setSubmissionFile(null);
        
        // Notify parent to update UI instantly
        if (onSubmissionSuccess && result) {
            onSubmissionSuccess(result as unknown as Submission);
        }
    } catch (err) {
        console.error("Submission error", err);
        alert("Failed to submit work");
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="pr-4">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{order.title}</h3>
          <p className="text-sm text-gray-500">Posted on {dateStr}</p>
        </div>
        <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="space-y-3 mb-6 flex-grow">
        <p className="text-gray-700 text-sm leading-relaxed">{order.description}</p>
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
            <span className="font-medium mr-2">Deadline:</span> {deadlineStr}
        </div>
        
        {order.fileId && (
            <div className="mt-2">
                 <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Attachment</h4>
                 <a 
                    href={getFileDownload(order.fileId)}
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:underline"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Instructions
                </a>
            </div>
        )}
      </div>

      {/* Admin Controls */}
      {role === UserRole.ADMIN && onStatusChange && (
        <div className="pt-4 border-t border-gray-100 mt-auto">
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Assignment Status</label>
            <select
                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 border"
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

      {/* Client Submission Area */}
      {role === UserRole.CLIENT && (
        <div className="pt-4 border-t border-gray-100 mt-auto">
            <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Submit Your Work</h4>
            
            {/* Logic Branch: Closed vs Submitted vs Available */}
            {isAssignmentClosed ? (
                <div className="text-gray-500 text-sm font-medium flex items-center bg-gray-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Assignment Closed
                </div>
            ) : hasSubmitted ? (
                 <div className="text-green-600 text-sm font-medium flex flex-col items-start bg-green-50 p-3 rounded-lg border border-green-100">
                    <div className="flex items-center mb-1">
                         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                         <span>You have submitted this work.</span>
                    </div>
                    {existingSubmission?.grade && (
                        <div className="text-xs text-green-800 mt-1 font-bold pl-7">
                            Grade: {existingSubmission.grade}
                        </div>
                    )}
                     <div className="text-xs text-green-600 pl-7 opacity-75">
                         Status: {existingSubmission?.status?.toUpperCase() || 'SUBMITTED'}
                     </div>
                </div>
            ) : (
                <form onSubmit={handleSubmitWork} className="space-y-2">
                    <input 
                        type="file" 
                        className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-xs file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
                        onChange={(e) => setSubmissionFile(e.target.files ? e.target.files[0] : null)}
                        required
                    />
                    <Button type="submit" variant="primary" className="w-full text-sm py-1.5" disabled={!submissionFile} isLoading={submitting}>
                        Upload & Submit
                    </Button>
                </form>
            )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;