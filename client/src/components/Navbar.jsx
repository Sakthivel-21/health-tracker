import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      if (token) {
        fetchUserProfile();
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const response = await axios.get('http://localhost:8000/auth/profile/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (response.data) {
        setUserProfile(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUserProfile(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserProfile(null);
    window.location.href = '/';
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const ProfileButton = () => {
    if (isLoading) {
      return <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-md"></div>;
    }

    if (!isAuthenticated) {
      return (
        <Link to="/login">
          <button className="bg-lime-400 hover:bg-lime-600 text-black font-semibold px-4 py-2 rounded">
            Login
          </button>
        </Link>
      );
    }

    return (
      <div className="relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center space-x-2 text-lime-500 hover:text-black"
        >
          <div className="w-8 h-8 rounded-full bg-lime-500 flex items-center justify-center text-black">
            {userProfile?.username?.[0]?.toUpperCase() || <User size={20} />}
          </div>
          <span className="hidden md:block text-lime-500">{userProfile?.username}</span>
          <ChevronDown size={16} />
        </button>

        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 z-50">
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-sm hover:bg-lime-600 hover:text-black"
            >
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>Dashboard</span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-500 hover:bg-lime-600 hover:text-black flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  const navItems = [
    { name: 'Home', link: '/' },
    { name: 'Calculate Calories', link: '/foodlogform' },
    { name: 'Contact us', link: '/contactus' },
  ]

  const handleNavigation = (itemName, itemLink) => {
    if (itemName === 'Calculate Calories') {
      const token = localStorage.getItem('token');
      if (token) {
        navigate(itemLink);
      } else {
        navigate('/login');
      }
    } else {
      navigate(itemLink);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md w-full border-b border-lime-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          <Link to="/" className="flex-shrink-0 z-10">
            <h1 className="font-bold text-2xl sm:text-xl md:text-2xl lg:text-3xl text-black">
              <span className='text-lime-400'>H</span>ealth <span className='text-lime-400'>T</span>racker
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <ul className="flex items-center gap-4 lg:gap-6">
              {navItems.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleNavigation(item.name, item.link)}
                    className="text-black hover:text-black transition-colors text-sm lg:text-base font-medium"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
            <ProfileButton />
          </div>

          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-lime-500 z-10 text-lime-500"
            aria-label="Menu"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </nav>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={toggleSidebar}
          />
          <div className="fixed inset-y-0 right-0 w-[280px] bg-white text-black shadow-xl animate-slide-left">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-lime-500">
                <h2 className="text-xl font-semibold text-lime-500">Menu</h2>
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-lime-600"
                >
                  <X className="w-6 h-6 text-lime-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <ul className="p-4 space-y-2">
                  {navItems.map((item, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => {
                          toggleSidebar();
                          handleNavigation(item.name, item.link);
                        }}
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-lime-600 hover:text-black w-full text-left"
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border-t border-lime-500 mt-auto">
                <ProfileButton />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-16" /> {/* Spacer for fixed navbar */}
    </>
  );
};

export default Navbar;
