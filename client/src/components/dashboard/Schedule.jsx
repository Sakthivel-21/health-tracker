import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format, addDays } from 'date-fns';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mealColors = {
  breakfast: 'bg-red-100 text-red-500',
  lunch: 'bg-yellow-100 text-yellow-600',
  dinner: 'bg-purple-100 text-purple-600',
  snacks: 'bg-green-100 text-green-600',
};

const DEFAULT_SLOTS = 6;

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const getPastFiveDays = () => {
    const days = [];
    for (let i = -2; i <= 2; i++) {
      days.push(addDays(new Date(), i));
    }
    return days;
  };

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8000/health/food-logs/history/', {
          headers: { Authorization: `Token ${token}` },
        });

        const data = res.data;
        let logsForDate = [];

        if (data && data[formattedDate]) {
          logsForDate = data[formattedDate];
        }

        const paddedLogs = [];
        for (let i = 0; i < DEFAULT_SLOTS; i++) {
          paddedLogs.push(logsForDate[i] || null);
        }

        const logsWithTime = paddedLogs.map((log) => {
          if (log) {
            let timeString = '–––';
            try {
              const [hour, minute] = log.timestamp.split(':');
              const parsedDate = new Date();
              parsedDate.setHours(parseInt(hour), parseInt(minute), 0);
              timeString = format(parsedDate, 'hh:mm a');
            } catch (err) {
              console.error('Invalid timestamp:', log.timestamp);
            }

            return {
              ...log,
              time: timeString,
              isEmpty: false,
            };
          } else {
            return {
              food_name: 'No entry',
              meal_type: '',
              calories: '',
              quantity: '',
              time: '',
              isEmpty: true,
            };
          }
        });

        setLogs(logsWithTime);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [formattedDate, token]);

  const renderTimeline = () => {
    return (
      <ul className="relative pl-6 space-y-8">
        {logs.map((log, index) => {
          const nextLog = logs[index + 1];
          const isCurrentFilled = !log?.isEmpty;
          const isNextFilled = nextLog && !nextLog.isEmpty;
          const isNextEmpty = nextLog && nextLog.isEmpty;

          const showGreenLine = isCurrentFilled && isNextFilled;
          const showGrayLine =
            (log.isEmpty && isNextEmpty) || (isCurrentFilled && isNextEmpty);

          return (
            <li key={index} className="relative flex gap-4 items-start">
              {/* Timeline dot and line */}
              <div className="absolute left-0 top-1 flex flex-col items-center">
                {log.isEmpty ? (
                  <>
                    <span className="block w-4 h-4 rounded-full border border-gray-400 bg-white z-10" />
                    {showGrayLine && <div className="w-px h-16 bg-gray-300 mt-1" />}
                  </>
                ) : (
                  <>
                    <CheckCircle className="text-green-500 z-10" size={20} />
                    {showGreenLine && <div className="w-px h-16 bg-green-500 mt-1" />}
                    {showGrayLine && <div className="w-px h-16 bg-gray-300 mt-1" />}
                  </>
                )}
              </div>

              {/* Data Card */}
              <div className="ml-6 flex-1 bg-gray-50 p-4 rounded-xl shadow-sm w-full max-w-3xl">
                <div className="text-sm text-gray-400 mb-1">{log.time || '–––'}</div>
                {log.isEmpty ? (
                  <div className="italic text-gray-400 text-sm">No data entered</div>
                ) : (
                  <div className="text-sm text-gray-700 flex flex-wrap gap-2">
                    <span
                      className={`px-2 py-1 rounded-full font-medium text-xs ${
                        mealColors[log.meal_type] || 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {log.meal_type}
                    </span>
                    <span className="text-gray-800 font-semibold">{log.food_name}</span>
                    <span className="text-gray-500">Calories: {log.calories}</span>
                    <span className="text-gray-500">Qty: {log.quantity}</span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="w-full bg-white rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-bold mb-2">📅 View Daily Schedule</h2>

      {/* Date Picker */}
      <div className="flex justify-between mb-4 gap-1">
        {getPastFiveDays().map((date, i) => {
          const isSelected = format(date, 'yyyy-MM-dd') === formattedDate;
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center px-3 py-1 rounded-lg transition-all text-sm ${
                isSelected ? 'bg-lime-400 text-white font-bold' : 'text-gray-600 hover:bg-yellow-100'
              }`}
            >
              <span className="text-xs">{format(date, 'EEE')}</span>
              <span>{format(date, 'dd')}</span>
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="pr-1">
        {loading ? <p className="text-gray-500">Loading...</p> : renderTimeline()}
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate('/foodlogform')}
          className="px-4 py-2 bg-lime-400 text-gray-700 rounded-lg hover:bg-lime-500"
        >
          Add Data
        </button>
        <button
          onClick={() => navigate('/foodlog')}
          className="px-4 py-2 bg-lime-400 text-gray-700 rounded-lg hover:bg-lime-500"
        >
         View Full History
        </button>
      </div>
    </div>
  );
};

export default Schedule;
