//import { Menu } from "lucide-react";
import { Home } from "lucide-react";
import Profile from "./Profile";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-white shadow-lg">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient-x" />

      <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
        <div className="absolute transform rotate-45 bg-purple-500 w-20 h-20 right-10 top-5" />
        <div className="absolute transform rotate-45 bg-pink-500 w-12 h-12 right-6 top-10" />
        <div className="absolute transform rotate-45 bg-blue-500 w-8 h-8 right-16 top-8" />
      </div>
      <div
        className="text-2xl font-bold flex items-center cursor-pointer text-purple-600 hover:text-purple-700 transition-colors"
        onClick={toggleSidebar}
      >
        <div
          className="font-medium flex items-center gap-2 px-3 py-2 hover:bg-purple-100 text-purple-600 rounded-lg cursor-pointer transition-colors"
          onClick={() => navigate("/")}
        >
          <Home size={25} />
        </div>
      </div>
      <h1 className="text-center text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
        Weekly Wise
      </h1>
      <div className="relative z-10">
        <Profile handleLogout={handleLogout} />
      </div>
    </header>
  );
};

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired, // Ensures toggleSidebar is a required function
};

export default Header;
