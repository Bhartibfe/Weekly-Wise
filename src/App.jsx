import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider'; // Updated import path
import { PrivateRoute } from './components/PrivateRoute';
import HomePage from './components/HomePage';
import Login from './components/Login';
import BlogsPage from './components/BlogsPage';
import TodoPage from './components/Todopage';

const ProjectPage = () => <div className="p-8">Project Planner Content</div>;
const WeeklyPage = () => <div className="p-8">Weekly Planner Content</div>;
const NotesPage = () => <div className="p-8">Notes Content</div>;
const HabitPage = () => <div className="p-8">Habit Tracker Content</div>;
const HolidayPage = () => <div className="p-8">Holiday Planner Content</div>;

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route path="/blogs/*" element={
            <PrivateRoute>
              <BlogsPage />
            </PrivateRoute>
          } />
          <Route path="/blog/:id/*" element={
            <PrivateRoute>
              <BlogsPage />
            </PrivateRoute>
          } />
          <Route
            path="/todo"
            element={
              <PrivateRoute>
                <TodoPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/project"
            element={
              <PrivateRoute>
                <ProjectPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/weekly"
            element={
              <PrivateRoute>
                <WeeklyPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <PrivateRoute>
                <NotesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/habit"
            element={
              <PrivateRoute>
                <HabitPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/holiday"
            element={
              <PrivateRoute>
                <HolidayPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;