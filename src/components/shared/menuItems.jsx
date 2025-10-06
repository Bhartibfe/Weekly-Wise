/* eslint-disable no-undef */
import {
  BookOpen,
  CheckSquare,
  Layout as LayoutIcon,
  Calendar,
  FileText,
  Activity,
  Plane,
  Link,
} from "lucide-react";
import StaggeredMenu from "../ui/StaggeredMenu";
export const menuItems = [
  { name: "Blogs", path: "/blogs", icon: BookOpen },
  { name: "To Do List", path: "/todo", icon: CheckSquare },
  { name: "Weekly Planner", path: "/weekly", icon: Calendar },
  { name: "Notes", path: "/notes", icon: FileText },
  { name: "Links", path: "/linkspage", icon: Link },
  { name: "Project Planner", path: "/project", icon: LayoutIcon },
  { name: "Habit Tracker", path: "/habit", icon: Activity },
  { name: "Holiday Planner", path: "/holiday", icon: Plane },
];
<div style={{ height: "100vh", background: "#1a1a1a" }}>
  <StaggeredMenu
    position="right"
    items={menuItems}
    socialItems={socialItems}
    displaySocials={true}
    displayItemNumbering={true}
    menuButtonColor="#fff"
    openMenuButtonColor="#fff"
    changeMenuColorOnOpen={true}
    colors={["#B19EEF", "#5227FF"]}
    logoUrl="/path-to-your-logo.svg"
    accentColor="#ff6b6b"
    onMenuOpen={() => console.log("Menu opened")}
    onMenuClose={() => console.log("Menu closed")}
  />
</div>;
