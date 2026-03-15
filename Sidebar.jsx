import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarButton from "./SubComponents/SidebarButton";
import WDCLogo from "./SubComponents/WDCLogo";

import { clearAuthToken } from "../api/client";

const Sidebar = ({ screens, activePath, children }) => {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    clearAuthToken();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex h-full w-64 flex-col text-black border-r-[1px] border-black border-opacity-25 overflow-hidden">
        <div className="ml-5 pb-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="appearance-none border-none bg-transparent p-0 m-0 cursor-pointer"
          >
            <WDCLogo />
          </button>
        </div>

        <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <ul>
            {screens.map((screen, index) => (
              <li key={index}>
                <SidebarButton
                  selected={screen.path === activePath}
                  onClick={() => navigate(screen.path)}
                >
                  {{
                    icon: screen.icon,
                    name: screen.name,
                  }}
                </SidebarButton>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto border-t border-black/10">
          <SidebarButton
            selected={false}
            onClick={() => setLogoutOpen(true)}
            inactiveClassName="text-red-600 hover:text-red-700"
            indicatorClassName="bg-red-600"
            className="hover:bg-red-50"
          >
            Logout
          </SidebarButton>
        </div>
      </div>

      {logoutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm logout"
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-[24px] font-[400] text-[#0B0D0E] mb-3">
              Confirm logout
            </h2>
            <p className="text-[18px] font-[400] text-[#0B0D0E] mb-5">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="flex-1 h-full min-h-0 overflow-hidden">{children}</main>
    </div>
  );
};

export default Sidebar;
