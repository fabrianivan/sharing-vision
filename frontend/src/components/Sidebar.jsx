import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Sharing Vision</h1>
        <span>Article Manager</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">📋</span>
          All Posts
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">✏️</span>
          Add New
        </NavLink>
        <NavLink to="/preview" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">👁️</span>
          Preview
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        © 2023 Sharing Vision
      </div>
    </aside>
  );
}

export default Sidebar;
