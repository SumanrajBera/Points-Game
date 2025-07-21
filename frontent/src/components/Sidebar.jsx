import { Link } from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ collapsed }) {

  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  return (
    <>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="main_links">
          <Link className='sidebar_links' to="/"><i className="ri-dashboard-fill"></i> Dashboard</Link>
          <Link className='sidebar_links' to="/leaderboard"><i className="ri-funds-line"></i> Leaderboard</Link>
          <Link className='sidebar_links' to="/ongoing"><i className="ri-gamepad-fill"></i> Ongoing</Link>
        </div>
        <div className="user_links">
          {!isAuthenticated && (
            <>
              <Link className='sidebar_links' to="/login"><i className="ri-login-circle-line"></i> Login</Link>
              <Link className='sidebar_links' to="/register"><i className="ri-user-add-fill"></i> Register</Link>
            </>
          )
          }

          {
            isAuthenticated && (
              <>
                <button className="logout-btn sidebar_links" onClick={handleLogout}><i className="ri-logout-box-line"></i> <p>Logout</p></button>
              </>
            )
          }
        </div>
      </div>
    </>
  );
}
