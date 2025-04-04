import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BlogList from "./BlogList";
import BlogView from "./BlogView";
import LikedBlogs from "./LikedBlogs";
import UnifiedBlogForm from "../../components/shared/UnifiedBlogForm";

const BlogsPage = () => {
	const [blogs, setBlogs] = useState(() => {
		const savedBlogs = localStorage.getItem("blogs");
		// Ensure default blog has all required properties and ID is a number
		const defaultBlog = {
			id: 1,
			title: "Welcome to Your Blog",
			content:
				"<p>This is your first blog post. Start writing your thoughts!</p>",
			date: new Date().toISOString(),
			isLiked: false,
			isPinned: false,
		};

		if (savedBlogs) {
			try {
				// Parse saved blogs and ensure all items have required properties
				const parsedBlogs = JSON.parse(savedBlogs);
				return parsedBlogs.map((blog) => ({
					...defaultBlog, // Start with default values for all properties
					...blog, // Override with actual blog data
					id: Number(blog.id), // Ensure ID is a number
					isLiked: typeof blog.isLiked === "boolean" ? blog.isLiked : false,
					isPinned: typeof blog.isPinned === "boolean" ? blog.isPinned : false,
				}));
			} catch (error) {
				console.error("Error parsing saved blogs:", error);
				return [defaultBlog];
			}
		}
		return [defaultBlog];
	});

	useEffect(() => {
		localStorage.setItem("blogs", JSON.stringify(blogs));
	}, [blogs]);

	const handleToggleLike = (id) => {
		setBlogs((prevBlogs) => {
			const numId = Number(id);
			const updatedBlogs = prevBlogs.map((blog) => {
				if (blog.id === numId) {
					return { ...blog, isLiked: !blog.isLiked };
				}
				return blog;
			});
			return updatedBlogs;
		});
	};

	const handleCreateBlog = (newBlog) => {
		const blogToAdd = {
			...newBlog,
			id: Date.now(), // Use timestamp as a unique ID (already a number)
			date: new Date().toISOString(),
			isLiked: false,
			isPinned: false,
		};
		setBlogs((prevBlogs) => [...prevBlogs, blogToAdd]);
	};

	const handleUpdateBlog = (updatedBlog) => {
		setBlogs((prevBlogs) =>
			prevBlogs.map((blog) =>
				blog.id === Number(updatedBlog.id)
					? {
							...blog,
							...updatedBlog,
							id: Number(updatedBlog.id), // Ensure ID remains a number
							date: new Date().toISOString(),
					  }
					: blog
			)
		);
	};

	const handleDeleteBlog = (id) => {
		setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== Number(id)));
	};

	const handleTogglePin = (id) => {
		setBlogs((prevBlogs) =>
			prevBlogs.map((blog) =>
				blog.id === Number(id) ? { ...blog, isPinned: !blog.isPinned } : blog
			)
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
			{/* Main Content */}
			<div className="max-w-7xl mx-auto p-8">
				<Routes>
					<Route
						path="/"
						element={
							<BlogList
								blogs={blogs}
								onLike={handleToggleLike}
								onDelete={handleDeleteBlog}
								onPin={handleTogglePin}
								onUpdateBlog={handleUpdateBlog}
							/>
						}
					/>
					<Route
						path="/create"
						element={<UnifiedBlogForm onCreateBlog={handleCreateBlog} />}
					/>
					<Route
						path="blog/:id"
						element={
							<BlogView
								blogs={blogs}
								onLike={handleToggleLike}
								onDelete={handleDeleteBlog}
								onPin={handleTogglePin}
								onUpdateBlog={handleUpdateBlog}
							/>
						}
					/>
					<Route
						path="/edit/:id"
						element={
							<UnifiedBlogForm blogs={blogs} onUpdateBlog={handleUpdateBlog} />
						}
					/>
					<Route
						path="likes"
						element={
							<LikedBlogs
								blogs={blogs}
								onLike={handleToggleLike}
								onDelete={handleDeleteBlog}
								onPin={handleTogglePin}
							/>
						}
					/>
					{/* Add a catch-all redirect for /likes path */}
					<Route path="/likes" element={<Navigate to="likes" replace />} />
				</Routes>
			</div>
		</div>
	);
};

export default BlogsPage;
