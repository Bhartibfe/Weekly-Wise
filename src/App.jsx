import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
// import { PrivateRoute } from "./components/PrivateRoute";s
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import BlogsPage from "./pages/blogs/BlogsPage";
import TodoPage from "./pages/todolist/TodoPage";
import WeeklyPlanner from "./pages/weeklyplanner/WeeklyPlanner";
import NotesPage from "./pages/notes/NotesPage";
import NoteEditor from "./pages/notes/NoteEditor";
import LinksPage from "./pages/links/LinksPage";
import AppLayout from "./components/layouts/Layout";
const ProjectPage = () => <div className="p-8">Project Planner Content</div>;
const HabitPage = () => <div className="p-8">Habit Tracker Content</div>;
const HolidayPage = () => <div className="p-8">Holiday Planner Content</div>;

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route element={<AppLayout />}>
						<Route path="/" element={<HomePage />} />
						<Route path="/linkspage" element={<LinksPage />} />
						<Route path="/blogs/*" element={<BlogsPage />} />
						<Route
							path="/likes"
							element={<Navigate to="/blogs/likes" replace />}
						/>
						<Route path="/todo" element={<TodoPage />} />
						<Route path="/project" element={<ProjectPage />} />
						<Route path="/weekly" element={<WeeklyPlanner />} />
						<Route path="/notes" element={<NotesPage />} />
						<Route path="/notes/:id" element={<NoteEditor />} />
						<Route path="/habit" element={<HabitPage />} />
						<Route path="/holiday" element={<HolidayPage />} />
					</Route>
					<Route path="/login" element={<Login />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
};

export default App;
