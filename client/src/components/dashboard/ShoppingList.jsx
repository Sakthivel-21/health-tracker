
// components/ShoppingList.jsx
function ShoppingList() {
  const groceryItems = [
    { id: 1, name: 'Avocados', emoji: '🥑', quantity: '2 pc', checked: true },
    { id: 2, name: 'Salmon fillets', emoji: '🐟', quantity: '2 x 150g', checked: true },
    { id: 3, name: 'Yogurt', emoji: '🥛', quantity: '200g', checked: false, suggested: true },
    { id: 4, name: 'Dark chocolate almonds', emoji: '🍫', quantity: '50g', checked: false },
    { id: 5, name: 'Red Onion', emoji: '🧅', quantity: '1/4 piece', checked: false },
    { id: 6, name: 'Lettuce', emoji: '🥬', quantity: '2 pc', checked: false }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Shopping list</h2>
        <span className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs">2</span>
      </div>
      
      <div className="space-y-3 mb-4">
        {groceryItems.map((item) => (
          <div key={item.id} className="flex items-center">
            <input 
              type="checkbox" 
              checked={item.checked} 
              onChange={() => {}}
              className="w-5 h-5 rounded border-gray-300 text-green-500 mr-3"
            />
            <span className="text-xl mr-2">{item.emoji}</span>
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <span className="font-medium">{item.name}</span>
                  {item.suggested && (
                    <span className="ml-2 text-xs text-blue-500">AI Suggested</span>
                  )}
                </div>
                <span className="text-sm text-gray-500">{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full py-2 px-4 bg-yellow-400 hover:bg-yellow-500 text-center rounded-lg font-medium">
        Shop Now
      </button>
    </div>
  );
}

export default ShoppingList;
