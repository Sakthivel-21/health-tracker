import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaUserCircle,
  FaHeartbeat,
  FaChartLine,
  FaSignOutAlt,
  FaWeight,
  FaFireAlt,
  FaBirthdayCake,
  FaBars
} from 'react-icons/fa';

const Dashboard = () => {
  const [userHealth, setUserHealth] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUserHealth = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/auth/user-health/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setUserHealth(response.data.results[0]);
      } catch (error) {
        console.error('Error fetching user health data:', error);
      }
    };

    fetchUserHealth();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`w-full md:w-64 bg-lime-100 text-black flex flex-col p-6 space-y-6 transition-all duration-300 ${menuOpen ? 'block' : 'hidden md:block'}`}>
        <div className="text-3xl font-bold tracking-wide mb-6">HealthApp</div>

        <div className="flex flex-col gap-4 text-lg">
          <div className="flex items-center gap-3 hover:text-black font-medium cursor-pointer">
            <FaUserCircle className="text-lime-700" />
            <span>Profile</span>
          </div>
          <div className="flex items-center gap-3 hover:text-black font-medium cursor-pointer">
            <FaHeartbeat className="text-lime-700" />
            <span>Health</span>
          </div>
          <div className="flex items-center gap-3 hover:text-black font-medium cursor-pointer">
            <FaChartLine className="text-lime-700" />
            <span>Reports</span>
          </div>
          <div className="flex items-center gap-3 text-red-700 font-medium cursor-pointer mt-auto">
            <FaSignOutAlt className="text-lime-700" />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-lime-400 text-black">
        <div className="text-2xl font-bold">HealthApp</div>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex justify-center items-center">
        {userHealth ? (
          <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md text-center border-2 border-lime-500">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Welcome, {userHealth.user}
            </h2>
            <h3 className="text-2xl font-semibold mb-4 text-lime-600 flex items-center justify-center gap-2">
              <FaHeartbeat /> Your Health Data
            </h3>
            <div className="space-y-4 text-lg text-gray-700">
              <p className="bg-lime-100 p-3 rounded-xl flex items-center justify-center gap-2">
                <FaBirthdayCake className="text-lime-600" />
                {userHealth.age} years
              </p>
              <p className="bg-lime-100 p-3 rounded-xl flex items-center justify-center gap-2">
                <FaWeight className="text-lime-600" />
                {userHealth.weight} kg
              </p>
              <p className="bg-lime-100 p-3 rounded-xl flex items-center justify-center gap-2">
                <FaFireAlt className="text-lime-600" />
                {userHealth.daily_calorie_limit} kcal/day
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-xl">Loading health data...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
