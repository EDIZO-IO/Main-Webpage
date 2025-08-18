// src/pages/UpcomingWebinars.tsx
import React, { useEffect, useState } from 'react';

interface Webinar {
  id: number;
  title: string;
  date: string;
  status: 'Coming Soon' | 'Confirmed';
  location: string;
  description: string;
  registrationLink?: string;
}

const UpcomingWebinars: React.FC = () => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/webinars.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch webinars');
        return res.json();
      })
      .then((data: Webinar[]) => {
        // Sort: Confirmed first, then by date
        const sorted = data.sort((a, b) => {
          if (a.status !== b.status) {
            return a.status === 'Confirmed' ? -1 : 1;
          }
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        setWebinars(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading webinars:', err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <section
      className="font-sans min-h-screen relative overflow-hidden flex items-center justify-center p-4 pt-20"
      aria-labelledby="webinars-title"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0"></div>

      <div className="w-full max-w-5xl relative z-10 text-center">
        <h1
          id="webinars-title"
          className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-xl"
        >
          Join Our{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Upcoming Webinars
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto">
          Stay ahead with exclusive insights from industry experts.
        </p>

        {/* Loading State */}
        {loading && (
          <div className="text-slate-400 animate-pulse">
            <p>Loading webinars...</p>
          </div>
        )}

        {/* No Webinars */}
        {!loading && webinars.length === 0 && (
          <p className="text-slate-400 text-lg">No webinars available right now. Check back soon! 🚀</p>
        )}

        {/* Webinar Grid */}
        {!loading && webinars.length > 0 && (
          <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {webinars.map((event) => (
              <li
                key={event.id}
                className="group bg-slate-700/50 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-slate-600/50 hover:shadow-2xl"
              >
                {/* Status + Date */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold shadow-inner ${
                      event.status === 'Coming Soon'
                        ? 'bg-yellow-400 text-yellow-900'
                        : 'bg-green-400 text-green-900'
                    }`}
                  >
                    {event.status}
                  </span>

                  {/* Show date only if Confirmed and valid */}
                  {event.status === 'Confirmed' && (
                    <time
                      dateTime={event.date}
                      className="text-slate-200 text-sm md:text-base font-medium group-hover:text-white transition-colors duration-300"
                    >
                      {formatDate(event.date)}
                    </time>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <h2 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 line-clamp-2">
                    {event.title}
                  </h2>
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold">Location:</span> {event.location}
                  </p>
                  <p className="text-slate-200 text-sm md:text-base leading-relaxed">{event.description}</p>
                </div>

                {/* Registration Button (only for Confirmed events with link) */}
                {event.status === 'Confirmed' && event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Register for ${event.title}`}
                    className="mt-4 inline-block w-full text-center py-3 px-6 rounded-lg text-lg font-bold
                               bg-gradient-to-r from-purple-500 to-pink-500 text-white
                               shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
                  >
                    Register Now
                  </a>
                )}

                {/* Placeholder for Coming Soon */}
                {event.status === 'Coming Soon' && !event.registrationLink && (
                  <div className="mt-4 w-full text-center py-3 px-6 rounded-lg text-lg font-bold text-slate-300 bg-slate-600 cursor-not-allowed">
                    Registration Opening Soon
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default UpcomingWebinars;