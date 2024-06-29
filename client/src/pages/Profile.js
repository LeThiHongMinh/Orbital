import React, { useState, useEffect } from 'react';
import Layout from '../components/layout'; // Assuming the correct path to Layout component
import { profileUpdate, profileCheck } from '../api/auth'; // Import profileUpdate and profileCheck from API
import Nav from '../components/Nav';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    bio: '',
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null); // State to hold error messages

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await profileCheck(); // Fetch profile data from API
        if (data && data.user) {
          setProfileData({
            full_name: data.user.full_name || '',
            email: data.user.email || '',
            bio: data.user.bio || '',
            username: data.user.username || '',
            password: '', // Initially hide the password for security reasons
          });
        }
        setLoading(false); // Update loading state
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch profile data'); // Set error state if fetching fails
        setLoading(false);
      }
    };

    fetchProfile(); // Invoke fetchProfile function on component mount
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await profileUpdate(profileData); // Call profileUpdate API with updated profile data
      alert('Profile updated successfully'); // Display success message
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile'); // Set error state if updating fails
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-red-600">
        {error}
      </div>
    );
  }

  if (!isEditing) {
    return (
      <Layout> {/* Wrap the profile page content in Layout */}
        <div className="bg-white min-h-screen"> {/* Set background color to white */}
          <div className="max-w-lg mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-red-100 rounded-lg p-6">
              <h2 className="text-4xl mt-8 font-bold mb-6 text-center text-red-700">User Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-3xl font-medium text-gray-700">Full Name:</label>
                  <p className="mt-1 text-lg">{profileData.full_name}</p>
                </div>
                <div>
                  <label className="block text-3xl font-medium text-gray-700">Username:</label>
                  <p className="mt-1 text-lg">{profileData.username}</p>
                </div>
                <div>
                  <label className="block text-3xl font-medium text-gray-700">Email:</label>
                  <p className="mt-1 text-lg">{profileData.email}</p>
                </div>
                <div>
                  <label className="block text-3xl font-medium text-gray-700">Bio:</label>
                  <p className="mt-1 text-lg">{profileData.bio}</p>
                </div>
              </div>
              <div className="text-center mt-6">
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout> {/* Wrap the edit profile form in Layout */}
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-lg mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-red-700">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name:</label>
                <input
                  type="text"
                  id="fullName"
                  name="full_name"
                  value={profileData.full_name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio:</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                ></textarea>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={profileData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div className="text-center">
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
