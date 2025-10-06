import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
//import { menuItems, sections } from "../shared/menuItems";

const Layout = () => {
  const [setSidebarVisible] = useState(true);
  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
