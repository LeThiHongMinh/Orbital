import React from 'react';

const ProfileForm = ({ userInfo, saveProfile }) => {
  return (
    <div id="profileForm">
      <h2>User Profile</h2>
      <form onSubmit={saveProfile}>
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          defaultValue={userInfo.full_name}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={userInfo.email}
          required
          disabled // assuming you don't want to change the email
        />
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={userInfo.bio}
          required
        ></textarea>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default ProfileForm;
