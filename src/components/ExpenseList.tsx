import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Expense } from '../types';
import { expenseApi } from '../api';
import toast from 'react-hot-toast';

interface ExpenseListProps {
  eventId: string;
}

function ExpenseList({ eventId }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadExpenses();
  }, [eventId]);

  const loadExpenses = async () => {
    try {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      const { data } = await expenseApi.getByDateRange(
        start.toISOString(),
        end.toISOString()
      );
      setExpenses(data.expenses.filter((e) => e.eventId === eventId));
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    }
  };

  const handleDelete = async (expense: Expense) => {
    try {
      await expenseApi.delete(expense._id);
      toast.success('Expense deleted successfully');
      loadExpenses();
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Description</th>
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-right py-2 px-4">Amount</th>
              <th className="text-right py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id} className="border-b">
                <td className="py-2 px-4">{expense.description}</td>
                <td className="py-2 px-4">
                  {format(new Date(expense.spentOn), 'MMM d, yyyy')}
                </td>
                <td className="py-2 px-4 text-right">
                  ${expense.amount.toFixed(2)}
                </td>
                <td className="py-2 px-4 text-right">
                  <button
                    onClick={() => handleDelete(expense)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t font-semibold">
              <td className="py-2 px-4">Total</td>
              <td></td>
              <td className="py-2 px-4 text-right">${total.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      {expenses.length === 0 && (
        <p className="text-gray-500 text-center py-4">No expenses found</p>
      )}
    </div>
  );
}

export default ExpenseList;