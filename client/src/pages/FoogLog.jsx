import React, { useState, useEffect } from 'react';
import axios from 'axios';

const mealTypes = ['Breakfast', 'Afternoon', 'Night'];

const FoodLog = () => {
  const [foodId, setFoodId] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [quantity, setQuantity] = useState(1);
  const [foodLogs, setFoodLogs] = useState([]);
  const [calories, setCalories] = useState(0);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

 

  {/*const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'localhost:8000/health/foods/calculate_nutrition/',
        {
          food_id: foodId,
          meal_type: mealType,
          quantity,
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setFoodId('');
      setQuantity(1);
      setError('');
      fetchFoodLogs();
    } catch (err) {
      setError('Failed to submit food log');
      console.error(err);
    }
  };

  const fetchFoodLogs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/admin/foods/foodlog/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setFoodLogs(response.data);
      calculateTotalCalories(response.data);
    } catch (err) {
      setError('Failed to load food logs');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFoodLogs();
  }, []);

  const calculateTotalCalories = (logs) => {
    const total = logs.reduce((sum, log) => sum + log.quantity * 100, 0); // Simulated value
    setCalories(total);
  };*/}

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">🍽️ Food Log Tracker</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-green-100"
      >
        {error && (
          <div className="mb-4 text-red-500 text-center font-medium">{error}</div>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Food Name</label>
          <input
            type="text"
            value={foodId}
            onChange={(e) => setFoodId(e.target.value)}
            placeholder="e.g., Idly, Dosa"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Meal Type</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {mealTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-semibold text-gray-700">Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 transition"
        >
          ➕ Add Log
        </button>
      </form>

      <div className="max-w-3xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">📝 Food Log Summary</h2>

        {foodLogs.length === 0 ? (
          <p className="text-gray-600 text-center">No food logs yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
              <thead className="bg-green-100 text-green-800">
                <tr>
                  <th className="py-3 px-4 text-left">Food</th>
                  <th className="py-3 px-4 text-left">Meal</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4 text-right">Est. Calories</th>
                </tr>
              </thead>
              <tbody>
                {foodLogs.map((log, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{log.food_id}</td>
                    <td className="py-2 px-4">{log.meal_type}</td>
                    <td className="py-2 px-4 text-center">{log.quantity}</td>
                    <td className="py-2 px-4 text-right">{log.quantity * 100} kcal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-xl font-bold text-green-700 mt-6 text-center">
          🧮 Total Calories: {calories} kcal
        </div>
      </div>
    </div>
  );
};

export default FoodLog;
