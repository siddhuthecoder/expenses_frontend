import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { Plus, Pencil, Trash2, DollarSign, Calendar, Clock, List, Search, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { eventApi, expenseApi } from '../api';
import { Event, Expense } from '../types';
import EventForm from '../components/EventForm';
import EventExpensesModal from '../components/EventExpensesModal';
import toast from 'react-hot-toast';

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [expenses, setExpenses] = useState<Record<string, Expense[]>>({});
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showExpensesModal, setShowExpensesModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [yearlyTotal, setYearlyTotal] = useState(0);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data: eventsData } = await eventApi.getAll();
      setEvents(eventsData);
      
      // Load all expenses for the last year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      const { data: expensesData } = await expenseApi.getByDateRange(
        oneYearAgo.toISOString(),
        new Date().toISOString()
      );

      // Group expenses by event
      const expensesMap: Record<string, Expense[]> = {};
      const totalsMap: Record<string, number> = {};
      
      expensesData.expenses.forEach((expense: Expense) => {
        const eventId = expense.eventId._id;
        if (!expensesMap[eventId]) {
          expensesMap[eventId] = [];
        }
        expensesMap[eventId].push(expense);
      });

      // Calculate totals for each event
      Object.entries(expensesMap).forEach(([eventId, eventExpenses]) => {
        totalsMap[eventId] = eventExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      });

      // Calculate monthly and yearly totals
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      const yearStart = startOfYear(now);
      const yearEnd = endOfYear(now);

      const monthlyExpenses = expensesData.expenses.filter(expense => {
        const expenseDate = new Date(expense.spentOn);
        return expenseDate >= monthStart && expenseDate <= monthEnd;
      });

      const yearlyExpenses = expensesData.expenses.filter(expense => {
        const expenseDate = new Date(expense.spentOn);
        return expenseDate >= yearStart && expenseDate <= yearEnd;
      });

      setMonthlyTotal(monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0));
      setYearlyTotal(yearlyExpenses.reduce((sum, expense) => sum + expense.amount, 0));
      
      setExpenses(expensesMap);
      setTotals(totalsMap);
    } catch (error) {
      console.error('Failed to load events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (event: Event) => {
    try {
      await eventApi.delete(event._id);
      toast.success('Event deleted successfully');
      loadEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
    }
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">Events</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-400">Manage your events and track expenses</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              setSelectedEvent(null);
              setShowEventForm(true);
            }}
            className="btn btn-primary flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors w-full sm:w-auto"
          >
            <Plus size={20} />
            New Event
          </button>
        </div>
      </div>

      {/* Expense Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredEvents.map((event) => (
          <div 
            key={event._id} 
            className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-primary-500/50"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-100">{event.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEventForm(true);
                  }}
                  className="text-gray-400 hover:text-primary-500 transition-colors p-1.5 rounded-full hover:bg-gray-700"
                  title="Edit Event"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(event)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-gray-700"
                  title="Delete Event"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            {event.description && (
              <p className="text-gray-400 mb-4 line-clamp-2 text-sm">{event.description}</p>
            )}
            
            <div className="space-y-2 sm:space-y-3">
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
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <DollarSign size={16} />
                  <span className="text-sm">
                    Total: ₹{totals[event._id]?.toLocaleString('en-IN') || '0'}
                  </span>
                </div>
                {expenses[event._id]?.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowExpensesModal(true);
                    }}
                    className="text-sm text-primary-500 hover:text-primary-400 flex items-center gap-1 px-3 py-1 rounded-full bg-primary-500/10 hover:bg-primary-500/20 transition-colors"
                  >
                    <List size={14} />
                    View All
                  </button>
                )}
              </div>
            </div>

            {expenses[event._id]?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Expenses</h4>
                <div className="space-y-2">
                  {expenses[event._id].slice(0, 3).map((expense) => (
                    <div key={expense._id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 truncate mr-4">{expense.description}</span>
                      <span className="text-gray-300 whitespace-nowrap">₹{expense.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  {expenses[event._id].length > 3 && (
                    <p className="text-sm text-gray-500">
                      +{expenses[event._id].length - 3} more expenses
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No events found</p>
        </div>
      )}

      {showEventForm && (
        <EventForm
          event={selectedEvent}
          onClose={() => {
            setShowEventForm(false);
            setSelectedEvent(null);
          }}
          onSuccess={() => {
            loadEvents();
            setShowEventForm(false);
            setSelectedEvent(null);
          }}
        />
      )}

      {showExpensesModal && selectedEvent && (
        <EventExpensesModal
          event={selectedEvent}
          expenses={expenses[selectedEvent._id] || []}
          onClose={() => {
            setShowExpensesModal(false);
            setSelectedEvent(null);
          }}
          onExpenseUpdate={loadEvents}
        />
      )}
    </div>
  );
}

export default Events;