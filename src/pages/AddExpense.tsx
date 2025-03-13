import React, { useState, useEffect } from 'react';
import { eventApi, expenseApi } from '../api';
import { Event } from '../types';
import toast from 'react-hot-toast';

function AddExpense() {
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState({
    eventId: '',
    description: '',
    amount: '',
    spentOn: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data } = await eventApi.getAll();
      setEvents(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, eventId: data[0]._id }));
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      toast.error('Failed to load events');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await expenseApi.create({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      toast.success('Expense added successfully');
      setFormData({
        eventId: formData.eventId,
        description: '',
        amount: '',
        spentOn: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Failed to add expense:', error);
      toast.error('Failed to add expense');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add Expense</h1>
      <div className="bg-gray-800 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Event</label>
            <select
              value={formData.eventId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, eventId: e.target.value }))
              }
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
              required
            >
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={formData.spentOn}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, spentOn: e.target.value }))
              }
              className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;