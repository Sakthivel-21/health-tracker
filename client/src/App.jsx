import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import AddRecord from './pages/AddRecord'
import Records from './pages/Records'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Register from './components/Register'
import Login from './components/Login'
import FoodLog from './pages/FoogLog'
import CalculateCalories from './pages/CalculateCalories'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/addrecord" element={<AddRecord />} />
            <Route path="/records" element={<Records />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/foodlog" element={<FoodLog />} />
            <Route path="/calculatecalories" element={<CalculateCalories />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
