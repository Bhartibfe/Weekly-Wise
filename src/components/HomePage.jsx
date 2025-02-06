import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronsRight, Menu, Home } from 'lucide-react';
import Profile from './Profile';
import { useAuth } from './AuthProvider'; // Add this import

const HomePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get logout from useAuth
  const [activeSection, setActiveSection] = useState(null);
  const [showContent, setShowContent] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'blogs', path: '/blogs' },
    { name: 'to do list', path: '/todo' },
    { name: 'Project planer', path: '/project' },
    { name: 'weekly planer', path: '/weekly' },
    { name: 'Notes', path: '/notes' },
    { name: 'Habit tracker', path: '/habit' },
    { name: 'Holiday planer', path: '/holiday' },
  ];

  const sections = ['Create', 'Important', 'Confidential'];

  const handleSectionClick = (section) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
      setShowContent(true);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[url('src/assets/images/bgs.jpeg')] text-[#EEEEEE]">
      {/* Navigation header */}
      <header className="flex justify-between items-center p-4 bg-[#31363F] text-[#EEEEEE] border-b border-gray-700">
        <div
          className="text-2xl font-bold flex items-center cursor-pointer"
          onClick={toggleSidebar}
        >
          <Menu className="inline-block mr-2" />
        </div>
        <h1 className="text-center text-4xl font-bold">Weekly Wise</h1>
        <Profile handleLogout={handleLogout} />
      </header>

      <div className="flex">
        {sidebarVisible && (
          <aside className="w-64 bg-[#31363F] text-[#EEEEEE] border-r border-gray-700 min-h-screen p-4">
            <div className="space-y-2">
              <div 
                className="font-medium flex items-center gap-2 px-2 py-1 hover:bg-[#76ABAE] hover:text-[#222831] rounded cursor-pointer"
                onClick={() => navigate('/')}
              >
                <Home size={18} />
                Home
              </div>

              {sections.map((section) => (
                <div key={section} className="space-y-1">
                  <div
                    className="font-medium flex items-center gap-2 px-2 py-1 hover:bg-[#76ABAE] hover:text-[#222831] rounded cursor-pointer"
                    onClick={() => handleSectionClick(section)}
                  >
                    {activeSection === section ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronsRight size={18} />
                    )}
                    {section}
                  </div>
                  {activeSection === section && (
                    <div className="ml-6 space-y-1">
                      {menuItems.map((item) => (
                        <div
                          key={item.path}
                          className="text-[#EEEEEE] hover:bg-[#76ABAE] hover:text-[#222831] px-2 py-1 rounded cursor-pointer"
                          onClick={() => handleItemClick(item.path)}
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>
        )}

        <main className="flex-1 p-8">
          {showContent && (
            <div className="grid grid-cols-4 gap-6">
              {menuItems.map((item) => (
                <div
                  key={item.path}
                  className="bg-[#31363F] rounded-lg border border-gray-600 p-6 h-48 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-[#76ABAE] hover:text-[#222831]"
                  onClick={() => handleItemClick(item.path)}
                >
                  <span className="text-lg">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;