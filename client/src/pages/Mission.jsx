import React from 'react';
import { FaRunning, FaHeartbeat, FaBullseye } from 'react-icons/fa';

function Mission() {
  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-12 space-y-20 bg-white">

      {/* Section 1: Our Mission */}
      <section className="w-full max-w-6xl text-center space-y-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
        <span className='text-lime-400'>O</span>ur   <span className='text-lime-400'>M</span>ission</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaRunning size={40} className="text-lime-500" />,
              title: 'Fitness Tracking',
              desc: 'Easily log your workouts, steps, and calories daily.',
            },
            {
              icon: <FaHeartbeat size={40} className="text-lime-500" />,
              title: 'Health Monitoring',
              desc: 'Track vital health parameters like BP, sugar levels, and weight.',
            },
            {
              icon: <FaBullseye size={40} className="text-lime-500" />,
              title: 'Goal Setting',
              desc: 'Set fitness goals and watch your progress with beautiful charts.',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white border border-lime-500 p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 text-center"
            >
              <div className="flex justify-center mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
              <p className="text-gray-700 text-base">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Why HealthTracker */}
      <section className="text-center max-w-4xl w-full px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        <span className='text-lime-400'>W</span>hy   <span className='text-lime-400'>H</span>ealthTracker?
        </h2>
        <p className="text-base md:text-xl text-gray-800 leading-relaxed">
          HealthTracker empowers you with real-time tracking, actionable insights, and motivational tools to stay healthier every day.
          Whether you're looking to lose weight, gain strength, or simply stay active, we are here to support your journey!
        </p>
      </section>
    </div>
  );
}

export default Mission;
