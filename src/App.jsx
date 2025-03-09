import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { PrivateRoute } from './components/PrivateRoute';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import Login from './components/Login';
import BlogsPage from './components/BlogsPage';
import TodoPage from './components/TodoPage';
import WeeklyPlanner from './components/WeeklyPlanner';
const ProjectPage = () => <div className="p-8">Project Planner Content</div>;
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
                <Layout>
                  <HomePage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/blogs/*"
            element={
              <PrivateRoute>
                <Layout>
                  <BlogsPage />
                </Layout>
              </PrivateRoute>
            }
          />
          {/* Redirect /likes to /blogs/likes */}
          <Route
            path="/likes"
            element={<Navigate to="/blogs/likes" replace />}
          />
          <Route
            path="/todo"
            element={
              <PrivateRoute>
                <Layout>
                  <TodoPage/>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/project"
            element={
              <PrivateRoute>
                <Layout>
                  <ProjectPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/weekly"
            element={
              <PrivateRoute>
                <Layout>
                  <WeeklyPlanner />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <PrivateRoute>
                <Layout>
                  <NotesPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/habit"
            element={
              <PrivateRoute>
                <Layout>
                  <HabitPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/holiday"
            element={
              <PrivateRoute>
                <Layout>
                  <HolidayPage />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;