import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const menuItems = [
  {
    label: "Dashboard",
    path: "/home/dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
      </svg>
    ),
  },
  {
    label: "Academic",
    path: "/home/academic",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6l-8 4 8 4 8-4-8-4zm0 7l-8 4 8 4 8-4-8-4z" />
      </svg>
    ),
  },
  {
    label: "Marketplace",
    path: "/home/marketplace",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18l-2 11H5L3 7zm5 0V5a4 4 0 018 0v2" />
      </svg>
    ),
  },
  {
    label: "Reporter",
    path: "/home/reporter",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0c0 4-4 7-7 7s-7-3-7-7 4-7 7-7 7 3 7 7z" />
      </svg>
    ),
  },
  {
    label: "Events",
    path: "/home/events",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V11H3v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Profile",
    path: "/home/profile",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">

        <div className="logo-box">
          <span className="logo-letter">A</span>
        </div>

        <div>
          <p className="logo-small">Campus</p>
          <p className="logo-title">Aurora Portal</p>
        </div>

      </div>

      <nav className="sidebar-nav">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

      </nav>

    </aside>
  );
}

export default Sidebar;
