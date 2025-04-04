import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { AUTH_CONSTANTS } from "./authConstants";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(
		() =>
			JSON.parse(
				localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.AUTH_STATE)
			) || false
	);

	const [user, setUser] = useState(
		() =>
			JSON.parse(localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.USER)) || null
	);

	const [error, setError] = useState(null);

	// Validate email format
	const validateEmail = (email) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(String(email).toLowerCase());
	};

	// Simple password strength check
	const validatePassword = (password) => {
		return password.length >= 8;
	};

	useEffect(() => {
		localStorage.setItem(
			AUTH_CONSTANTS.STORAGE_KEYS.AUTH_STATE,
			JSON.stringify(isAuthenticated)
		);
	}, [isAuthenticated]);

	useEffect(() => {
		if (user) {
			localStorage.setItem(
				AUTH_CONSTANTS.STORAGE_KEYS.USER,
				JSON.stringify(user)
			);
		}
	}, [user]);

	const login = async (credentials) => {
		try {
			// Validate input
			if (!validateEmail(credentials.email)) {
				return { success: false, message: "Invalid email format" };
			}

			if (!validatePassword(credentials.password)) {
				return {
					success: false,
					message: "Password must be at least 8 characters",
				};
			}

			const usersData = localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.USERS);
			const users = usersData ? JSON.parse(usersData) : [];

			const existingUser = users.find((u) => u.email === credentials.email);

			if (existingUser) {
				// Use a more secure comparison method (in a real app, use proper hashing)
				if (existingUser.password === btoa(credentials.password)) {
					setUser(existingUser);
					setIsAuthenticated(true);
					setError(null);
					return { success: true, message: "Login successful" };
				} else {
					setError("Incorrect password");
					return { success: false, message: "Incorrect password" };
				}
			} else {
				const newUser = {
					email: credentials.email,
					password: btoa(credentials.password), // Basic encoding (not secure, use proper hashing in production)
					profile: null,
					createdAt: new Date().toISOString(),
				};
				users.push(newUser);
				localStorage.setItem(
					AUTH_CONSTANTS.STORAGE_KEYS.USERS,
					JSON.stringify(users)
				);
				setUser(newUser);
				setIsAuthenticated(true);
				setError(null);
				return { success: true, message: "Account created successfully" };
			}
		} catch (error) {
			console.error("Login error:", error);
			setError("An error occurred during login");
			return { success: false, message: "An error occurred during login" };
		}
	};

	const logout = () => {
		setUser(null);
		setIsAuthenticated(false);
		setError(null);
		localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEYS.USER);
		localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEYS.AUTH_STATE);
	};

	const updateUserProfile = (profileData) => {
		if (user) {
			const updatedUser = { ...user, profile: profileData };
			setUser(updatedUser);

			const usersData = localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.USERS);
			const users = usersData ? JSON.parse(usersData) : [];
			const updatedUsers = users.map((u) =>
				u.email === user.email ? updatedUser : u
			);

			localStorage.setItem(
				AUTH_CONSTANTS.STORAGE_KEYS.USER,
				JSON.stringify(updatedUser)
			);
			localStorage.setItem(
				AUTH_CONSTANTS.STORAGE_KEYS.USERS,
				JSON.stringify(updatedUsers)
			);
		}
	};

	const contextValue = {
		isAuthenticated,
		user,
		login,
		logout,
		updateUserProfile,
		error,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export default AuthProvider;
