import { Menu } from "lucide-react";
// import { Home } from "lucide-react";
import Profile from "./Profile";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import TextPressure from "../ui/TextPressure";
const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center p-4">
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
        <Menu className="inline-block mr-2" />
      </div>
      <div style={{ position: "relative", height: "90px" }}>
        <TextPressure
          text=" Weekly Wise"
          flex={true}
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={true}
          textColor="transparent"
          strokeColor="#ff0000"
          minFontSize={90}
          className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold text-center"
        />
      </div>
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
