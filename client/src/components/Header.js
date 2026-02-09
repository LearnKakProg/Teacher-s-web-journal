import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');


  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);


  useEffect(() => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      API.get('/users/search', { params: { q: searchQuery } })
        .then(res => setResults(res.data))
        .catch(err => console.error(err));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const goToTeacherDashboard = () => navigate('/teacher')
  
  const handleResultClick = (userId) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="header-panel">
      <div className="header-content">
        
        <Link to="/" className="header-link">
          <h3>Школьный портал</h3>
        </Link>

        {token && (
          <div className="search-container" ref={searchRef}>
            <input
              type="text"
              className="search-input"
              placeholder="Найти ученика..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
            
            {showDropdown && results.length > 0 && (
              <ul className="search-dropdown">
                {results.map(user => (
                  <li 
                    key={user._id} 
                    onClick={() => handleResultClick(user._id)}
                    className="search-result-item"
                  >
                    {user.name} <span className="search-role">({user.role})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="header-actions">
          {role === 'admin' && (
            <button 
              className="admin-panel-btn" 
              onClick={() => navigate('/admin')}
            >
              Панель управления
            </button>
          )}

          {(role === 'teacher' || role === 'admin') && (
            <button
              className="teacher-dashboard-btn"
              onClick={goToTeacherDashboard}
            >
              Панель учителя
            </button>
          )}

          {token && (
            <button className="logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          )}
        </div>
      </div>
    </div>
  );
}