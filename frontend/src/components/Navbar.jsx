import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">LungCare AI</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/analyze">Analyze</Link></li>
        <li><Link to="/history">History</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;