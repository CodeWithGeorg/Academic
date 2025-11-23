import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../services/appwrite';
import { Order } from '../types';
import { OrderStatus, UserRole } from '../constants';
import { useAuth } from '../context/AuthContext';
import OrderCard from '../components/OrderCard';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { role } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Prepare data for chart
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  const COLORS = ['#fbbf24', '#3b82f6', '#f97316', '#22c55e', '#a855f7']; // Matching OrderCard colors roughly

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage all orders and system status.</p>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
         {/* Summary Cards */}
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                <span className="text-4xl font-bold text-primary">{orders.length}</span>
                <span className="text-gray-500 text-sm mt-1">Total Orders</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                <span className="text-4xl font-bold text-yellow-500">
                    {orders.filter(o => o.status === OrderStatus.PENDING).length}
                </span>
                <span className="text-gray-500 text-sm mt-1">Pending</span>
            </div>
         </div>

         {/* Chart */}
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-64">
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

      {/* Orders Grid */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">All Orders</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
            <OrderCard 
                key={order.$id} 
                order={order} 
                role={role} 
                onStatusChange={handleStatusChange} 
            />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
