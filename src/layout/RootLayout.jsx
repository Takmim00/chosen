import React from "react";
import { Outlet, Link, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiMessageSquare } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const RootLayout = () => {
  const location = useLocation();
  const isChatbotPage =
    location.pathname === "/chatbot" || location.pathname === "/ai-assistant";

  return (
    <div
      className={`flex flex-col ${
        isChatbotPage ? "h-screen overflow-hidden" : "min-h-screen justify-between"
      } relative`}
    >
      <Navbar />
      <main className={isChatbotPage ? "flex-1 overflow-hidden flex flex-col" : "flex-1"}>
        <Outlet />
      </main>
      {!isChatbotPage && <Footer />}

      {/* Floating AI Chat Launcher Button (visible on all other pages) */}
      {!isChatbotPage && (
        <aside aria-label="AI Assistant Launcher" className="fixed bottom-6 right-6 z-40">
          <Link
            to="/chatbot"
            className="group flex items-center gap-2.5 bg-[#8A893F] hover:bg-[#7a7935] text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-2 border-white/20"
            title="Chat with ChaskiX AI Assistant"
          >
            <div className="relative">
              <FiMessageSquare className="w-5 h-5" />
              <HiSparkles className="w-3 h-3 text-[#FFAA01] absolute -top-1.5 -right-1.5 animate-bounce" />
            </div>
            <span className="font-semibold text-sm tracking-wide">
              Ask AI
            </span>
          </Link>
        </aside>
      )}
    </div>
  );
};

export default RootLayout;