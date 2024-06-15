import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout';
import { unauthenticateUser } from '../redux/slices/authSlice';
import CalendarCom from '../components/Calendar';
import ProgressBar from '../components/ProgressBar';
import ToDoList from '../components/Todo';
import SearchCourse from '../components/Searchcourse';
import CourseList from '../components/Courselist';
import StatusComponent from '../components/Status';
import ProfileForm from '../components/Profile';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [isProfileFormVisible, setProfileFormVisible] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout');
      dispatch(unauthenticateUser());
      localStorage.removeItem('isAuth');
      navigate('/login');  // Redirect to login page after logout
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchProtectedInfo = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/protected');
      setUserInfo(data.info);
      setLoading(false);
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    fetchProtectedInfo();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const saveProfile = (event) => {
    event.preventDefault();
    const fullName = event.target.fullName.value;
    const bio = event.target.bio.value;

    // You can send updated profile data to the server here
    console.log('Profile Saved:');
    console.log('Full Name:', fullName);
    console.log('Bio:', bio);

    event.target.reset();
    setProfileFormVisible(false);
  };

  return loading ? (
    <Layout className="bg-red-400">
      {/* Loading State Content */}
    </Layout>
  ) : (
    <Layout>
      {isProfileFormVisible ? (
        <ProfileForm userInfo={userInfo} saveProfile={saveProfile} />
      ) : (
        <div className="bg-red-100 relative">
          <ProgressBar />
          <CalendarCom className="flex flex-col right-0" />
          <ToDoList />
          <CourseList />
          <SearchCourse />
          <StatusComponent numLessons={10} numQuizzes={5} numPrototypes={3} numHours={20} />
          <div id="dashboard">
            <h1>Welcome to the Dashboard</h1>
            <img
              src="avatar.png"
              alt="Avatar"
              className="avatar"
              onClick={toggleDropdown}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                cursor: 'pointer',
                position: 'absolute',
                top: '10px',
                right: '10px'
              }}
            />
            {isDropdownVisible && (
              <div style={dropdownMenuStyle}>
                <ul style={ulStyle}>
                  <li style={liStyle} onClick={() => {
                    setProfileFormVisible(true);
                    setDropdownVisible(false);
                  }}>
                    Account Settings
                  </li>
                  <li style={liStyle} onClick={() => {
                    logout();
                    setDropdownVisible(false);
                  }}>
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

// Inline styles for the dropdown menu
const dropdownMenuStyle = {
  position: 'absolute',
  top: '60px',
  right: '10px',
  backgroundColor: 'white',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  padding: '10px',
  zIndex: 1000,
};

const ulStyle = {
  listStyleType: 'none',
  margin: 0,
  padding: 0,
};

const liStyle = {
  padding: '8px 12px',
  cursor: 'pointer',
};

export default Dashboard;
