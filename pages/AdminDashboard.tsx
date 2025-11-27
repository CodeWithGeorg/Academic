import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus, getFileDownload, getAllSubmissions, updateSubmissionStatus, subscribeToCollection, getAllUsers } from '../services/appwrite';
import { Order, Submission, UserProfile } from '../types';
import { OrderStatus, APPWRITE_CONFIG, UserRole } from '../constants';
import { useAuth } from '../context/AuthContext';
import OrderCard from '../components/OrderCard';
import Input from '../components/Input';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { role } = useAuth();
  
  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'assignments' | 'submissions' | 'students'>('assignments');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const fetchData = async () => {
    try {
      const [ordersData, submissionsData, usersData] = await Promise.all([
        getAllOrders(),
        getAllSubmissions(),
        getAllUsers()
      ]);
      setOrders(ordersData);
      setSubmissions(submissionsData);
      setUsers(usersData);
    } catch (error) {
      console.error("Admin fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // 1. Subscribe to Assignments (Orders)
    const unsubOrders = subscribeToCollection(APPWRITE_CONFIG.ORDERS_COLLECTION_ID, (payload) => {
         if (payload.events.some((e: string) => e.includes('create'))) {
             setOrders(prev => [payload.payload, ...prev]);
         } else if (payload.events.some((e: string) => e.includes('update'))) {
             setOrders(prev => prev.map(o => o.$id === payload.payload.$id ? payload.payload : o));
         }
    });

    // 2. Subscribe to Submissions
    const unsubSubmissions = subscribeToCollection(APPWRITE_CONFIG.SUBMISSIONS_COLLECTION_ID, (payload) => {
         if (payload.events.some((e: string) => e.includes('create'))) {
             setSubmissions(prev => [payload.payload, ...prev]);
         } else if (payload.events.some((e: string) => e.includes('update'))) {
             setSubmissions(prev => prev.map(s => s.$id === payload.payload.$id ? payload.payload : s));
         }
    });

    // 3. Subscribe to Users
    const unsubUsers = subscribeToCollection(APPWRITE_CONFIG.USERS_COLLECTION_ID, (payload) => {
         if (payload.events.some((e: string) => e.includes('create'))) {
             setUsers(prev => [payload.payload, ...prev]);
         }
    });

    return () => {
        unsubOrders();
        unsubSubmissions();
        unsubUsers();
    }
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setOrders(prev => prev.map(o => o.$id === orderId ? { ...o, status: newStatus } : o));
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error("Update failed", error);
      fetchData(); 
    }
  };

  const handleGradeSubmission = async (subId: string, newStatus: string, grade: string) => {
      try {
          await updateSubmissionStatus(subId, newStatus, grade);
          // State updates automatically via Realtime, but we can optimistically update too
          setSubmissions(prev => prev.map(s => s.$id === subId ? { ...s, status: newStatus as any, grade } : s));
      } catch (e) {
          console.error("Grading failed", e);
      }
  };

  // --- Filtering Logic ---
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Helper to find Assignment Title for a Submission
  const getAssignmentTitle = (assignmentId: string) => {
    const found = orders.find(o => o.$id === assignmentId);
    return found ? found.title : 'Unknown Assignment';
  };

  // Helper to find Student Name
  const getStudentName = (studentId: string) => {
      const found = users.find(u => u.$id === studentId);
      return found ? found.name : 'Unknown User';
  };

  // --- Stats Logic ---
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  const COLORS = ['#fbbf24', '#3b82f6', '#f97316', '#22c55e', '#a855f7'];
  
  const statusBadgeStyles: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [OrderStatus.REVISION]: 'bg-orange-100 text-orange-800',
    [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [OrderStatus.APPROVED]: 'bg-purple-100 text-purple-800',
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage assignments and review student work.</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 mb-6 overflow-x-auto">
        <button
            onClick={() => setActiveTab('assignments')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'assignments' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
            Manage Assignments
        </button>
        <button
            onClick={() => setActiveTab('submissions')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'submissions' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
            Review Submissions 
            {submissions.filter(s => s.status === 'submitted').length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {submissions.filter(s => s.status === 'submitted').length}
                </span>
            )}
        </button>
        <button
            onClick={() => setActiveTab('students')}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'students' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
            Students ({users.filter(u => u.role === UserRole.CLIENT).length})
        </button>
      </div>

      {activeTab === 'assignments' && (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                        <span className="text-4xl font-bold text-primary">{orders.length}</span>
                        <span className="text-gray-500 text-sm mt-1 uppercase tracking-wide">Total Assignments</span>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                        <span className="text-4xl font-bold text-yellow-500">
                            {orders.filter(o => o.status === OrderStatus.PENDING).length}
                        </span>
                        <span className="text-gray-500 text-sm mt-1 uppercase tracking-wide">Pending</span>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                        <span className="text-4xl font-bold text-green-500">
                            {orders.filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.APPROVED).length}
                        </span>
                        <span className="text-gray-500 text-sm mt-1 uppercase tracking-wide">Finished</span>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                        <span className="text-4xl font-bold text-blue-500">
                            {submissions.length}
                        </span>
                        <span className="text-gray-500 text-sm mt-1 uppercase tracking-wide">Total Submissions</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-64 md:h-auto">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">Assignment Status Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center">
                <div className="w-full md:w-1/3">
                    <Input 
                        placeholder="Search Title..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="!mb-0" 
                    />
                </div>
                <div className="w-full md:w-auto flex-1 flex items-center gap-2">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Filter:</span>
                    <select
                        className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md border"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
                    >
                        <option value="all">All</option>
                        {Object.values(OrderStatus).map((status) => (
                            <option key={status} value={status}>
                                {status.replace('-', ' ').toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
                 <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('table')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            viewMode === 'table' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        Table
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        Grid
                    </button>
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No assignments found matching your criteria.</p>
                </div>
            ) : (
                <>
                    {viewMode === 'grid' ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredOrders.map((order) => (
                                <OrderCard 
                                    key={order.$id} 
                                    order={order} 
                                    role={role} 
                                    onStatusChange={handleStatusChange} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachment</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredOrders.map((order) => (
                                            <tr key={order.$id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{order.title}</div>
                                                    <div className="text-xs text-gray-400">Created: {new Date(order.$createdAt).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(order.deadline).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${statusBadgeStyles[order.status]}`}
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.$id, e.target.value as OrderStatus)}
                                                    >
                                                        {Object.values(OrderStatus).map((status) => (
                                                            <option key={status} value={status} className="bg-white text-gray-900">
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {order.fileId ? (
                                                        <a 
                                                            href={getFileDownload(order.fileId)}
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="text-primary hover:text-indigo-900 flex items-center"
                                                        >
                                                            Download
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400 italic">None</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
          </>
      )}

      {activeTab === 'submissions' && (
          /* --- Submissions Tab --- */
          <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
             {submissions.length === 0 ? (
                 <div className="p-10 text-center text-gray-500">
                     No submissions have been received yet.
                 </div>
             ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions / Grade</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {submissions.map((sub) => (
                                <tr key={sub.$id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{getStudentName(sub.studentId)}</div>
                                        <div className="text-xs text-gray-400">{sub.studentId.substring(0,8)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getAssignmentTitle(sub.assignmentId)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <a 
                                            href={getFileDownload(sub.fileId)}
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-primary font-medium hover:underline"
                                        >
                                            View Work
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center space-x-2">
                                            <select 
                                                className={`border rounded px-2 py-1 text-xs font-medium ${
                                                    sub.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                                    sub.status === 'graded' ? 'bg-blue-100 text-blue-800' :
                                                    sub.status === 'rejected' ? 'bg-red-100 text-red-800' : ''
                                                }`}
                                                value={sub.status}
                                                onChange={(e) => handleGradeSubmission(sub.$id, e.target.value, sub.grade || '')}
                                            >
                                                <option value="submitted">Submitted</option>
                                                <option value="graded">Graded</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                            <input 
                                                type="text" 
                                                placeholder="Grade" 
                                                className="border rounded px-2 py-1 text-xs w-20"
                                                value={sub.grade || ''}
                                                onChange={(e) => {
                                                    // Local update for input, commit on blur
                                                    const val = e.target.value;
                                                    setSubmissions(prev => prev.map(s => s.$id === sub.$id ? {...s, grade: val} : s));
                                                }}
                                                onBlur={(e) => handleGradeSubmission(sub.$id, sub.status, e.target.value)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             )}
          </div>
      )}

      {activeTab === 'students' && (
          /* --- Students Tab --- */
          <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined At</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((u) => (
                              <tr key={u.$id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                      <div className="text-xs text-gray-400">{u.$id}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {u.email}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                      }`}>
                                          {u.role.toUpperCase()}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {new Date(u.createdAt).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {submissions.filter(s => s.studentId === u.$id).length}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;