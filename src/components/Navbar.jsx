import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import logo from "../assets/img/logo.png";
import { FiMessageSquare, FiMenu, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isChatbot = location.pathname === "/chatbot" || location.pathname === "/ai-assistant";

  return (
    <nav className="relative z-40 bg-white">
      <div className="bg-[#8A893F] w-full h-4"></div>
      <div className="navbar px-4 sm:px-6 py-2 bg-base-100 shadow-sm border-b border-stone-100 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="navbar-start flex items-center gap-2">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-[#848239] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>

          <Link to="/" className="flex items-center gap-2 text-[#8A893F] font-bold text-xl">
            <img src={logo} alt="ChaskiX logo" className="h-12 sm:h-14 object-contain" />
            <span className="text-[#848239] text-2xl sm:text-3xl font-bold tracking-tight">
              ChaskiX
            </span>
          </Link>
        </div>

        {/* Center: Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-black font-semibold text-[17px] gap-1">
            <li>
              <Link
                to="/"
                className={`transition-colors ${
                  location.pathname === "/" ? "text-[#848239] font-bold" : "hover:text-[#848239]"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/chatbot"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isChatbot
                    ? "bg-[#8A893F] text-white shadow-sm font-bold"
                    : "text-[#848239] bg-[#8A893F]/10 hover:bg-[#8A893F]/20 font-bold"
                }`}
              >
                <HiSparkles className="w-4 h-4 text-[#FFAA01]" />
                <span>AI Chatbot</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FFAA01] text-black font-bold uppercase tracking-wider">
                  New
                </span>
              </Link>
            </li>
            <li>
              <Link to="/#pricing" className="hover:text-[#848239]">Pricing</Link>
            </li>
            <li>
              <Link to="/#forum" className="hover:text-[#848239]">Forum</Link>
            </li>
            <li>
              <Link to="/#community" className="hover:text-[#848239]">Service Community</Link>
            </li>
            <li>
              <Link to="/#contact" className="hover:text-[#848239]">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Right: Actions */}
        <div className="navbar-end flex items-center gap-2">
          {/* AI Chatbot quick pill for tablets/smaller screens */}
          <Link
            to="/chatbot"
            className="hidden sm:inline-flex lg:hidden items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-[#8A893F]/15 text-[#848239] hover:bg-[#8A893F]/25 transition-colors"
          >
            <FiMessageSquare className="w-4 h-4" />
            <span>AI Bot</span>
          </Link>

          <button className="btn bg-[#8A893F] text-white border-none px-6 sm:px-8 font-medium hover:bg-[#7a7935] shadow-xs cursor-pointer flex items-center gap-2">
            <span>Login</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-stone-200 bg-white px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-stone-800 hover:bg-stone-100"
          >
            Home
          </Link>
          <Link
            to="/chatbot"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-md font-bold text-white bg-[#8A893F] hover:bg-[#7a7935]"
          >
            <div className="flex items-center gap-2">
              <HiSparkles className="w-4 h-4 text-[#FFAA01]" />
              <span>ChaskiX AI Chatbot</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFAA01] text-black font-extrabold uppercase">
              Gemini
            </span>
          </Link>
          <Link
            to="/#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-stone-700 hover:bg-stone-100"
          >
            Pricing
          </Link>
          <Link
            to="/#forum"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-stone-700 hover:bg-stone-100"
          >
            Forum
          </Link>
          <Link
            to="/#community"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-stone-700 hover:bg-stone-100"
          >
            Service Community
          </Link>
          <Link
            to="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-stone-700 hover:bg-stone-100"
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
