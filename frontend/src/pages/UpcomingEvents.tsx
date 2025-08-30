import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Loader2 } from 'lucide-react';

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
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);

  useEffect(() => {
    fetch('/webinars.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch webinars');
        return res.json();
      })
      .then((data: Webinar[]) => {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: 'spring',
        stiffness: 120,
        damping: 15,
      },
    }),
  };

  return (
    <section
      className="font-sans min-h-screen relative overflow-hidden flex items-center justify-center p-4 pt-20"
      aria-labelledby="webinars-title"
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-0"
        style={{ y: backgroundY }}
      ></motion.div>

      <div className="w-full max-w-5xl relative z-10 text-center">
        <motion.h1
          id="webinars-title"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-xl"
        >
          Join Our{' '}
          <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Upcoming Webinars
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light"
        >
          Stay ahead with exclusive insights from industry experts.
        </motion.p>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 flex items-center justify-center gap-3"
          >
            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            <p>Loading webinars...</p>
          </motion.div>
        )}

        {/* No Webinars */}
        {!loading && webinars.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gray-300 text-lg bg-gray-800/50 p-4 rounded-lg shadow-md"
          >
            No webinars available right now. <span className="text-red-600">Check back soon!</span> 🚀
          </motion.p>
        )}

        {/* Webinar Grid */}
        {!loading && webinars.length > 0 && (
          <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {webinars.map((event, index) => (
              <motion.li
                key={event.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="group bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg border border-red-600/20 p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-105 hover:bg-gray-700/50 hover:shadow-xl"
                whileHover={{ rotateX: 2, rotateY: 2 }}
                style={{ perspective: 1000, boxShadow: '0 0 15px rgba(255, 0, 0, 0.1)' }}
              >
                {/* Status + Date */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold shadow-inner ${
                      event.status === 'Coming Soon'
                        ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                        : 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                    }`}
                  >
                    {event.status}
                  </span>

                  {event.status === 'Confirmed' && (
                    <time
                      dateTime={event.date}
                      className="text-gray-300 text-sm md:text-base font-medium group-hover:text-red-500 transition-colors duration-300"
                    >
                      {formatDate(event.date)}
                    </time>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <h2 className="text-2xl font-extrabold text-white group-hover:bg-gradient-to-r from-red-500 to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-colors duration-300 line-clamp-2">
                    {event.title}
                  </h2>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Location:</span> {event.location}
                  </p>
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed font-light">{event.description}</p>
                </div>

                {/* Registration Button */}
                {event.status === 'Confirmed' && event.registrationLink && (
                  <motion.a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Register for ${event.title}`}
                    className="mt-4 inline-block w-full text-center py-3 px-6 rounded-lg text-lg font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 0, 0, 0.3)' }}
                  >
                    Register Now
                  </motion.a>
                )}

                {/* Placeholder for Coming Soon */}
                {event.status === 'Coming Soon' && !event.registrationLink && (
                  <div className="mt-4 w-full text-center py-3 px-6 rounded-lg text-lg font-bold text-gray-300 bg-gray-600/50 cursor-not-allowed">
                    Registration Opening Soon
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default UpcomingWebinars;