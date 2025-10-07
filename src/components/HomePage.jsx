import { useNavigate } from "react-router-dom";
import MagicBento from "./ui/MagicBento";
import {
  BookOpen,
  CheckSquare,
  Calendar,
  FileText,
  Link,
  Plane,
} from "lucide-react";

const cardData = [
  {
    title: "Blogs",
    description: "Read latest posts",
    icon: BookOpen,
    path: "/blogs",
  },
  {
    title: "Task List",
    description: "Track your tasks",
    icon: CheckSquare,
    path: "/todo",
  },
  {
    title: "Weekly Planner",
    description: "Plan your week",
    icon: Calendar,
    path: "/weekly",
  },
  {
    title: "Notes",
    description: "Keep your notes",
    icon: FileText,
    path: "/notes",
  },
  {
    title: "Links",
    description: "Your quick links",
    icon: Link,
    path: "/linkspage",
  },
  {
    title: "Trip Planner",
    description: "Plan your trips",
    icon: Plane,
    path: "/project",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto w-full h-full flex-1">
        <MagicBento
          cards={cardData}
          enableStars
          enableSpotlight
          enableBorderGlow
          enableTilt
          clickEffect
          enableMagnetism
          textAutoHide={false}
          particleCount={12}
          glowColor="180, 120, 255"
          onCardClick={(path) => navigate(path)} // ✅ pass callback here
        />
      </div>
    </div>
  );
};

export default HomePage;
