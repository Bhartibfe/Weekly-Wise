import { useNavigate } from "react-router-dom";
import SpotlightCard from "./ui/SpotlightCard";

import {
  BookOpen,
  CheckSquare,
  Layout,
  Calendar,
  FileText,
  Activity,
  Plane,
  Link,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Blogs", path: "/blogs", icon: BookOpen },
    { name: "To Do List", path: "/todo", icon: CheckSquare },
    { name: "Weekly Planner", path: "/weekly", icon: Calendar },
    { name: "Notes", path: "/notes", icon: FileText },
    { name: "Link", path: "/linkspage", icon: Link },
    { name: "Project Planner", path: "/project", icon: Layout },
    { name: "Habit Tracker", path: "/habit", icon: Activity },
    { name: "Holiday Planner", path: "/holiday", icon: Plane },
  ];

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <SpotlightCard
                key={item.path}
                className="custom-spotlight-card cursor-pointer"
                spotlightColor="rgba(255, 255, 255, 0.25)"
                onClick={() => handleItemClick(item.path)}
              >
                <div className="flex flex-col items-center justify-center h-48">
                  <item.icon
                    size={32}
                    className="text-purple-500 group-hover:text-white mb-4 transition-colors"
                  />
                  <span className="text-lg font-medium text-gray-700 group-hover:text-white transition-colors">
                    {item.name}
                  </span>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
