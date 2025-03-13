import React from 'react';
import { Receipt } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Receipt size={24} className="text-primary-600" />
            <span className="text-xl font-bold text-secondary-900">
              ExpenseTracker
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;