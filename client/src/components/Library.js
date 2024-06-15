import React, { useState } from 'react';

const Library = () => {
  const [isProfileFormVisible, setProfileFormVisible] = useState(false);

  const showProfileForm = () => {
    setProfileFormVisible(true);
  };

  const saveProfile = (event) => {
    event.preventDefault();
    const fullName = event.target.fullName.value;
    const email = event.target.email.value;
    const bio = event.target.bio.value;

    console.log('Profile Saved:');
    console.log('Full Name:', fullName);
    console.log('Email:', email);
    console.log('Bio:', bio);

    // Optionally clear the form (if needed)
    event.target.reset();

    // Hide the profile form and show the dashboard
    setProfileFormVisible(false);
  };

  return (
    <div>
      {isProfileFormVisible ? (
        <ProfileForm saveProfile={saveProfile} />
      ) : (
        <Dashboard showProfileForm={showProfileForm} />
      )}
    </div>
  );
};

const Dashboard = ({ showProfileForm }) => (
  <div id="dashboard">
    <h1>Welcome to the Dashboard</h1>
    <img
      src="avatar.png"
      alt="Avatar"
      className="avatar"
      onClick={showProfileForm}
      style={{ width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer' }}
    />
  </div>
);

const ProfileForm = ({ saveProfile }) => (
  <div id="profileForm">
    <h2>Create Your Profile</h2>
    <form onSubmit={saveProfile}>
      <label htmlFor="fullName">Full Name:</label>
      <input type="text" id="fullName" name="fullName" required />
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" required />
      <label htmlFor="bio">Bio:</label>
      <textarea id="bio" name="bio" required></textarea>
      <button type="submit">Save Profile</button>
    </form>
  </div>
);

export default Library;
