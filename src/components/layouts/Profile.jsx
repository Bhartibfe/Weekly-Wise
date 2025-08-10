import { useState, useRef, useEffect } from "react";
import { User, Calendar, Camera, X } from "lucide-react";
import PropTypes from "prop-types";
import { useAuth } from "../AuthProvider";

const Profile = ({ handleLogout }) => {
	const { user, updateUserProfile } = useAuth();
	const calculateAge = (birthDate) => {
		const today = new Date();
		const birth = new Date(birthDate);
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (
			monthDiff < 0 ||
			(monthDiff === 0 && today.getDate() < birth.getDate())
		) {
			age--;
		}
		return age;
	};

	const [isOpen, setIsOpen] = useState(false);
	const [savedProfile, setSavedProfile] = useState(() => {
		const savedProfileData = localStorage.getItem("userProfile");
		return savedProfileData
			? JSON.parse(savedProfileData)
			: {
					name: "",
					gender: "",
					birthDate: "",
					age: "",
					email: user?.email || "",
					phone: "",
					photoUrl: null,
			  };
	});

	useEffect(() => {
		if (!user) return; // don't run if user is null
		if (user.email !== savedProfile.email) {
			setSavedProfile((prev) => ({ ...prev, email: user.email }));
			setTempProfile((prev) => ({ ...prev, email: user.email }));
		}
	}, [user, savedProfile.email]);

	const [tempProfile, setTempProfile] = useState({ ...savedProfile });
	const fileInputRef = useRef(null);
	useEffect(() => {
		if (tempProfile.birthDate) {
			const calculatedAge = calculateAge(tempProfile.birthDate);
			setTempProfile((prev) => ({
				...prev,
				age: calculatedAge,
			}));
		}
	}, [tempProfile.birthDate]);

	const handleLogoutClick = () => {
		setIsOpen(false);
		handleLogout();
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "email") return;
		setTempProfile((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setTempProfile((prev) => ({
					...prev,
					photoUrl: reader.result,
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = () => {
		setSavedProfile(tempProfile);
		localStorage.setItem("userProfile", JSON.stringify(tempProfile));
		updateUserProfile(tempProfile);
		setIsOpen(false);
	};

	return (
		<div className="relative">
			<button
				className="p-2 rounded-full hover:bg-purple-100 cursor-pointer transition-all duration-300 transform hover:scale-105"
				onClick={() => setIsOpen(true)}
			>
				{savedProfile.photoUrl ? (
					<img
						src={savedProfile.photoUrl}
						alt={savedProfile.name || "Profile"}
						className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-600"
					/>
				) : (
					<div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center ring-2 ring-purple-600">
						<User className="text-white" size={20} />
					</div>
				)}
			</button>

			{isOpen && (
				<div className="fixed inset-0 bg-purple-900/20 backdrop-blur-sm flex items-center justify-center z-50">
					<div
						className="relative max-w-lg w-11/12 mx-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-purple-200"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="relative p-6 space-y-6">
							<div className="flex justify-between items-center border-b border-purple-100 pb-4">
								<h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
									Profile Settings
								</h2>
								<button
									onClick={() => setIsOpen(false)}
									className="p-2 rounded-full hover:bg-purple-100 transition-colors text-purple-600"
								>
									<X size={20} />
								</button>
							</div>

							<div className="flex flex-col items-center space-y-4">
								<div className="relative group">
									<div
										className="w-28 h-28 rounded-full overflow-hidden cursor-pointer ring-4 ring-purple-200 transition-all duration-300 group-hover:ring-purple-400"
										onClick={() => fileInputRef.current?.click()}
									>
										{tempProfile.photoUrl ? (
											<img
												src={tempProfile.photoUrl}
												alt={tempProfile.name || "Profile"}
												className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
											/>
										) : (
											<div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
												<User className="text-white" size={40} />
											</div>
										)}
									</div>
									<div className="absolute bottom-0 right-0 p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-lg cursor-pointer transform translate-y-2 translate-x-2">
										<Camera className="text-white" size={16} />
									</div>
								</div>
								<input
									type="file"
									ref={fileInputRef}
									className="hidden"
									accept="image/*"
									onChange={handleImageChange}
								/>
							</div>

							<div className="space-y-4">
								<div className="space-y-2">
									<label className="block text-sm font-medium text-purple-600">
										Name
									</label>
									<input
										type="text"
										name="name"
										value={tempProfile.name}
										onChange={handleChange}
										className="w-full px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg text-gray-800 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300"
										placeholder="Enter your name"
									/>
								</div>

								<div className="space-y-2">
									<label className="block text-sm font-medium text-purple-600">
										Gender
									</label>
									<div className="flex space-x-4">
										{["Male", "Female"].map((gender) => (
											<label
												key={gender}
												className="relative flex items-center space-x-3 cursor-pointer group"
											>
												<input
													type="radio"
													name="gender"
													value={gender}
													checked={tempProfile.gender === gender}
													onChange={handleChange}
													className="w-4 h-4 border-2 border-purple-400 text-purple-600 focus:ring-purple-400"
												/>
												<span className="text-gray-700 group-hover:text-purple-600 transition-colors">
													{gender}
												</span>
											</label>
										))}
									</div>
								</div>

								<div className="space-y-2">
									<label className="block text-sm font-medium text-purple-600">
										Date of Birth
									</label>
									<div className="relative">
										<input
											type="date"
											name="birthDate"
											value={tempProfile.birthDate}
											onChange={handleChange}
											max={new Date().toISOString().split("T")[0]}
											className="w-full px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300"
										/>
										<Calendar
											className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400"
											size={18}
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<label className="block text-sm font-medium text-purple-600">
											Age
										</label>
										<input
											type="text"
											value={tempProfile.age}
											disabled
											className="w-full px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg text-gray-500 cursor-not-allowed"
										/>
									</div>

									<div className="space-y-2">
										<label className="block text-sm font-medium text-purple-600">
											Phone
										</label>
										<input
											type="tel"
											name="phone"
											value={tempProfile.phone}
											onChange={handleChange}
											className="w-full px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg text-gray-800 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition-all duration-300"
											placeholder="Enter phone number"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label className="block text-sm font-medium text-purple-600">
										Email
									</label>
									<input
										type="email"
										name="email"
										value={tempProfile.email}
										disabled
										className="w-full px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg text-gray-500 cursor-not-allowed"
									/>
								</div>
							</div>

							<div className="flex space-x-4 pt-4">
								<button
									onClick={handleSave}
									className="flex-1 py-2 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
								>
									Save Changes
								</button>
								<button
									onClick={handleLogoutClick}
									className="flex-1 py-2 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
								>
									Logout
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

Profile.propTypes = {
	handleLogout: PropTypes.func.isRequired,
};

export default Profile;
