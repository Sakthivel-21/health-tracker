import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUtensils, FaCalendarAlt, FaChartPie } from 'react-icons/fa';
import { GiMeal } from 'react-icons/gi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FoodLog = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todaysLogs, setTodaysLogs] = useState([]);
  const [summary, setSummary] = useState({});
  const token = localStorage.getItem('token');

  const fetchData = async (date = selectedDate) => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const logRes = await axios.get('http://localhost:8000/health/food-logs/history/', {
        headers: { Authorization: `Token ${token}` },
      });
      const logs = logRes.data[dateStr] || [];
      setTodaysLogs(logs);

      const todayStr = new Date().toISOString().split('T')[0];
      if (dateStr === todayStr) {
        const summaryRes = await axios.get('http://localhost:8000/health/food-logs/today_summary/', {
          headers: { Authorization: `Token ${token}` },
        });
        setSummary(summaryRes.data.today_summary || {});
      } else {
        const manual = logs.reduce(
          (acc, log) => {
            acc.total_calories += log.calories;
            acc.total_protein += log.protein;
            acc.total_carbs += log.carbs;
            acc.total_fats += log.fats;
            return acc;
          },
          { total_calories: 0, total_protein: 0, total_carbs: 0, total_fats: 0 }
        );
        setSummary(manual);
      }
    } catch (error) {
      console.error('Error fetching food logs or summary:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const groupedLogs = todaysLogs.reduce((acc, log) => {
    const meal = log.meal_type.charAt(0).toUpperCase() + log.meal_type.slice(1);
    if (!acc[meal]) acc[meal] = [];
    acc[meal].push(log);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-lime-100 py-10 px-4 sm:px-6 lg:px-12">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center text-lime-500 mb-12 drop-shadow-md">
         Food Log Summary
      </h1>

      {/* Date Picker */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-3 bg-white shadow-md rounded-full px-6 py-3 border border-lime-300">
          <FaCalendarAlt className="text-lime-500 text-lg" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            maxDate={new Date()}
            className="text-lime-700 font-medium focus:outline-none bg-transparent"
            dateFormat="yyyy-MM-dd"
          />
        </div>
      </div>

      {/* Nutrition Summary */}
      <div className="max-w-4xl mx-auto mb-14">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-lime-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Nutrition Summary</h2>
            <FaChartPie className="text-lime-500 text-2xl" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-gray-700 text-sm sm:text-base">
            <div>
              <p className="text-lime-500 font-semibold">Calories</p>
              <p className="font-medium">{summary.total_calories || 0} kcal</p>
            </div>
            <div>
              <p className="text-lime-500 font-semibold">Protein</p>
              <p className="font-medium">{summary.total_protein?.toFixed(2) || 0} g</p>
            </div>
            <div>
              <p className="text-lime-500 font-semibold">Carbs</p>
              <p className="font-medium">{summary.total_carbs?.toFixed(2) || 0} g</p>
            </div>
            <div>
              <p className="text-lime-500 font-semibold">Fats</p>
              <p className="font-medium">{summary.total_fats?.toFixed(2) || 0} g</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Section */}
      <div className="flex flex-col items-center space-y-12">
        {Object.keys(groupedLogs).length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No food logs found for the selected date.</div>
        ) : (
          Object.keys(groupedLogs).map((meal, index) => (
            <div
              key={index}
              className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 border border-lime-200"
            >
              <h3 className="text-2xl font-semibold  text-gray-700 mb-6 flex items-center gap-2">
                <GiMeal className="text-lime-500  text-2xl" /> {meal}
              </h3>
              <div className="space-y-6">
                {groupedLogs[meal].map((log, idx) => (
                  <div
                    key={idx}
                    className="bg-lime-50 rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="text-lg font-bold  text-lime-500">{log.food_name}</h4>
                        <p className="text-sm text-gray-500">Quantity: {log.quantity}</p>
                      </div>
                      <FaUtensils className="text-lime-500 text-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                      <p><span className="text-lime-500 font-semibold">Calories:</span> {log.calories} kcal</p>
                      <p><span className="text-lime-500 font-semibold">Protein:</span> {log.protein.toFixed(2)} g</p>
                      <p><span className="text-lime-500 font-semibold">Carbs:</span> {log.carbs.toFixed(2)} g</p>
                      <p><span className="text-lime-500 font-semibold">Fats:</span> {log.fats.toFixed(2)} g</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FoodLog;
