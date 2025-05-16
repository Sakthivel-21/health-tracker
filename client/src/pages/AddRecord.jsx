import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddRecord = () => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [dailyLimit, setDailyLimit] = useState('');
  const [user, setUser] = useState({});
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get user info
        const userRes = await axios.get('http://localhost:8000/auth/profile/', {
          headers: { Authorization: `Token ${token}` },
        });
        setUser(userRes.data);

        // 2. Check if health data already exists
        const healthRes = await axios.get('http://localhost:8000/auth/user-health/', {
          headers: { Authorization: `Token ${token}` },
        });

        const found = healthRes.data.find((item) => item.user === userRes.data.id);
        setAlreadySubmitted(!!found);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (token) fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8000/auth/user-health/',
        {
          user: user.id,
          age: parseInt(age),
          weight: parseFloat(weight),
          daily_calorie_limit: parseInt(dailyLimit),
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      alert('Health data submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error submitting health data:', error);
      alert('Error: Unable to submit');
    }
  };

  return (
    <div className="text-gray-800 p-6">
      <h1 className="lg:text-2xl text-xl font-bold text-gray-700 text-center mb-8">
        Enter Your Health Info
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-8 shadow-lg mb-6 rounded-xl border border-lime-200 space-y-6"
      >
        <div>
          <label className="block mb-1 font-base text-gray-600">Username</label>
          <input
            type="text"
            value={user.username || ''}
            disabled
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block mb-1 font-base text-gray-600">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-base text-gray-600">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-base text-gray-600">Daily Calorie Limit</label>
          <input
            type="number"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold py-2 rounded transition"
        >
          Submit
        </button>

        <div className="max-w-md mx-auto text-center mt-4">
          <p className="text-gray-600 mb-3">
            You already gave your health data. If you want, you can skip now.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded"
          >
            Skip
          </button>
        </div>

      </form>

    
        
     
    </div>
  );
};

export default AddRecord;
