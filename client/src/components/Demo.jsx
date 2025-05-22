import { useState, useEffect } from 'react';
import Sidebar from './dashboard/Sidebar';
import Schedule from './dashboard/Schedule';
import Report from './dashboard/Report';
import ShoppingList from './dashboard/ShoppingList';
import DailyIntake from './dashboard/DailyIntake';
import Activity from './dashboard/Activity';
import RecipeCard from './dashboard/RecipeCard';
import axios from 'axios';

function Demo() {
  const [username, setUsername] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access'); // or sessionStorage.getItem('access')
        if (!token) {
          console.warn('⚠️ No token found!');
          setUsername('Guest');
          return;
        }

        const response = await axios.get('http://localhost:8000/auth/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('👤 User Profile:', response.data);
        setUsername(response.data.username || 'User');
      } catch (error) {
        console.error('❌ Error fetching profile:', error);
        setUsername('User');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Hello, {loadingProfile ? '...' : username}
          </h1>
          <p className="text-gray-600">You have 8 activities today</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
              <Schedule />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <Report />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5">
                <ShoppingList />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <DailyIntake />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5">
                <Activity />
              </div>
            </div>
          </div>

          <div className="lg:w-64 mt-4 lg:mt-0">
            <RecipeCard />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Demo;
