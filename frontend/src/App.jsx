
import './App.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateGroup from './pages/CreateGroup.jsx'
import GroupDashboard from './pages/GroupDashboard.jsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/create-group" element={<CreateGroup />} />
        <Route path="/dashboard/group/:id" element={<GroupDashboard />} />
      </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
