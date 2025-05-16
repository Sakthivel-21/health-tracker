import React from 'react'
import heroImage from '../assets/calories.jpg'; // You must add an image in assets folder

function Hero() {
  return (
    <section className="flex flex-col items-center justify-center  text-gray-800">
      
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full gap-8 mb-20">
        {/* Left Content */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-4xl font-bold mb-6 leading-tight">
            <span className='text-lime-400'>Y</span>our Health Journey Starts Here
          </h1>
          <p className="text-base md:text-xl mb-6">
            Track your fitness goals, monitor health metrics, and stay motivated — all in one powerful platform built for your wellness.
          </p>
          <button className="bg-lime-400 justify-items-center items-center flex text-black font-semibold px-6 py-3 rounded-full shadow-md hover:bg-lime-500 transition">
            Get Started
          </button>
        </div>

        {/* Right Image */}
        <div className="flex-1">
          <img src={heroImage} alt="Health Tracking" className="w-full max-w-md mx-auto" />
        </div>
      </div>
      </section>
      
     
      

      
      
  
  );
}

export default Hero;
