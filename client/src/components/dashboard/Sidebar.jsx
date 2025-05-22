import React, { useEffect, useState } from "react";
import axios from "axios";
import { Menu } from "lucide-react";

const Sidebar = ({ onSelect, active }) => {
  const [user, setUser] = useState({ name: "Loading..." });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/auth/profile/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setUser({ name: res.data.name || res.data.username || "User" });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchUser();
  }, []);

  const navItems = [
    { label: "Dashboard", value: null },
    { label: "Daily Data", value: "Daily Data" },
    { label: "Health Report", value: "Health Report" },
    { label: "Top Food", value: "Top Food" },
    { label: "WeeklySummary", value: "WeeklySummary" },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-lime-200 p-4 shadow-md">
        <h2 className="text-lg font-semibold truncate w-5/6">
          Welcome {user.name}!
        </h2>
        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          <Menu className="h-6 w-6 text-black" />
        </button>
      </div>

      {/* Sidebar - responsive handling */}
      <div
        className={`${
          isOpen ? "block absolute top-16 left-0 w-full z-50" : "hidden"
        } md:block md:relative md:w-64 bg-lime-100 text-black p-6 shadow-md md:min-h-screen`}
      >
        {/* Desktop greeting */}
        <div className="mb-10 hidden md:block">
          <h2 className="text-2xl font-bold">Welcome {user.name}!</h2>
        </div>

        {/* Mobile greeting (inside dropdown) */}
        <div className="mb-6 md:hidden block text-xl font-semibold">
          Hello, {user.name}!
        </div>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onSelect(item.value);
                setIsOpen(false); // close on mobile tap
              }}
              className={`block w-full text-left px-3 py-2 rounded-md font-medium ${
                active === item.value
                  ? "bg-lime-300 text-white"
                  : "hover:bg-lime-200 text-gray-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
