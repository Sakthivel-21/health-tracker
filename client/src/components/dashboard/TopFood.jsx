import React, { useEffect, useState } from "react";
import axios from "axios";
import { Utensils, Cookie } from "lucide-react";

const TopFood = () => {
  const [topFood, setTopFood] = useState(null);
  const [topSnack, setTopSnack] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTopFoods = async () => {
      try {
        const response = await axios.get("http://localhost:8000/health/food-logs/top_foods/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const data = response.data;

        if (data.length > 0) {
          const food = data.find((item) =>
            !["Biscuit", "Chips", "Chocolate", "Cake", "Cookies"].includes(item.food__name)
          );
          const snack = data.find((item) =>
            ["Biscuit", "Chips", "Chocolate", "Cake", "Cookies"].includes(item.food__name)
          );

          setTopFood(food || null);
          setTopSnack(snack || null);
        }
      } catch (error) {
        console.error("Failed to fetch top foods:", error);
      }
    };

    fetchTopFoods();
  }, [token]);

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">Top Eaten Items</h2>

      <div className="space-y-4">
        {topFood && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
            <div className="bg-green-100 p-3 rounded-full">
              <Utensils className="text-green-600" size={26} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Most Eaten Food</p>
              <p className="text-lg font-semibold text-gray-800">
                {topFood.food__name}
              </p>
            </div>
          </div>
        )}

        {topSnack && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Cookie className="text-yellow-600" size={26} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Top Snack</p>
              <p className="text-lg font-semibold text-gray-800">
                {topSnack.food__name}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopFood;
