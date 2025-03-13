import React, { useState } from 'react';
import { X, DollarSign, Calendar, Clock, Pencil, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Event, Expense } from '../types';
import { expenseApi } from '../api';
import toast from 'react-hot-toast';

interface EventExpensesModalProps {
  event: Event;
  expenses: Expense[];
  onClose: () => void;
  onExpenseUpdate: () => void;
}

function EventExpensesModal({ event, expenses, onClose, onExpenseUpdate }: EventExpensesModalProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    spentOn: format(new Date(), 'yyyy-MM-dd'),
  });

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      spentOn: format(new Date(expense.spentOn), 'yyyy-MM-dd'),
    });
  };

  const handleDelete = async (expenseId: string) => {
    try {
      await expenseApi.delete(expenseId);
      toast.success('Expense deleted successfully');
      onExpenseUpdate();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const expenseData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        spentOn: new Date(formData.spentOn).toISOString(),
        eventId: {
          _id: event._id,
          title: event.title,
          description: event.description,
          date: event.date,
          createdAt: event.createdAt
        }
      };

      if (editingExpense) {
        await expenseApi.update(editingExpense._id, expenseData);
        toast.success('Expense updated successfully');
      } else {
        await expenseApi.create(expenseData);
        toast.success('Expense added successfully');
      }

      setFormData({
        description: '',
        amount: '',
        spentOn: format(new Date(), 'yyyy-MM-dd'),
      });
      setEditingExpense(null);
      onExpenseUpdate();
    } catch (error) {
      console.error('Failed to save expense:', error);
      toast.error('Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-100">{event.title}</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar size={16} />
                <span className="text-sm">
                  {format(new Date(event.date), 'MMMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock size={16} />
                <span className="text-sm">
                  {format(new Date(event.date), 'h:mm a')}
                </span>
              </div>
            </div>
            {event.description && (
              <p className="text-gray-400 mt-2 text-sm">{event.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="text-primary-500" size={20} />
              <span className="font-medium text-gray-100">Total Expenses</span>
            </div>
            <span className="text-xl sm:text-2xl font-semibold text-gray-100">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-700/30 p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter expense description"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter amount"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.spentOn}
                onChange={(e) => setFormData({ ...formData, spentOn: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              {editingExpense && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingExpense(null);
                    setFormData({
                      description: '',
                      amount: '',
                      spentOn: format(new Date(), 'yyyy-MM-dd'),
                    });
                  }}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-gray-100 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <Plus size={16} />
                )}
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No expenses recorded for this event
              </div>
            ) : (
              expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex justify-between items-start p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors group"
                >
                  <div className="flex-1">
                    <p className="text-gray-100 font-medium">{expense.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-400">
                        {format(new Date(expense.spentOn), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-gray-100 font-medium">
                      ₹{expense.amount.toLocaleString('en-IN')}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-gray-400 hover:text-primary-500 transition-colors p-1 rounded-full hover:bg-gray-700"
                        title="Edit Expense"
                      >
                        <Pencil size={14} />
                      </button>
                      {showDeleteConfirm === expense._id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDelete(expense._id)}
                            className="text-red-500 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-700"
                            title="Confirm Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="text-gray-400 hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-700"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(expense._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-700"
                          title="Delete Expense"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventExpensesModal; 