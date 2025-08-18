import React, { useEffect, useState } from "react";

const UpcomingWebinars = () => {
  const [webinars, setWebinars] = useState([]);

  useEffect(() => {
    fetch("/webinars.json")
      .then((res) => res.json())
      .then((data) => setWebinars(data))
      .catch((err) => console.error("Error loading webinars:", err));
  }, []);

  return (
    <section className="font-sans min-h-screen relative overflow-hidden flex items-center justify-center p-4 pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0"></div>

      <div className="w-full max-w-4xl relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-xl">
          Join Our <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Upcoming Webinars</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto">
          Stay ahead with exclusive insights from industry experts.
        </p>

        <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {webinars.map((event) => (
            <li
              key={event.id}
              className="group bg-slate-700/50 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col gap-4 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-slate-600/50 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold shadow-inner ${
                    event.status === "Coming Soon"
                      ? "bg-yellow-400 text-yellow-900"
                      : "bg-green-400 text-green-900"
                  }`}
                >
                  {event.status}
                </span>

                {event.status === "Confirmed" && (
                  <span className="text-slate-200 text-sm md:text-md font-medium group-hover:text-white transition-colors duration-300">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <h2 className="text-2xl md:text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                  {event.title}
                </h2>
                <p className="text-sm text-slate-300">
                  <span className="font-semibold">Location:</span> {event.location}
                </p>
                <p className="text-slate-200">{event.description}</p>
              </div>

              {event.status === "Confirmed" && event.registrationLink && (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block w-full text-center py-3 px-6 rounded-lg text-lg font-bold
                             bg-gradient-to-r from-purple-500 to-pink-500 text-white
                             shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
                >
                  Register Now
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default UpcomingWebinars;
