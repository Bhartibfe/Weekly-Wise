import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
//import Galaxy from "../ui/Galaxy";
import LiquidEther from "../ui/LiquidEther";
//import { menuItems, sections } from "../shared/menuItems";

const Layout = () => {
  const [setSidebarVisible] = useState(true);
  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  return (
    <div className="min-h-screen relative bg-black">
      <LiquidEther
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          // zIndex: -1,
          pointerEvents: "none",
        }}
      />
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
