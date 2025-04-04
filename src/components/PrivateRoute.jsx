import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import PropTypes from "prop-types";

export const PrivateRoute = ({ children }) => {
	const { isAuthenticated } = useAuth();

	return isAuthenticated ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
	children: PropTypes.node.isRequired,
};
