import React, { useState } from 'react';
import axios from 'axios';

const CalculateCalories = () => {
  const [food, setFood] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [quantity, setQuantity] = useState('');
  const [logs, setLogs] = useState([]);

  const handleAdd = async () => {
    if (!food || !mealType || !quantity) {
      alert('Please fill all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      // 🔎 GET food details from backend by name
      const foodRes = await axios.get(`http://localhost:8000/api/food/name/${food}/`, {
        headers: { Authorization: `Token ${token}` }
      });

      const foodData = foodRes.data; // { id, name, calories_per_unit }
      const totalCalories = foodData.calories_per_unit * quantity;

      const newLog = {
        food: foodData.name,
        mealType,
        quantity,
        totalCalories,
      };

      setLogs(prev => [...prev, newLog]);

      // 📤 POST log to backend
      await axios.post(
        'http://localhost:8000/health/food-logs/calculate_nutrition/',
        {
          food_name: foodData.name,
          meal_type: mealType,
          quantity: Number(quantity)
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setFood('');
      setQuantity('');
    } catch (error) {
      console.error('Error:', error);
      alert('Food not found or failed to post to backend.');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Calorie Tracker</h2>

      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          placeholder="Food name (e.g., Rice)"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="border p-2 rounded"
        >
          <option>Breakfast</option>
          <option>Afternoon</option>
          <option>Night</option>
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={handleAdd}
          className="bg-lime-400 hover:bg-lime-500 text-white py-2 rounded"
        >
          Add
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Food Logs</h3>
      <ul className="space-y-2">
        {logs.map((log, index) => (
          <li key={index} className="border p-2 rounded bg-gray-100">
            <strong>{log.food}</strong> ({log.mealType}) - {log.quantity} unit(s) ={" "}
            <span className="font-bold">{log.totalCalories}</span> cal
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalculateCalories;
