import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";

const UnifiedBlogForm = ({
	blogs = [],
	onCreateBlog = () => {},
	onUpdateBlog = () => {},
}) => {
	console.log("UnifiedBlogForm rendered", {
		blogs,
		isEditMode: !!useParams().id,
	});
	const { id } = useParams();
	const navigate = useNavigate();
	const isEditMode = !!id;
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [charCount, setCharCount] = useState(0);
	const [focusedField, setFocusedField] = useState(null);

	const [blogData, setBlogData] = useState({
		title: "",
		content: "",
	});

	useEffect(() => {
		if (isEditMode && blogs?.length) {
			const currentBlog = blogs.find((b) => b.id === parseInt(id));
			if (currentBlog) {
				setBlogData({
					...currentBlog,
					content: currentBlog.content || "",
				});
				setCharCount(currentBlog.content?.length || 0);
			}
		}
	}, [blogs, id, isEditMode]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!blogData.title.trim()) {
			alert("Blog title cannot be empty!");
			return;
		}

		if (!blogData.content?.trim()) {
			alert("Blog content cannot be empty!");
			return;
		}

		setIsSubmitting(true);
		try {
			if (isEditMode) {
				await onUpdateBlog({
					...blogData,
					id: parseInt(id),
					date: new Date().toISOString(),
				});
			} else {
				await onCreateBlog({
					...blogData,
					date: new Date().toISOString(),
				});
			}
			navigate("/blogs");
		} catch (error) {
			console.error(
				`Failed to ${isEditMode ? "update" : "create"} the blog:`,
				error
			);
			alert(
				`There was an error ${
					isEditMode ? "updating" : "creating"
				} the blog. Please try again.`
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleContentChange = (e) => {
		const newContent = e.target.value;
		setBlogData((prev) => ({ ...prev, content: newContent }));
		setCharCount(newContent.length);
	};

	const getInspirationQuote = () => {
		const quotes = [
			"Write with passion, edit with precision.",
			"Every word has power. Choose yours wisely.",
			"Your story matters. Tell it.",
			"Great writing isn't born, it's crafted.",
			"The first draft is just you telling yourself the story.",
		];
		return quotes[Math.floor(Math.random() * quotes.length)];
	};

	if (isEditMode && !blogData.title && blogs?.length) {
		return (
			<div className="p-12 text-center bg-gradient-to-br from-pink-50 to-purple-100 rounded-lg shadow-lg">
				<div className="animate-bounce mb-6 text-4xl">🔍</div>
				<h3 className="text-2xl text-purple-600 font-bold">Blog not found</h3>
				<p className="mt-4 text-purple-500">
					The blog you&apos;re looking for seems to have vanished into the
					digital ether
				</p>
				<button
					onClick={() => navigate("/blogs")}
					className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-md"
				>
					Back to Blogs
				</button>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-pink-50 to-purple-100 rounded-lg shadow-xl">
			<form className="space-y-6" onSubmit={handleSubmit}>
				<div className="text-center space-y-2">
					<h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
						✨ {isEditMode ? "Edit" : "Create"} Your Masterpiece ✨
					</h2>
					<p className="text-purple-500 italic">{getInspirationQuote()}</p>
				</div>

				<div
					className={`relative transition-all duration-300 ${
						focusedField === "title" ? "transform scale-102" : ""
					}`}
				>
					<input
						type="text"
						placeholder="Give your blog a catchy title..."
						value={blogData.title}
						onChange={(e) =>
							setBlogData((prev) => ({ ...prev, title: e.target.value }))
						}
						onFocus={() => setFocusedField("title")}
						onBlur={() => setFocusedField(null)}
						required
						disabled={isSubmitting}
						className="w-full pl-12 pr-6 py-4 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-purple-800 font-medium placeholder:text-purple-300 transition-all shadow-sm focus:shadow-md"
					/>
					<div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
						<span className="text-2xl">📝</span>
					</div>
				</div>

				<div
					className={`relative mt-6 transition-all duration-300 ${
						focusedField === "content" ? "transform scale-102" : ""
					}`}
				>
					<textarea
						placeholder="Share your thoughts with the world..."
						value={blogData.content}
						onChange={handleContentChange}
						onFocus={() => setFocusedField("content")}
						onBlur={() => setFocusedField(null)}
						required
						disabled={isSubmitting}
						className="w-full pl-12 pr-6 py-4 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-purple-800 min-h-[400px] resize-none placeholder:text-purple-300 transition-all shadow-sm focus:shadow-md"
					/>
					<div className="absolute top-4 left-3 pointer-events-none">
						<span className="text-2xl">✍️</span>
					</div>
					<div className="absolute bottom-3 right-3 text-sm text-purple-400 font-mono">
						{charCount} characters
					</div>
				</div>

				<div className="flex gap-6 pt-4">
					<button
						type="button"
						onClick={() => navigate("/blogs")}
						className="group flex-1 px-6 py-3 border-2 border-purple-400 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
						disabled={isSubmitting}
					>
						<span className="group-hover:mr-1 transition-all">Cancel</span>
						<span className="group-hover:translate-x-1 transition-all">🔙</span>
					</button>
					<button
						type="submit"
						className="group flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								<span>{isEditMode ? "Updating..." : "Publishing..."}</span>
							</>
						) : (
							<>
								<span className="group-hover:mr-1 transition-all">
									{isEditMode ? "Update Blog" : "Publish Blog"}
								</span>
								<span className="group-hover:translate-x-1 transition-all">
									🚀
								</span>
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

UnifiedBlogForm.propTypes = {
	blogs: PropTypes.array,
	onCreateBlog: PropTypes.func,
	onUpdateBlog: PropTypes.func,
};

export default UnifiedBlogForm;
