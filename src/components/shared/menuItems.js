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

export const sections = ["Create", "Important", "Confidential"];
