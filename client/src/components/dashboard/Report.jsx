import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Report() {
  const [userHealth, setUserHealth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get('http://localhost:8000/auth/user-health/', {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        if (res.data && res.data.results && res.data.results.length > 0) {
          setUserHealth(res.data.results[0]);
        }
      })
      .catch((err) => {
        console.error('Error fetching user health data:', err);
      });
  }, []);

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Report <span className="text-sm font-normal text-gray-500">Goals this week</span>
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Water */}
        <div className="bg-blue-50 rounded-lg p-3">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Water</h3>
          <div className="flex items-center justify-center h-24">
            <div className="relative w-12 h-full bg-blue-100 rounded-lg overflow-hidden">
              <div className="absolute bottom-0 w-full bg-blue-400" style={{ height: '80%' }}></div>
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-lg font-semibold">2500ml</p>
            <p className="text-xs text-gray-500">Goal 3.1L</p>
          </div>
        </div>

        {/* Weight */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Weight</h3>
          <div className="flex items-center justify-center h-24 relative">
            <div className="relative w-full h-12">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-red-400 to-yellow-300 rounded-full"
                  style={{
                    width: userHealth?.weight ? `${(userHealth.weight / 100) * 100}%` : '60%',
                  }}
                ></div>
              </div>
              <div
                className="absolute top-0 h-4 w-4 bg-white border-2 border-yellow-400 rounded-full -mt-1"
                style={{
                  left: userHealth?.weight ? `${(userHealth.weight / 100) * 100}%` : '60%',
                }}
              ></div>
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-lg font-semibold">{userHealth?.weight ?? '--'} kg</p>
            <p className="text-xs text-gray-500">Goal 56kg</p>
          </div>
        </div>

        {/* Age */}
        <div className="bg-green-50 rounded-lg p-3">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Age</h3>
          <div className="flex items-center justify-center h-24">
            <div className="text-5xl font-bold text-green-600">{userHealth?.age ?? '--'}</div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-lg font-semibold">years old</p>
            <p className="text-xs text-gray-500">based on profile</p>
          </div>
        </div>

        {/* Calories */}
        <div className="bg-pink-50 rounded-lg p-3">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Calories</h3>
          <div className="flex items-center justify-center h-24">
            <div className="relative h-16 w-16 bg-pink-100 rounded-full flex items-center justify-center">
              <div className="h-12 w-12 bg-pink-400 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-lg font-semibold">{userHealth?.daily_calorie_limit ?? '--'} kcal</p>
            <p className="text-xs text-gray-500">Daily Limit</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
