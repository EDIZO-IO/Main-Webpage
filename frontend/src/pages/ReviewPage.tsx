// src/pages/ReviewPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MessageCircle, Users, ArrowLeft } from 'lucide-react';

const AnimatedSection = ({ children, delay = 0.1 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// Mock Reviews Data
const reviews = [
  {
    id: 1,
    name: "Sarah Kim",
    role: "Marketing Director, TechNova",
    rating: 5,
    date: "Oct 15, 2024",
    content:
      "Edizo transformed our brand presence. Their design and development team delivered beyond expectations — on time and under budget. Our users love the new interface!",
    avatar: "S",
  },
  {
    id: 2,
    name: "James Patel",
    role: "Founder, Nexora",
    rating: 5,
    date: "Sep 28, 2024",
    content:
      "Working with Edizo was a game-changer. Their attention to detail and user-centric approach made our app a success. Communication was smooth throughout.",
    avatar: "J",
  },
  {
    id: 3,
    name: "Lena Wu",
    role: "CEO, VisionLabs",
    rating: 4.9,
    date: "Sep 10, 2024",
    content:
      "From concept to launch, Edizo handled everything with professionalism. They exceeded our KPIs and delivered a product we’re proud of. Highly recommend!",
    avatar: "L",
  },
  {
    id: 4,
    name: "Mark Thompson",
    role: "Product Lead, InnovateX",
    rating: 5,
    date: "Aug 5, 2024",
    content:
      "Best agency we've worked with. Transparent process, fast delivery, and stunning results. Our conversion rate increased by 70% post-launch.",
    avatar: "M",
  },
];

const ReviewPage = () => {
  // Average Rating
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-yellow-200 hover:text-white mb-4"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Client Reviews</h1>
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < Math.floor(avgRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-yellow-200"
                  }
                />
              ))}
            </div>
            <span className="text-2xl font-bold">{avgRating}</span>
          </div>
          <p className="text-xl opacity-90">{reviews.length} Verified Client Reviews</p>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review, i) => (
              <AnimatedSection key={review.id} delay={i * 0.1}>
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            size={16}
                            className={
                              idx < Math.floor(review.rating)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">{review.rating}</span>
                      </div>
                      <h3 className="font-bold text-gray-900">{review.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{review.role}</p>
                      <p className="text-gray-700 mb-3 text-sm italic">"{review.content}"</p>
                      <div className="text-xs text-gray-400">{review.date}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Your Success Story Starts Here</h2>
          <p className="text-gray-300 mb-8">Join 50+ clients who trust us with their digital growth.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-full hover:bg-yellow-500 transition"
          >
            Get Started <MessageCircle size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ReviewPage;