import { useNavigate } from "react-router-dom";
import {
	Heart,
	Edit,
	Trash2,
	MoreVertical,
	Pin,
	Clock,
	Share2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const BlogCard = ({ blog, onLike, onDelete, onPin }) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const navigate = useNavigate();
	const dropdownRef = useRef(null);
	const buttonRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target)
			) {
				setShowDropdown(false);
			}
		};

		if (showDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showDropdown]);

	const handleCardClick = () => {
		navigate(`/blogs/blog/${blog.id}`);
	};

	const handleDelete = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (window.confirm("Are you sure you want to delete this blog?")) {
			onDelete(blog.id);
		}
		setShowDropdown(false);
	};

	const previewContent = (content) => {
		const div = document.createElement("div");
		div.innerHTML = content;
		const text = div.textContent || div.innerText;
		const words = text.split(" ").slice(0, 20).join(" ");
		return words + (text.split(" ").length > 20 ? "..." : "");
	};

	const formatDate = (dateString) => {
		const options = {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		};
		return new Date(dateString).toLocaleString("en-US", options);
	};

	const capitalizeFirstWord = (title) => {
		const words = title.split(" ");
		if (words.length > 0) {
			words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
		}
		return words.join(" ");
	};

	const handleEditClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		navigate(`/blogs/edit/${blog.id}`);
		setShowDropdown(false);
	};

	return (
		<div
			onClick={handleCardClick}
			className={`group relative p-0 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 
        ${isHovered ? "shadow-xl transform -translate-y-1" : ""} 
        ${blog.isPinned ? "ring-2 ring-purple-300" : ""}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md z-0" />
			<div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-200/30 via-pink-200/30 to-blue-200/30 rounded-full blur-2xl transform rotate-45 transition-transform duration-500 group-hover:rotate-90" />
			<div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-blue-200/20 via-purple-200/20 to-pink-200/20 rounded-full blur-xl transition-transform duration-500 group-hover:translate-x-4" />
			<div
				className={`h-1 w-full ${
					blog.isPinned
						? "bg-gradient-to-r from-purple-500 to-pink-500"
						: "bg-gradient-to-r from-blue-500 to-purple-500"
				}`}
			/>
			<div className="p-6 relative z-10">
				<div className="flex justify-between items-start mb-3">
					<h2 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent relative group-hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500 after:w-0 after:transition-all after:duration-300">
						{capitalizeFirstWord(blog.title)}
					</h2>
					<div className="relative">
						<button
							ref={buttonRef}
							className="p-2 text-gray-400 hover:text-purple-500 transition-colors duration-200 rounded-full hover:bg-purple-50"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setShowDropdown(!showDropdown);
							}}
						>
							<MoreVertical size={18} />
						</button>

						{showDropdown && (
							<div
								ref={dropdownRef}
								className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-50 w-36 overflow-hidden"
								onClick={(e) => e.stopPropagation()}
							>
								<button
									className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full transition-colors border-b border-gray-50"
									onClick={handleEditClick}
								>
									<Edit size={14} />
									Edit
								</button>
								<button
									className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 w-full transition-colors border-b border-gray-50"
									onClick={handleDelete}
								>
									<Trash2 size={14} />
									Delete
								</button>
								<button
									className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full transition-colors"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										onPin(blog.id);
										setShowDropdown(false);
									}}
								>
									<Pin size={14} />
									{blog.isPinned ? "Unpin" : "Pin"}
								</button>
							</div>
						)}
					</div>
				</div>
				<div className="bg-white/50 p-4 rounded-xl mb-4 transform transition-all duration-300 group-hover:translate-x-1 border border-gray-100">
					<p className="text-gray-700 text-base line-clamp-3">
						{previewContent(blog.content)}
					</p>
				</div>
				<div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
					<div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
						<Clock size={14} className="text-purple-400" />
						<span>{formatDate(blog.date)}</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							className="rounded-full p-2 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								// Add share functionality if needed
							}}
						>
							<Share2 size={18} />
						</button>
						{blog.isPinned && (
							<button
								className="rounded-full p-2 bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all duration-300"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onPin(blog.id);
								}}
							>
								<Pin size={18} className="fill-purple-100" />
							</button>
						)}
						<button
							className={`rounded-full p-2 transition-all duration-300 
                ${
									blog.isLiked
										? "bg-pink-100 text-pink-500 hover:bg-pink-200"
										: "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-pink-400"
								}`}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onLike(parseInt(blog.id));
							}}
						>
							<Heart
								size={18}
								className={`transform transition-transform duration-300 ${
									blog.isLiked
										? "fill-current scale-110"
										: "scale-100 hover:scale-110"
								}`}
							/>
						</button>
					</div>
				</div>
			</div>
			{blog.isPinned && (
				<div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
					<div className="absolute top-0 right-0 rotate-45 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold py-1 w-24 text-center transform translate-y-3 translate-x-6">
						Pinned
					</div>
				</div>
			)}
		</div>
	);
};

BlogCard.propTypes = {
	blog: PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		title: PropTypes.string.isRequired,
		content: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
		isLiked: PropTypes.bool.isRequired,
		isPinned: PropTypes.bool.isRequired,
	}).isRequired,
	onLike: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	onPin: PropTypes.func.isRequired,
};

export default BlogCard;
