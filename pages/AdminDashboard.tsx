import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus, getFileDownload } from '../services/appwrite';
import { Order } from '../types';
import { OrderStatus, UserRole } from '../constants';
import { useAuth } from '../context/AuthContext';
import OrderCard from '../components/OrderCard';
import Input from '../components/Input';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { role } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Admin fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Optimistic update
      setOrders(prev => prev.map(o => o.$id === orderId ? { ...o, status: newStatus } : o));
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error("Update failed", error);
      fetchOrders(); // Revert on failure
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.userId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Stats Logic
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
            <p className="text-gray-600 mt-1">Manage orders, update statuses, and track progress.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'table' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
                Table View
            </button>
            <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
                Grid View
            </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                <span className="text-4xl font-bold text-primary">{orders.length}</span>
                <span className="text-gray-500 text-sm mt-1 uppercase tracking-wide">Total Orders</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                <span className="text-4xl font-bold text-yellow-500">
                    {orders.filter(o => o.status === OrderStatus.PENDING).length}
                </span>
                <span className="text-gray-500 text-sm mt-1 uppercase tracking-wide">Pending Action</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                <span className="text-4xl font-bold text-green-500">
                    {orders.filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.APPROVED).length}
                </span>
                <span className="text-gray-500 text-sm mt-1 uppercase tracking-wide">Completed</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                <span className="text-4xl font-bold text-blue-500">
                    {orders.filter(o => o.status === OrderStatus.IN_PROGRESS).length}
                </span>
                <span className="text-gray-500 text-sm mt-1 uppercase tracking-wide">In Progress</span>
            </div>
         </div>

         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-64 md:h-auto">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">Order Status Distribution</h3>
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
                placeholder="Search by Title or User ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="!mb-0" // Override mb from component
            />
         </div>
         <div className="w-full md:w-auto flex-1 flex items-center gap-2">
            <span className="text-sm text-gray-500 whitespace-nowrap">Filter Status:</span>
            <select
                className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md border"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
            >
                <option value="all">All Statuses</option>
                {Object.values(OrderStatus).map((status) => (
                    <option key={status} value={status}>
                        {status.replace('-', ' ').toUpperCase()}
                    </option>
                ))}
            </select>
         </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No orders found matching your criteria.</p>
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
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Deadline</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order.$id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{order.title}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-xs">{order.description}</div>
                                            <div className="text-xs text-gray-400 mt-1">ID: {order.$id.substring(0, 8)}...</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{new Date(order.$createdAt).toLocaleDateString()}</div>
                                            <div className="text-xs text-red-500">Due: {new Date(order.deadline).toLocaleDateString()}</div>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex flex-col gap-2">
                                            {order.fileId ? (
                                                <a 
                                                    href={getFileDownload(order.fileId)}
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="text-primary hover:text-indigo-900 flex items-center"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                    Download
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">No file</span>
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
    </div>
  );
};

export default AdminDashboard;