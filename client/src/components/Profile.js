import React, { useState, useEffect } from 'react';
import { profileUpdate, profileCheck } from '../api/auth'; // Adjust the path as needed

const ProfileForm = () => {
  const [profileData, setProfileData] = useState({ full_name: '', email: '', bio: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await profileCheck();
        if (data.profileComplete) {
          setProfileData(data.user);
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
      await profileUpdate(profileData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div id="profileForm">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          name="full_name"
          value={profileData.full_name}
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={profileData.email}
          onChange={handleChange}
          required
          //disabled // assuming you don't want to change the email
        />
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          value={profileData.bio}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default ProfileForm;
