
import './App.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateGroup from './pages/CreateGroup.jsx'
import GroupDashboard from './pages/GroupDashboard.jsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AddExpense from './pages/AddExpense.jsx'
import InviteToGroup from './pages/redirection_pages/inviteToGroup.jsx'
import UserActivity from './pages/UserActivity.jsx'
import Profile from './pages/Users/Profile.jsx'
function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/create-group" element={<CreateGroup />} />
        <Route path="/dashboard/group/:id" element={<GroupDashboard />} />
        <Route path="/add-expense/:id" element={<AddExpense />} />
        <Route path="/group/invite/:id" element={<InviteToGroup />} />
        <Route path="/dashboard/activity" element={<UserActivity />} />
        <Route path="/dashboard/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
