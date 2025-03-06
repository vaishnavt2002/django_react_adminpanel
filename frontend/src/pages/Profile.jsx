import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../API/Api';
import { updateUser } from '../redux/authSlice';

const Profile = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('user_profile', file);
      }
      const newUserData = await updateProfile(formData);
      dispatch(updateUser(newUserData));
      console.log("Profile updated:", newUserData);
      setFile(null)
    } catch (error) {
      console.log("Failed to update profile:", error.response?.data || error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {user && (
        <div className="space-y-2">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
          {user.user_profile && (
            <img
              src={`http://localhost:8000${user.user_profile}`}
              alt="Profile"
              className="w-full max-w-xs mt-4 rounded"
            />
          )}
          <form onSubmit={handleProfileUpdate} className="mt-4 space-y-2">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="border-2 w-full text-sm text-gray-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;