import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import LiquidEther from "../ui/LiquidEther";
import { menuItems } from "../shared/menuItems";
import { Home } from "lucide-react";

const Layout = () => {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  return (
    <div className="h-screen flex flex-col relative bg-black overflow-hidden">
      <LiquidEther
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Fixed Header */}
      <Header toggleSidebar={toggleSidebar} isSidebarVisible={sidebarVisible} />

      {/* Content Area with Sidebar and Main */}
      <div className="flex flex-1 overflow-hidden">
        {sidebarVisible && (
          <aside className="w-64 bg-#03030A backdrop-blur-lg h-full p-4 shadow-2xl border-r border-purple-500/30 overflow-y-auto">
            <div className="space-y-2">
              {/* Home link */}
              <div
                className="group font-medium flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 text-gray-300 hover:text-white rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10"
                onClick={() => navigate("/")}
              >
                <Home
                  size={20}
                  className="group-hover:text-purple-400 transition-colors"
                />
                <span className="group-hover:translate-x-1 transition-transform">
                  Home
                </span>
              </div>

              {/* Divider */}
              <div className="my-4 px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
              </div>

              {/* Menu Items */}
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <div
                    key={item.path}
                    className="group font-medium flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 text-gray-300 hover:text-white rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10"
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon
                      size={20}
                      className="group-hover:text-purple-400 transition-colors"
                    />
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
