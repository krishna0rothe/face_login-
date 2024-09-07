import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar = () => {
  return (
    <div className="navbar-container">
      <div className="navbar">
        <h2 className="navbar-title">Safe Exam Browser</h2>
        <ul className="navbar-sections">
          <li>
            <NavLink to="/dashboard" activeClassName="active-link">
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/exams" activeClassName="active-link">
              Exams
            </NavLink>
          </li>
          <li>
            <NavLink to="/results" activeClassName="active-link">
              Results
            </NavLink>
          </li>
          <li>
            <NavLink to="/cheating-attempts" activeClassName="active-link">
              Cheating Attempts
            </NavLink>
          </li>
          <li>
            <NavLink to="/access-management" activeClassName="active-link">
              Exam Access Management 
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="topbar">
        <input className="search-bar" type="text" placeholder="Search..." />
        <div className="profile-section">Profile</div>
      </div>
    </div>
  );
};

export default NavBar;
