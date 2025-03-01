import { Link } from "react-router";
import "../styles/navbar.css";

export function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        
        <li>
          <Link to="/">
            Home
          </Link>
        </li>

        <li>
          <Link to="/about">
            About
          </Link>
        </li>

        {/* An example on how to continue the resources */}
        {/* <li>
          <Link to="/resources" className="text-white hover:text-gray-400">
            Resources
          </Link>   
        </li> */}

      </ul>
    </nav>
  );
}
