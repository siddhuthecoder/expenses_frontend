import React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Event } from '../types';
import { eventApi } from '../api';
import toast from 'react-hot-toast';

interface EventListProps {
  events: Event[];
  selected: Event | null;
  onSelect: (event: Event) => void;
  onDelete: () => void;
}

function EventList({ events, selected, onSelect, onDelete }: EventListProps) {
  const handleDelete = async (event: Event) => {
    try {
      await eventApi.delete(event._id);
      toast.success('Event deleted successfully');
      onDelete();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  return (
    <div className="space-y-2">
      {events.map((event) => (
        <div
          key={event._id}
          className={`p-4 rounded-lg cursor-pointer transition-all duration-300 flex justify-between items-center ${
            selected?._id === event._id
              ? 'bg-primary-50 border-primary-200'
              : 'hover:bg-gray-50 border-transparent'
          } border`}
          onClick={() => onSelect(event)}
        >
          <div>
            <h3 className="font-medium text-secondary-900">{event.title}</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(event.date), 'MMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(event);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors duration-300"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      {events.length === 0 && (
        <p className="text-gray-500 text-center py-4">No events found</p>
      )}
    </div>
  );
}

export default EventList;