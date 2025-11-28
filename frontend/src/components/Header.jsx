import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Truck, Package, User, Plus } from "lucide-react";
import "./Header.css"; 
import logo from "../assets/logo.png";

export default function Header() {
  const navigate = useNavigate();

  return (
    <>
      {/* DESKTOP HEADER */}
      <header className="desktop-header">
        <div className="site-header-inner">
          <div className="brand">
            {/* LOGO BARU MENGGUNAKAN FILE LOCAL */}
            <img
              src={logo}
              alt="logo"
              className="logo"
              style={{ 
                height: '75px',
                width: 'auto',
                minWidth: '0px',
                objectFit: 'contain'
              }}
            />

            <div className="brand-text">
              <div className="brand-title">ANJAS</div>
              <div className="muted">Antar Jemput & Jasa Titip</div>
            </div>
          </div>

          <nav className="nav-links">
            <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Beranda
            </NavLink>
            <NavLink to="/anjem" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Antar Jemput
            </NavLink>
            <NavLink to="/jastip" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Jasa Titip
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Profile
            </NavLink>
          </nav>

          <div className="header-actions">
            <button className="cta-button" onClick={() => navigate("/add")}>
              <Plus size={16} style={{ marginRight: 8 }} /> Tambah
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-bottom-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? "mobile-item active" : "mobile-item")}>
          <Home size={22} />
          <span>Beranda</span>
        </NavLink>

        <NavLink to="/anjem" className={({ isActive }) => (isActive ? "mobile-item active" : "mobile-item")}>
          <Truck size={22} />
          <span>Anjem</span>
        </NavLink>

        <NavLink to="/jastip" className={({ isActive }) => (isActive ? "mobile-item active" : "mobile-item")}>
          <Package size={22} />
          <span>Jastip</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => (isActive ? "mobile-item active" : "mobile-item")}>
          <User size={22} />
          <span>Profile</span>
        </NavLink>
      </nav>

      {/* FLOAT BUTTON MOBILE */}
      <button className="fab-add" onClick={() => navigate("/add")}>
        <Plus size={24} />
      </button>
    </>
  );
}
