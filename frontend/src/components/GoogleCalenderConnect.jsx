// src/components/GoogleCalenderConnect.tsx
import React from 'react';
import { useGoogleEvents } from './hooks/useGoogleEvents';
import { Calendar, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

const GoogleCalendarConnect: Function = () => {
  const { 
    events,
    loading,
    error,
    refreshEvents
  } = useGoogleEvents();

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
        <RefreshCw className="w-4 h-4 animate-spin text-gray-600" />
        <span className="text-sm text-gray-700">Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 p-4 bg-red-50 text-red-600 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{error}</span>
        </div>
        <button
          onClick={refreshEvents}
          className="text-xs underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">{events.length} events loaded</span>
      </div>
      <button
        onClick={refreshEvents}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        title="Refresh events"
        aria-label="Refresh events"
      >
        <RefreshCw className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};

export default GoogleCalendarConnect;
