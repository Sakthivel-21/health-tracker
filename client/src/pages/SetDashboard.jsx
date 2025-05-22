import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaChartPie,
  FaFireAlt,
  FaBirthdayCake,
  FaWeight,
  FaUtensils,
  FaDrumstickBite,
  FaBreadSlice,
  FaBacon,
} from 'react-icons/fa';

const SetDashboard = () => {
  const [userHealth, setUserHealth] = useState(null);
  const [summary, setSummary] = useState({});
  const [todayLogs, setTodayLogs] = useState([]);
  const [topOverallFood, setTopOverallFood] = useState(null);
  const [topOverallSnack, setTopOverallSnack] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const [userHealthRes, summaryRes, logsRes, topFoodsRes] = await Promise.all([
          axios.get('http://localhost:8000/auth/user-health/', {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get('http://localhost:8000/health/food-logs/today_summary/', {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get('http://localhost:8000/health/food-logs/history/', {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get('http://localhost:8000/health/food-logs/top_foods/', {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);

        setUserHealth(userHealthRes.data.results[0]);
        setSummary(summaryRes.data.today_summary || {});

        const today = new Date().toISOString().split('T')[0];
        const logs = logsRes.data[today] || [];
        setTodayLogs(logs);

        const topFoods = topFoodsRes.data;
        const isSnack = name =>
          ['biscuit', 'cookie', 'chips', 'snack', 'murukku'].some(snack =>
            name.toLowerCase().includes(snack)
          );

        const foodItems = topFoods.filter(item => !isSnack(item.food__name));
        const snackItems = topFoods.filter(item => isSnack(item.food__name));

        setTopOverallFood(foodItems[0] || null);
        setTopOverallSnack(snackItems[0] || null);
      } catch (error) {
        console.error('Dashboard loading error:', error);
      }
    };

    fetchData();
  }, []);

  const groupedLogs = todayLogs.reduce((acc, log) => {
    const meal = log.meal_type;
    if (!acc[meal]) acc[meal] = [];
    acc[meal].push(log);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-lime-50">
      {/* Header */}
      <div className="relative bg-lime-200 h-24 md:h-28">
        <div className="absolute inset-0 bg-lime-500 bg-opacity-70 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Your Health Dashboard</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 grid md:grid-cols-2 gap-8">
        {/* Left Side */}
        <div className="space-y-8">
          {/* Profile Summary */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-bold text-lime-500 mb-4">Profile Summary</h2>
            {userHealth && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
                <div className="flex items-center gap-2">
                  <FaBirthdayCake className="text-lime-500" />
                  <span>Age: {userHealth.age}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaWeight className="text-lime-500" />
                  <span>Weight: {userHealth.weight} kg</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaFireAlt className="text-lime-500" />
                  <span>Calorie Limit: {userHealth.daily_calorie_limit} kcal</span>
                </div>
              </div>
            )}
          </div>

          {/* Today's Nutrition Summary */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h3 className="text-xl font-bold text-lime-500 mb-4 flex items-center gap-2">
              <FaChartPie className="text-lime-500" /> Today's Nutrition Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span>Calories</span>
                <span>{summary.total_calories || 0} kcal</span>
              </div>
              <div className="flex justify-between">
                <span>Protein</span>
                <span>{summary.total_protein?.toFixed(2) || 0} g</span>
              </div>
              <div className="flex justify-between">
                <span>Carbohydrates</span>
                <span>{summary.total_carbs?.toFixed(2) || 0} g</span>
              </div>
              <div className="flex justify-between">
                <span>Fats</span>
                <span>{summary.total_fats?.toFixed(2) || 0} g</span>
              </div>
            </div>
          </div>

          {/* Most Eaten Section */}
          <div className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-bold text-lime-500 mb-4">Most Eaten (All Time)</h2>
            <div className="space-y-3 text-gray-800 text-sm">
              {topOverallFood && (
                <div className="flex justify-between">
                  <span><b>{topOverallFood.food__name}</b></span>
                  <span>{topOverallFood.times_eaten} times</span>
                </div>
              )}
              {topOverallSnack && (
                <div className="flex justify-between">
                  <span><b>{topOverallSnack.food__name}</b> (Snack)</span>
                  <span>{topOverallSnack.times_eaten} times</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Today's Logs */}
        <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-lime-500 flex items-center gap-2">
                <FaUtensils className="text-lime-500" /> Today's Food Logs
              </h2>
              <span className="bg-lime-100 text-lime-500 px-3 py-1 rounded-full text-sm">
                {todayLogs.length} Logs
              </span>
            </div>

            {todayLogs.length === 0 ? (
              <p className="text-gray-500">No food logs for today.</p>
            ) : (
              ['breakfast', 'lunch', 'dinner', 'snacks'].map(meal =>
                groupedLogs[meal] ? (
                  <div key={meal} className="mb-4">
                    <h3 className="text-lg font-semibold text-lime-500 capitalize mb-2">{meal}</h3>
                    <ul className="space-y-3">
                      {groupedLogs[meal].map((log, index) => (
                        <li
                          key={index}
                          className="bg-lime-50 rounded-xl p-4 border border-lime-200"
                        >
                          <div className="flex justify-between font-medium">
                            <span>{log.food_name} (x{log.quantity})</span>
                            <span className="text-lime-500">{log.calories} kcal</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <FaDrumstickBite className="text-lime-500" /> Protein: {log.protein}g
                            </div>
                            <div className="flex items-center gap-1">
                              <FaBreadSlice className="text-lime-500" /> Carbs: {log.carbs}g
                            </div>
                            <div className="flex items-center gap-1">
                              <FaBacon className="text-lime-500" /> Fats: {log.fats.toFixed(2)}g
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )
            )}
          </div>

          <div className="mt-6 pt-4 border-t text-right">
            <Link to="/foodlog">
              <button className="bg-lime-500 hover:bg-lime-400 text-white font-semibold px-4 py-2 rounded-xl shadow">
                View Full History
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetDashboard;
