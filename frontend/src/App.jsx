
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <Navbar />
    <div className="container mx-auto p-4">
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        
        <Route path="/profile" element={ <ProtectedRoute><Profile /> </ProtectedRoute>} />
        <Route path="/admin" element={ <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/register" element={<PublicRoute><Register/></PublicRoute>}/>
      </Routes>
    </div>
  </Router>
  )
}

export default App
