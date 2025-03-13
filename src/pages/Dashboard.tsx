import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { DollarSign, Calendar, TrendingUp, Users, Calendar as CalendarIcon } from 'lucide-react';
import { eventApi, expenseApi } from '../api';
import { Event, Expense } from '../types';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [yearlyTotal, setYearlyTotal] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsResponse, expensesResponse] = await Promise.all([
        eventApi.getAll(),
        expenseApi.getByDateRange(
          new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(),
          new Date().toISOString()
        ),
      ]);

      setEvents(eventsResponse.data);
      setExpenses(expensesResponse.data.expenses);

      // Calculate monthly and yearly totals
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      const yearStart = startOfYear(now);
      const yearEnd = endOfYear(now);

      const monthlyExpenses = expensesResponse.data.expenses.filter((expense: Expense) => {
        const expenseDate = new Date(expense.spentOn);
        return expenseDate >= monthStart && expenseDate <= monthEnd;
      });

      const yearlyExpenses = expensesResponse.data.expenses.filter((expense: Expense) => {
        const expenseDate = new Date(expense.spentOn);
        return expenseDate >= yearStart && expenseDate <= yearEnd;
      });

      setMonthlyTotal(monthlyExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0));
      setYearlyTotal(yearlyExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const expensesByEvent = expenses.reduce((acc, expense) => {
    const eventId = expense.eventId._id;
    if (!acc[eventId]) {
      acc[eventId] = {
        name: expense.eventId.title,
        value: 0,
      };
    }
    acc[eventId].value += expense.amount;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);

  const pieData = Object.values(expensesByEvent);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">Dashboard</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-400">Overview of your events and expenses</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Events</p>
              <p className="text-2xl font-semibold text-gray-100 mt-1">
                {events.length}
              </p>
            </div>
            <div className="p-3 bg-primary-500/10 rounded-full">
              <Calendar className="w-6 h-6 text-primary-500" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Expenses</p>
              <p className="text-2xl font-semibold text-gray-100 mt-1">
                ₹{expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-3 bg-primary-500/10 rounded-full">
              <DollarSign className="w-6 h-6 text-primary-500" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">This Month</p>
              <p className="text-2xl font-semibold text-gray-100 mt-1">
                ₹{monthlyTotal.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-3 bg-primary-500/10 rounded-full">
              <CalendarIcon className="w-6 h-6 text-primary-500" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">This Year</p>
              <p className="text-2xl font-semibold text-gray-100 mt-1">
                ₹{yearlyTotal.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-3 bg-primary-500/10 rounded-full">
              <TrendingUp className="w-6 h-6 text-primary-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Expenses by Event</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Expense Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Recent Events</h2>
        <div className="space-y-4">
          {events.slice(0, 5).map((event) => (
            <div
              key={event._id}
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <div>
                <h3 className="font-medium text-gray-100">{event.title}</h3>
                <p className="text-sm text-gray-400">
                  {format(new Date(event.date), 'MMMM d, yyyy h:mm a')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-gray-100">
                  ₹{expenses
                    .filter((expense) => expense.eventId._id === event._id)
                    .reduce((sum, expense) => sum + expense.amount, 0)
                    .toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;