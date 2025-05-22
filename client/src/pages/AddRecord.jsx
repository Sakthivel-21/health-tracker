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
        const userRes = await axios.get('http://localhost:8000/auth/profile/', {
          headers: { Authorization: `Token ${token}` },
        });
        setUser(userRes.data);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 border border-lime-300">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Enter Your Health Info
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-600">Username</label>
            <input
              type="text"
              value={user.username || ''}
              disabled
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Daily Calorie Limit</label>
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

         
            <div className="text-center mt-4">
              <p className="text-gray-600 mb-2">
                You already submitted your health data.
              </p>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded"
              >
                Skip
              </button>
            </div>
      
        </form>
      </div>
    </div>
  );
};

export default AddRecord;
