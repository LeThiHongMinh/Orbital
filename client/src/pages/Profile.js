import React, { useState, useEffect } from 'react';
import Layout from '../components/layout';
import { profileCheck, profileUpdate, profileCreate } from '../api/auth';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    password: '',
    username: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await profileCheck();
        if (data.profile) {
          setProfileData(data.profile);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
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
      if (isEditing) {
        await profileUpdate(profileData);
        alert('Profile updated successfully');
      } else {
        await createProfile(profileData);
        alert('Profile created successfully');
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating/creating profile:', error);
      alert('Error updating/creating profile');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg font-semibold">Loading...</div>;
  }

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-lg mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-red-700">
              {isEditing ? 'Update Profile' : 'Create Profile'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name:
                </label>
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  required={!isEditing} // Required only when creating a profile
                  disabled={isEditing} // Disable editing email when updating profile
                  className="mt-1 block w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={profileData.password}
                  onChange={handleChange}
                  required={!isEditing} // Required only when creating a profile
                  disabled={isEditing} // Disable editing password when updating profile
                  className="mt-1 block w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username:
                </label>
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
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio:
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isEditing ? 'Update Profile' : 'Create Profile'}
              </button>
            </form>
            {!isEditing && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
