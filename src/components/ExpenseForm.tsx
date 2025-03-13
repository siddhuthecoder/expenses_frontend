import React, { useState } from 'react';
import { X } from 'lucide-react';
import { expenseApi } from '../api';
import toast from 'react-hot-toast';

interface ExpenseFormProps {
  eventId: string;
  onClose: () => void;
  onSuccess: () => void;
}

function ExpenseForm({ eventId, onClose, onSuccess }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [spentOn, setSpentOn] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await expenseApi.create({
        eventId,
        description,
        amount: parseFloat(amount),
        spentOn,
      });
      toast.success('Expense added successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">New Expense</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={spentOn}
              onChange={(e) => setSpentOn(e.target.value)}
              className="input"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseForm;