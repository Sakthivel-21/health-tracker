
// components/DailyIntake.jsx
function DailyIntake() {
  const nutritionData = {
    carbs: { value: 70, color: 'from-green-300 to-green-500' },
    protein: { value: 90, color: 'from-orange-300 to-orange-500' },
    fiber: { value: 300, color: 'from-purple-300 to-purple-500' }
  };
  
  return (
    <div>
      <div className="flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <h2 className="text-lg font-semibold">Daily intake</h2>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(nutritionData).map(([key, data]) => (
          <div key={key} className="flex flex-col items-center">
            <div className="relative h-20 w-4 bg-gray-100 rounded-full mb-1">
              <div 
                className={`absolute bottom-0 w-full rounded-full bg-gradient-to-t ${data.color}`}
                style={{ height: `${data.value}%` }}
              ></div>
            </div>
            <p className="font-semibold text-sm">{data.value}</p>
            <p className="text-xs text-gray-500 capitalize">{key}</p>
          </div>
        ))}
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <h3 className="text-sm font-medium">Water 2.5/3.1L</h3>
        </div>
        
        <div className="flex space-x-2 mb-2">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`flex-1 h-12 rounded-lg ${i <= 3 ? 'bg-blue-400' : 'bg-blue-100'} relative`}
            >
              {i <= 3 && (
                <div className="absolute top-1 right-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DailyIntake;
