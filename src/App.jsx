import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard';
import Overview from './pages/Dashboard/Overview';
import Transactions from './pages/Dashboard/Transactions';
import Alerts from './pages/Dashboard/Alerts';
import Goals from './pages/Dashboard/Goals';
import UserDetails from './pages/Dashboard/UserDetails';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Overview />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="goals" element={<Goals />} />
              <Route path="user-details" element={<UserDetails />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
