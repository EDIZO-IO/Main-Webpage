import React, { useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "CEO, TechStart Solutions",
      company: "TechStart Solutions",
      content: "Edizo transformed our digital presence with their exceptional UI/UX design and development skills. Our user engagement increased by 150% after their redesign.",
      rating: 5,
      date: "Since June 2025",
      avatar: "/api/placeholder/60/60"
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Marketing Director",
      company: "Global Retail Inc.",
      content: "The team at Edizo delivered our e-commerce platform ahead of schedule with outstanding quality. Their attention to detail and customer service is remarkable.",
      rating: 5,
      date: "Since July 2025",
      avatar: "/api/placeholder/60/60"
    },
    {
      id: 3,
      name: "Amit Patel",
      role: "Founder",
      company: "FinTech Innovations",
      content: "Working with Edizo was a game-changer for our startup. Their mobile app development expertise helped us secure Series A funding with our impressive user metrics.",
      rating: 5,
      date: "Since August 2025",
      avatar: "/api/placeholder/60/60"
    },
    {
      id: 4,
      name: "Sneha Reddy",
      role: "Product Manager",
      company: "HealthCare Plus",
      content: "Edizo's digital marketing strategies significantly improved our online visibility and lead generation. ROI increased by 200% in just 3 months.",
      rating: 5,
      date: "Since September 2025",
      avatar: "/api/placeholder/60/60"
    },
    {
      id: 5,
      name: "Vikram Singh",
      role: "CTO, InnovateX",
      company: "InnovateX",
      content: "The Edizo team delivered our complex enterprise solution with precision and innovation. Their technical expertise is unmatched in the industry.",
      rating: 5,
      date: "Since October 2025",
      avatar: "/api/placeholder/60/60"
    },
    {
      id: 6,
      name: "Ananya Nair",
      role: "Director of Operations",
      company: "EcoSolutions",
      content: "Our partnership with Edizo has been transformative. They understood our vision perfectly and executed beyond our expectations.",
      rating: 5,
      date: "Since November 2025",
      avatar: "/api/placeholder/60/60"
    }
  ];

  const sliderRef = useRef(null);

  const scroll = (direction) => {
    const slider = sliderRef.current;
    const scrollAmount = slider.offsetWidth * 0.8; // Scroll 80% of container width

    if (direction === 'left') {
      slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-edizo-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-edizo-black mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-edizo-gray-700 max-w-3xl mx-auto">
            Hear from our clients who have transformed their businesses with our solutions
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative group">
          <div
            ref={sliderRef}
            className="flex overflow-x-auto scrollbar-hide space-x-8 py-4 px-4 hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33%-1rem)] bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-edizo-gray-200"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-edizo-red mb-4 opacity-70" />

                <blockquote className="text-gray-700 text-lg mb-6 italic">
                  "{testimonial.content}"
                </blockquote>

                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-edizo-black">{testimonial.name}</div>
                    <div className="text-sm text-edizo-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-edizo-red font-medium">{testimonial.company}</div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-edizo-gray-500">
                  {testimonial.date}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => scroll('left')}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap justify-center gap-6 md:gap-8 bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-center min-w-[100px]">
              <div className="text-3xl font-bold text-edizo-red">98%</div>
              <div className="text-sm text-edizo-gray-600">Client Retention</div>
            </div>
            <div className="text-center min-w-[100px]">
              <div className="text-3xl font-bold text-edizo-red">10+</div>
              <div className="text-sm text-edizo-gray-600">Projects</div>
            </div>
            <div className="text-center min-w-[100px]">
              <div className="text-3xl font-bold text-edizo-red">4.9/5</div>
              <div className="text-sm text-edizo-gray-600">Average Rating</div>
            </div>
            <div className="text-center min-w-[100px]">
              <div className="text-3xl font-bold text-edizo-red">10+</div>
              <div className="text-sm text-edizo-gray-600">Clients</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;