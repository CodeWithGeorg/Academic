import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getClientOrders, getUserSubmissions, subscribeToCollection, getFileDownload } from '../services/appwrite';
import { APPWRITE_CONFIG } from '../constants';
import { Order, Submission } from '../types';
import OrderCard from '../components/OrderCard';

const ClientDashboard: React.FC = () => {
  const { user, role } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'assignments' | 'submissions'>('assignments');

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [assignmentsData, submissionsData] = await Promise.all([
             getClientOrders(user.$id),
             getUserSubmissions(user.$id)
          ]);
          setOrders(assignmentsData);
          setSubmissions(submissionsData);
        } catch (error) {
          console.error("Failed to fetch dashboard data", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Realtime Subscription
    let unsubscribe: () => void;
    try {
        unsubscribe = subscribeToCollection(APPWRITE_CONFIG.ORDERS_COLLECTION_ID, (payload) => {
            if (payload.events.some((event: string) => event.includes('create'))) {
                const newOrder = payload.payload as Order;
                setOrders(prev => [newOrder, ...prev]);
            }
            if (payload.events.some((event: string) => event.includes('update'))) {
                const updatedOrder = payload.payload as Order;
                setOrders(prev => prev.map(o => o.$id === updatedOrder.$id ? updatedOrder : o));
            }
        });
    } catch (e) {
        console.warn("Realtime subscription failed (likely demo mode)");
        unsubscribe = () => {};
    }

    return () => {
        if(unsubscribe) unsubscribe();
    };
  }, [user]);

  // Helper to get assignment title for a submission
  const getAssignmentTitle = (assignmentId: string) => {
      const found = orders.find(o => o.$id === assignmentId);
      return found ? found.title : 'Unknown Assignment';
  };

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600 mt-1">Manage your academic tasks.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 mb-6">
        <button
            onClick={() => setActiveTab('assignments')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'assignments' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
            Available Assignments
        </button>
        <button
            onClick={() => setActiveTab('submissions')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'submissions' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
            My Submissions
        </button>
      </div>

      {activeTab === 'assignments' ? (
          /* Assignments View */
          orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments yet</h3>
              <p className="mt-1 text-sm text-gray-500">Your instructor hasn't posted anything yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {orders.map((order) => (
                <OrderCard key={order.$id} order={order} role={role} />
              ))}
            </div>
          )
      ) : (
          /* Submissions View */
          <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
             {submissions.length === 0 ? (
                 <div className="p-8 text-center text-gray-500">
                     You haven't submitted any work yet.
                 </div>
             ) : (
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {submissions.map((sub) => (
                                <tr key={sub.$id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{getAssignmentTitle(sub.assignmentId)}</div>
                                        <div className="text-xs text-gray-400">ID: {sub.$id.substring(0, 8)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <a 
                                            href={getFileDownload(sub.fileId)}
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-primary hover:text-indigo-900 flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            View Work
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${sub.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' : ''}
                                            ${sub.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                            ${sub.status === 'graded' ? 'bg-blue-100 text-blue-800' : ''}
                                            ${sub.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                        `}>
                                            {sub.status === 'submitted' ? 'Waiting Approval' : sub.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                        {sub.grade || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
             )}
          </div>
      )}
    </div>
  );
};

export default ClientDashboard;