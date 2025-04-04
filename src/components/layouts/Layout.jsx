// // Layout.propTypes = {
// // 	children: PropTypes.node.isRequired, // Ensures 'children' is a required React node

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronsRight, Home } from "lucide-react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { menuItems, sections } from "../shared/menuItems";

const Layout = () => {
	const navigate = useNavigate();
	const [activeSection, setActiveSection] = useState(null);
	const [sidebarVisible, setSidebarVisible] = useState(true);

	const handleSectionClick = (section) => {
		setActiveSection(activeSection === section ? null : section);
	};

	const toggleSidebar = () => {
		setSidebarVisible((prev) => !prev);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
			<Header toggleSidebar={toggleSidebar} />

			<div className="flex">
				{sidebarVisible && (
					<aside className="w-64 bg-white/80 backdrop-blur-sm min-h-screen p-4 shadow-lg">
						<div className="space-y-3">
							{/* Home link */}
							<div
								className="font-medium flex items-center gap-2 px-3 py-2 hover:bg-purple-100 text-purple-600 rounded-lg cursor-pointer transition-colors"
								onClick={() => navigate("/")}
							>
								<Home size={18} />
								<span>Home</span>
							</div>

							{sections.map((section) => (
								<div key={section} className="space-y-1">
									<div
										className="font-medium flex items-center gap-2 px-3 py-2 hover:bg-purple-100 text-purple-600 rounded-lg cursor-pointer transition-colors"
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
													className="text-gray-600 hover:bg-purple-100 hover:text-purple-600 px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2"
													onClick={() => navigate(item.path)}
												>
													<item.icon size={16} />
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

				<main className="flex-1">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Layout;
