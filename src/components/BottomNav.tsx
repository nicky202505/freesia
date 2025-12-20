import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, History, BarChart3, Settings } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: Home, label: '홈' },
    { path: '/history', icon: History, label: '히스토리' },
    { path: '/stats', icon: BarChart3, label: '통계' },
    { path: '/settings', icon: Settings, label: '설정' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={24} />
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
