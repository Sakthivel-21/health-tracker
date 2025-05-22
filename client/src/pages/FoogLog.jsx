import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

// Relevant, meaningful icons
const mealImages = {
  Breakfast: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png', // Breakfast plate
  Lunch: 'https://cdn-icons-png.flaticon.com/512/1046/1046795.png', // Lunch box
  Dinner: 'https://cdn-icons-png.flaticon.com/512/1046/1046787.png', // Dinner plate
  Snacks: 'https://cdn-icons-png.flaticon.com/512/2907/2907044.png', // Snack icon
};

const nutritionImages = {
  Calories: 'https://cdn-icons-png.flaticon.com/512/3063/3063821.png', // Fire/flame icon (calories)
  Protein: 'https://cdn-icons-png.flaticon.com/512/616/616408.png', // Muscle arm icon (protein)
  Carbs: 'https://cdn-icons-png.flaticon.com/512/3145/3145766.png', // Bread icon (carbs)
  Fats: 'https://cdn-icons-png.flaticon.com/512/1046/1046789.png', // Oil droplet (fats)
};

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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-12 ">
      <h1 className="text-4xl font-extrabold text-center text-lime-900 mb-12 drop-shadow-lg">
        Food Log Summary
      </h1>

      {/* Date Picker */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-3 bg-lime-100 rounded-full px-6 py-3 border border-lime-300 shadow-md">
          <FaCalendarAlt className="text-lime-700 text-lg" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            maxDate={new Date()}
            className="text-lime-900 font-semibold bg-transparent focus:outline-none"
            dateFormat="yyyy-MM-dd"
          />
        </div>
      </div>

      {/* Nutrition Summary */}
      <div className="max-w-4xl mx-auto mb-14">
        <div className="bg-lime-50 rounded-xl shadow-lg p-8 border border-lime-300">
          <h2 className="text-2xl font-bold text-center text-lime-900 mb-6 drop-shadow">
            Nutrition Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {['Calories', 'Protein', 'Carbs', 'Fats'].map((key) => (
              <div key={key} className="flex flex-col items-center">
                <img src={nutritionImages[key]} alt={key} className="w-12 h-12 mb-3" />
                <p className="text-lime-800 font-semibold text-lg">{key}</p>
                <p className="font-semibold text-lime-900 text-xl">
                  {key === 'Calories'
                    ? `${summary.total_calories || 0} kcal`
                    : `${summary[`total_${key.toLowerCase()}`]?.toFixed(2) || 0} g`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meal Logs */}
      <div className="flex flex-col items-center space-y-16">
        {Object.keys(groupedLogs).length === 0 ? (
          <div className="text-center text-lime-900 text-xl font-semibold">
            No food logs found for the selected date.
          </div>
        ) : (
          Object.keys(groupedLogs).map((meal, index) => (
            <div
              key={index}
              className="w-full max-w-3xl bg-lime-50 rounded-3xl shadow-lg border border-lime-300"
            >
              <div className="flex items-center gap-5 bg-lime-100 px-8 py-5 rounded-t-3xl border-b border-lime-300">
                <img src={mealImages[meal] || mealImages.Breakfast} alt={meal} className="w-12 h-12" />
                <h3 className="text-2xl font-bold text-lime-900">{meal}</h3>
              </div>
              <div className="p-8 space-y-8">
                {groupedLogs[meal].map((log, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-6 border border-lime-200 shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="text-xl font-extrabold text-lime-900">{log.food_name}</h4>
                        <p className="text-lime-700 font-semibold">Quantity: {log.quantity}</p>
                      </div>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/857/857681.png"
                        alt="food-icon"
                        className="w-6 h-6 opacity-80"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-lg text-lime-800">
                      <p>
                        <span className="font-semibold text-lime-700">Calories:</span> {log.calories} kcal
                      </p>
                      <p>
                        <span className="font-semibold text-lime-700">Protein:</span> {log.protein.toFixed(2)} g
                      </p>
                      <p>
                        <span className="font-semibold text-lime-700">Carbs:</span> {log.carbs.toFixed(2)} g
                      </p>
                      <p>
                        <span className="font-semibold text-lime-700">Fats:</span> {log.fats.toFixed(2)} g
                      </p>
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
