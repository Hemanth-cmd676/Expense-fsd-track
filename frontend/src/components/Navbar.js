import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // Link to the external CSS file

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar-oldmoney">
      <h3 className="logo-oldmoney">Expense Tracker</h3>
      <div className="nav-links-oldmoney">
        <Link to="/home" className="nav-link-oldmoney">Home</Link>
        <Link to="/profile" className="nav-link-oldmoney">Profile</Link>
        <Link to="/group" className="nav-link-oldmoney">Group</Link>
        <span onClick={handleLogout} className="nav-link-oldmoney logout-link">
          Logout
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
