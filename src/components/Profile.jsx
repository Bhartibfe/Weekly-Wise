import { useState, useRef, useEffect } from "react";
import { User, Calendar } from "lucide-react";
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';

const Profile = ({ handleLogout }) => {
  const { user, updateUserProfile } = useAuth();
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
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
          email: user?.email || "", // Use email from auth context
          phone: "",
          photoUrl: null,
        };
  });

  // Update profile when user changes
  useEffect(() => {
    if (user?.email && user.email !== savedProfile.email) {
      setSavedProfile(prev => ({
        ...prev,
        email: user.email
      }));
      setTempProfile(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user.email, savedProfile.email]);

  const [tempProfile, setTempProfile] = useState({ ...savedProfile });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (tempProfile.birthDate) {
      const calculatedAge = calculateAge(tempProfile.birthDate);
      setTempProfile(prev => ({
        ...prev,
        age: calculatedAge
      }));
    }
  }, [tempProfile.birthDate]);

  const handleLogoutClick = () => {
    setIsOpen(false);
    handleLogout();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") return; // Don't allow email changes
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
        <div 
          className="p-2 rounded-full hover:bg-[#31363F] cursor-pointer transition-colors"
          onClick={() => setIsOpen(true)}
        >
          {savedProfile.photoUrl ? (
            <img
              src={savedProfile.photoUrl}
              alt={savedProfile.name || "Profile"}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#31363F] flex items-center justify-center">
              <User className="text-[#EEEEEE]" size={24} />
            </div>
          )}
        </div>
  
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div 
              className="bg-purple-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 p-8 max-w-lg w-11/12 shadow-xl rounded-lg shadow-xl w-full max-w-md mx-4 flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-[#31363F]">
                <h2 className="text-xl font-semibold text-[#EEEEEE]">Profile Settings</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#76ABAE] hover:text-[#EEEEEE] transition-colors"
                >
                  ×
                </button>
              </div>
  
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#76ABAE] scrollbar-track-[#31363F]">
                <div className="p-4 space-y-4">
                  {/* Profile photo section */}
                  <div className="flex flex-col items-center space-y-3">
                    <div 
                      className="w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-[#76ABAE] hover:border-[#EEEEEE] transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {tempProfile.photoUrl ? (
                        <img
                          src={tempProfile.photoUrl}
                          alt={tempProfile.name || "Profile"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#31363F] flex items-center justify-center">
                          <User className="text-[#EEEEEE]" size={40} />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <button
                      className="px-4 py-2 bg-[#31363F] text-[#EEEEEE] rounded-md hover:bg-[#76ABAE] transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Photo
                    </button>
                  </div>
  
                  {/* Form fields */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-[#76ABAE]">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={tempProfile.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#31363F] border border-[#76ABAE] rounded-md text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
                      />
                    </div>
  
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-[#76ABAE]">Gender</label>
                      <div className="flex space-x-4">
                        {['Male', 'Female'].map((gender) => (
                          <label key={gender} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value={gender}
                              checked={tempProfile.gender === gender}
                              onChange={handleChange}
                              className="w-4 h-4 text-[#76ABAE] bg-[#31363F] border-[#76ABAE] focus:ring-[#76ABAE]"
                            />
                            <span className="text-[#EEEEEE]">{gender}</span>
                          </label>
                        ))}
                      </div>
                    </div>
  
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-[#76ABAE]">Date of Birth</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="birthDate"
                          value={tempProfile.birthDate}
                          onChange={handleChange}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 bg-[#31363F] border border-[#76ABAE] rounded-md text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#76ABAE]" size={20} />
                      </div>
                    </div>
  
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-[#76ABAE]">Age</label>
                      <input
                        type="text"
                        value={tempProfile.age}
                        disabled
                        className="w-full px-3 py-2 bg-[#31363F] border border-[#76ABAE] rounded-md text-[#EEEEEE] opacity-50 cursor-not-allowed"
                      />
                    </div>
  
                    <div className="space-y-1">
              <label className="block text-sm font-medium text-[#76ABAE]">Email</label>
              <input
                type="email"
                name="email"
                value={tempProfile.email}
                disabled
                className="w-full px-3 py-2 bg-[#31363F] border border-[#76ABAE] rounded-md text-[#EEEEEE] opacity-50 cursor-not-allowed"
              />
            </div>
  
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-[#76ABAE]">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={tempProfile.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-[#31363F] border border-[#76ABAE] rounded-md text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
                      />
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Action buttons in a single row */}
              
                <div className="flex space-x-2">
                <button
          onClick={handleSave}
          className="flex-1 py-2 bg-[#76ABAE] text-[#EEEEEE] rounded-md hover:bg-[#EEEEEE] hover:text-[#222831] transition-colors"
        >
          Save Changes
        </button>
        <button
          onClick={handleLogoutClick}
          className="flex-1 py-2 bg-red-600 text-[#EEEEEE] rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
                </div>
              </div>
            </div>
          
        )}
      </div>
    );
  };
Profile.propTypes = {
    handleLogout: PropTypes.func.isRequired
  };
export default Profile;