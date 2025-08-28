import React from 'react';

interface NavigationProps {
  currentPage: 'client' | 'chat';
  onNavigate: (page: 'client' | 'chat') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo-section">
          <img
            src="https://hutechsolutions.com/wp-content/uploads/2024/08/hutech-logo-1.svg"
            alt="Hutech Solutions"
            className="hutech-logo"
          />
          <img
            src="https://hutechsolutions.com/wp-content/uploads/2024/08/cmmi-level3-logo.svg"
            alt="CMMI Level 3"
            className="cmmi-logo"
          />
        </div>
        <nav className="navigation-menu">
          <button className="nav-item">Home</button>
          <div className="nav-dropdown">
            <button className="nav-item dropdown-trigger">
              Company ▼
            </button>
          </div>
          <div className="nav-dropdown">
            <button className="nav-item dropdown-trigger">
              Services ▼
            </button>
          </div>
          <div className="nav-dropdown">
            <button className="nav-item dropdown-trigger">
              Industries ▼
            </button>
          </div>
          <button className="nav-item">Blogs</button>
          <button className="nav-item">Careers</button>
          <button className="nav-item">Case Studies</button>
          <button 
            className={`nav-item chat-button ${currentPage === 'chat' ? 'active' : ''}`}
            onClick={() => onNavigate(currentPage === 'chat' ? 'client' : 'chat')}
          >
            Chat
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
