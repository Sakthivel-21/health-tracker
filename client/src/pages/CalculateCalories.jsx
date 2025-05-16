import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CalculateCalories = () => {
  const [food, setFood] = useState('');
  const [quantity, setQuantity] = useState('');
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!food || !quantity) {
      alert('Please fill all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:8000/health/foods/calculate_nutrition/',
        {
          food_name: food,
          quantity: Number(quantity)
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setResult(response.data);
      setFood('');
      setQuantity('');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to post to backend.');
    }
  };

  const handleRedirect = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/foodlogform');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 pb-6">
        <span className='text-lime-400'>C</span>alorie <span className='text-lime-400'>T</span>racker
      </h2>

      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          placeholder="Food name (e.g., Idly)"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          className="border p-2 rounded"
        />

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

      {result && (
        <div className="p-4 text-lime-800 rounded-lg shadow-md bg-lime-50">
          <h3 className="text-lg font-semibold mb-2">Nutrition Summary</h3>
          <p><strong>Food:</strong> {result.food}</p>
          <p><strong>Quantity:</strong> {result.quantity}</p>
          <p><strong>Calories:</strong> {result.calories} cal</p>
          <p><strong>Protein:</strong> {result.protein} g</p>
          <p><strong>Carbs:</strong> {result.carbs} g</p>
          <p><strong>Fats:</strong> {result.fats} g</p>
        </div>
      )}

      <div className="flex flex-col items-center justify-center mt-6">
        <h1 className="text-center mb-2">If you want to continue the process of Health tracking...</h1>
        <button
          onClick={handleRedirect}
          className="mt-2 bg-lime-500 hover:bg-lime-600 text-white rounded px-4 py-2"
        >
          Click here
        </button>
      </div>
    </div>
  );
};

export default CalculateCalories;
