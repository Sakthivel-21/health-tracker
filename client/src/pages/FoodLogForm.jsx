// src/components/FoodLogForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const mealTypes = [
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Snacks', value: 'snacks' },
  { label: 'Dinner', value: 'dinner' },
];

const FoodLogForm = ({ onLogSubmitted }) => {
  const [foodList, setFoodList] = useState([]);
  const [filteredFoodList, setFilteredFoodList] = useState([]);
  const [foodId, setFoodId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get('http://localhost:8000/health/foods/', {
          headers: { Authorization: `Token ${token}` },
        });
        setFoodList(response.data.results);
        setFilteredFoodList(response.data.results);
      } catch (err) {
        setError('❌ Failed to fetch food list.');
      }
    };
    fetchFoodList();
  }, []);

  useEffect(() => {
    const filtered = foodList.filter((food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFoodList(filtered);
  }, [searchTerm, foodList]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFoodSelect = (food) => {
    setSearchTerm(food.name);
    setFoodId(food.id);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foodId) {
      setError('❌ Please select a food from the list.');
      return;
    }

    try {
      // ✅ Make POST request
      await axios.post(
        'http://localhost:8000/health/food-logs/',
        {
          food_id: foodId,
          meal_type: mealType,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // ✅ Clear form
      setSuccess('✅ Food log submitted successfully!');
      setError('');
      setFoodId('');
      setSearchTerm('');
      setQuantity(1);

      // ✅ Call parent callback safely
      if (typeof onLogSubmitted === 'function') {
        try {
          onLogSubmitted();
        } catch (logError) {
          console.error('onLogSubmitted error:', logError);
        }
      }

      // ✅ Navigate safely
      setTimeout(() => {
        try {
          navigate('/foodlog');
        } catch (navError) {
          console.error('Navigation error:', navError);
        }
      }, 1000);
    } catch (err) {
      console.error('POST failed:', err);
      setError('❌ Failed to submit food log.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 mb-6">
        <h1 className='text-center pt-6 pb-6 text-2xl md:text-3xl font-bold text-gray-700' >
            <span className='text-lime-400'>T</span>rack <span className='text-lime-400'>F</span>ood</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md border border-lime-200"
      >
        {error && <div className="mb-2 text-red-500 font-medium">{error}</div>}
        {success && <div className="mb-2 text-green-600 font-medium">{success}</div>}

        <div className="mb-4 relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Start typing or Choose Dropdown"
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-lime-400"
          />
          {showDropdown && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 max-h-60 overflow-auto rounded-md shadow">
              {filteredFoodList.length > 0 ? (
                filteredFoodList.map((food) => (
                  <li
                    key={food.id}
                    onClick={() => handleFoodSelect(food)}
                    className="px-4 py-2 hover:bg-lime-100 cursor-pointer"
                  >
                    {food.name}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No matching food</li>
              )}
            </ul>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-lime-400"
          >
            {mealTypes.map((type, index) => (
              <option key={index} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            required
            className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-lime-400"
          />
        </div>

        <button
          type="submit"
          className="bg-lime-500 text-white font-bold px-4 py-2 rounded-md hover:bg-lime-600 transition"
        >
          Submit Log
        </button>
      </form>
    </div>
  );
};

export default FoodLogForm;
