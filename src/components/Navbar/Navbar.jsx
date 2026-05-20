import { useAuth } from "../../context/useAuth";
import "./Navbar.css";

function Navbar({ onLogout }) {
  const { currentUser } = useAuth();
  
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure?");

    if (confirmLogout) {
      onLogout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="https://tse1.mm.bing.net/th/id/OIP.j-9bhZiTC9nh9RGXOsl8lwAAAA?pid=Api&P=0&h=180"
          alt="college logo"
          className="college-logo"
        />
        <div className="college-info">
          <p className="college-name">
            Aurora College
          </p>
          <p className="college-tagline">
            Temple of Learning
          </p>
        </div>
      </div>

      <div className="navbar-right">
        {currentUser && (
          <div className="student-info" style={{ marginRight: '20px', textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{currentUser.userId}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>{currentUser.studentId}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
