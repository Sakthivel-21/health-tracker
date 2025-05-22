import React, { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Schedule from "../components/dashboard/Schedule";
import Report from "../components/dashboard/Report";
import WeeklySummary from "../components/dashboard/WeeklySummary";
import Activity from "../components/dashboard/Activity";
import FoodLog from "./FoogLog";
import TopFood from "../components/dashboard/TopFood";

const Dashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState(null); // null = show all

  const renderContent = () => {
    if (selectedComponent === "Daily Data") return <FoodLog />;
    if (selectedComponent === "Health Report") return <Report />;
    if (selectedComponent === "Top Food") return <TopFood />;
    if (selectedComponent === "WeeklySummary") return <WeeklySummary />;

    // Default: show all components in a responsive grid
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left column */}
        <div>
          <Schedule />
        </div>

        {/* Right column: Report + WeeklySummary stacked */}
        <div className="space-y-4">
          <Report />
          <WeeklySummary />
        </div>

        {/* Full-width bottom: Activity + TopFood */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Activity />
          <TopFood />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar: responsive within itself (mobile toggle built-in) */}
      <Sidebar onSelect={setSelectedComponent} active={selectedComponent} />

      {/* Main content area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
