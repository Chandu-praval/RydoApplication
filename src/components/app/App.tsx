import { Route,Routes } from 'react-router-dom'
import './App.css'
import LoginPage from '../loginPage/LoginPage'
import ProtectedRoute from '../routes/ProtectedRoute'
import Signup from '../signup/Signup'
import Header from '../header/Header'
import LandingPage from '../landingPage/LandingPage'
import DriverLandingPage from '../DriverLandingPage/DriverLandingPage'
import RideList from '../rideList/RideList'
import Profile from '../profile/Profile';
import Maps from '../maps/Maps'
function App() {
  return (
    <>
      <Header />
      <Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/rideList" element={<RideList />} />
<Route
  path="/maps"
  element={
    <ProtectedRoute allowedRoles={["user", "driver"]}>
      <Maps />
    </ProtectedRoute>
  }
/>
  <Route
    path="/profile"
    element={
      <ProtectedRoute allowedRoles={["user", "driver"]}>
        <Profile />
      </ProtectedRoute>
    }
  />
  <Route
    path="/user"
    element={
      <ProtectedRoute allowedRoles={["user"]}>
        <LandingPage />
      </ProtectedRoute>
    }
  />
  <Route
    path="/driver"
    element={
      <ProtectedRoute allowedRoles={["driver"]}>
        <DriverLandingPage />
      </ProtectedRoute>
    }
  />
</Routes>
    </>
  )
}


export default App
