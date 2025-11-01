// src/components/EventDebug.tsx
import React from 'react';
import { useGoogleEvents } from './hooks/useGoogleEvents';
import { X, RefreshCw, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const EventDebug: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const { events, loading, error, getActiveEvent, refreshEvents } = useGoogleEvents();
  const activeEvent = getActiveEvent();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
        title="Show Event Debug"
      >
        <Calendar className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-w-md w-full max-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <h3 className="font-bold text-lg">Event Debug Panel</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshEvents}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="Refresh Events"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="Close Debug Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            <div>
              <p className="font-semibold text-blue-900">Loading Events...</p>
              <p className="text-sm text-blue-600">Fetching from Google Sheets</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={refreshEvents}
                className="mt-2 text-xs text-red-700 underline hover:no-underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Success State */}
        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">Total Events</p>
                <p className="text-2xl font-bold text-blue-900">{events.length}</p>
              </div>
              <div className={`p-3 rounded-lg ${activeEvent ? 'bg-gradient-to-br from-green-50 to-green-100' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
                <p className={`text-xs font-medium ${activeEvent ? 'text-green-600' : 'text-gray-600'}`}>Active Today</p>
                <p className={`text-2xl font-bold ${activeEvent ? 'text-green-900' : 'text-gray-400'}`}>
                  {activeEvent ? '1' : '0'}
                </p>
              </div>
            </div>

            {/* Active Event */}
            {activeEvent ? (
              <div className="mb-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="font-bold text-green-900">Active Event</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{activeEvent.emoji}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{activeEvent.summary}</p>
                      {activeEvent.description && (
                        <p className="text-xs text-gray-600">{activeEvent.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/50 p-2 rounded">
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium text-gray-900 capitalize">{activeEvent.eventType}</p>
                    </div>
                    <div className="bg-white/50 p-2 rounded">
                      <p className="text-gray-500">Animation</p>
                      <p className="font-medium text-gray-900">{activeEvent.animation}</p>
                    </div>
                  </div>
                  <div className="bg-white/50 p-2 rounded text-xs">
                    <p className="text-gray-500 mb-1">Colors</p>
                    <div className="flex gap-1">
                      {activeEvent.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                  {activeEvent.decorElements.length > 0 && (
                    <div className="bg-white/50 p-2 rounded text-xs">
                      <p className="text-gray-500 mb-1">Decorations</p>
                      <div className="flex flex-wrap gap-1">
                        {activeEvent.decorElements.map((decor, idx) => (
                          <span key={idx} className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                            {decor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="bg-white/50 p-2 rounded text-xs">
                    <p className="text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">
                      {new Date(activeEvent.start).toLocaleDateString()} - {new Date(activeEvent.end).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <p className="text-gray-500 text-sm">No active events today</p>
                <p className="text-xs text-gray-400 mt-1">
                  {events.length > 0 ? 'Check upcoming events below' : 'Add events to your Google Sheet'}
                </p>
              </div>
            )}

            {/* All Events */}
            {events.length > 0 && (
              <div>
                <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  All Events ({events.length})
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {events.map((event) => {
                    const isActive = activeEvent?.id === event.id;
                    return (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg border transition-all ${
                          isActive
                            ? 'bg-green-50 border-green-300'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xl">{event.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm ${isActive ? 'text-green-900' : 'text-gray-900'}`}>
                              {event.summary}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(event.start).toLocaleDateString()} - {new Date(event.end).toLocaleDateString()}
                            </p>
                            <div className="flex gap-1 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                event.eventType === 'company'
                                  ? 'bg-blue-100 text-blue-700'
                                  : event.eventType === 'festival'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}>
                                {event.eventType}
                              </span>
                            </div>
                          </div>
                          {isActive && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {events.length === 0 && !loading && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No Events Found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Add events to your Google Sheet to see them here
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-xl">
        <p className="text-xs text-gray-500 text-center">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default EventDebug;
