import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import HomePage from './components/HomePage';
import HistoryPage from './components/HistoryPage';
import StatsPage from './components/StatsPage';
import SettingsPage from './components/SettingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default App;
