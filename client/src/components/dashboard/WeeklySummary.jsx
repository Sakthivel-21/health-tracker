import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Flame,
  Drumstick,
  CakeSlice,
  Droplet,
} from "lucide-react";

const WeeklySummary = () => {
  const token = localStorage.getItem("token");
  const [totals, setTotals] = useState({
    total_calories: 0,
    total_protein: 0,
    total_carbs: 0,
    total_fats: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeeklySummary = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/health/food-logs/weekly_summary/?range=sunday_to_saturday",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = response.data;

        // Sort dates (keys) in ascending order to maintain Sunday to Saturday order
        const sortedDates = Object.keys(data).sort();

        // Initialize cumulative sums
        let cumulativeCalories = 0;
        let cumulativeProtein = 0;
        let cumulativeCarbs = 0;
        let cumulativeFats = 0;

        // Sum up all daily values to get total weekly cumulative sums
        sortedDates.forEach((date) => {
          const dayData = data[date];
          cumulativeCalories += dayData.total_calories || 0;
          cumulativeProtein += dayData.total_protein || 0;
          cumulativeCarbs += dayData.total_carbs || 0;
          cumulativeFats += dayData.total_fats || 0;
        });

        // Set totals to cumulative sums
        setTotals({
          total_calories: cumulativeCalories,
          total_protein: cumulativeProtein,
          total_carbs: cumulativeCarbs,
          total_fats: cumulativeFats,
        });
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            `HTTP error! status: ${err.response?.status || "Unknown"}`
        );
      }
    };

    if (token) {
      fetchWeeklySummary();
    } else {
      setError("Token not found. Please login again.");
    }
  }, [token]);

  if (error)
    return <div className="text-red-600 text-center mt-4">Error: {error}</div>;

  const statCards = [
    {
      icon: <Flame className="text-orange-500" size={28} />,
      label: "Calories",
      value: totals.total_calories.toFixed(0),
      unit: "kcal",
    },
    {
      icon: <Drumstick className="text-green-600" size={28} />,
      label: "Protein",
      value: totals.total_protein.toFixed(2),
      unit: "g",
    },
    {
      icon: <CakeSlice className="text-blue-500" size={28} />,
      label: "Carbs",
      value: totals.total_carbs.toFixed(2),
      unit: "g",
    },
    {
      icon: <Droplet className="text-pink-500" size={28} />,
      label: "Fats",
      value: totals.total_fats.toFixed(2),
      unit: "g",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Weekly Summary 
      </h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {statCards.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="bg-gray-100 p-3 rounded-full">{item.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-xl font-semibold text-gray-800">
                {item.value} {item.unit}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default WeeklySummary;
