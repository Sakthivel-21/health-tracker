import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Activity() {
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get('http://localhost:8000/health/food-logs/history/', {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        const data = res.data || {};
        const entries = Object.entries(data);

        const sorted = entries
          .sort((a, b) => new Date(b[0]) - new Date(a[0]))
          .slice(0, 5)
          .reverse();

        const result = sorted.map(([date, logs]) => {
          const percentage = Math.min(logs.length * 20, 100); // Max 100%
          const day = new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
          });
          return { day, percentage };
        });

        setProgressData(result);
      })
      .catch((err) => {
        console.error('Error fetching food logs:', err);
      });
  }, []);

  return (
    <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-4 sm:p-6 bg-white rounded-2xl shadow-lg border border-gray-200 mx-auto">
      <h2 className="text-lg font-semibold mb-6 text-gray-800 text-center">
        Weekly Activity
      </h2>

      <div className="flex justify-between items-end gap-x-3 sm:gap-x-4 h-44">
        {(progressData.length === 0 ? Array.from({ length: 5 }) : progressData).map(
          (item, index) => {
            const percentage = item?.percentage || 0;
            const day = item?.day || '--';

            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <p className="text-sm mb-1 text-gray-700 font-medium">
                  {percentage}%
                </p>
                <div className="w-8 sm:w-10 h-32 bg-gray-200 rounded-xl relative shadow-md overflow-hidden">
                  <div
                    className="absolute bottom-0 w-full bg-lime-500 rounded-t-xl transition-all duration-500"
                    style={{ height: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-2 text-gray-600 font-medium">{day}</p>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

export default Activity;
