import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProtectedInfo, onLogout } from '../api/auth';
import Layout from '../components/layout';
import { unauthenticateUser } from '../redux/slices/authSlice';
import CalendarCom from '../components/Calendar';
import ProgressBar from '../components/ProgressBar';
import ToDoList from '../components/Todo';
import SearchCourse from '../components/Searchcourse';
import CourseList from '../components/Courselist';
import StatusComponent from '../components/Status';
import ProfileForm from '../components/Profile';
import { profileUpdate } from '../api/auth';
import { profilepic } from '../assets';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const logout = async () => {
    try {
      await onLogout();
      dispatch(unauthenticateUser());
      localStorage.removeItem('isAuth');
      navigate('/login'); // Navigate to login page after logout
    } catch (error) {
      console.log(error.response);
    }
  };

  const protectedInfo = async () => {
    try {
      const { data } = await fetchProtectedInfo();
      setProtectedData(data.info);
      setLoading(false);
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    protectedInfo();
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    const fullName = event.target.fullName.value;
    const bio = event.target.bio.value;

    try {
      await profileUpdate({ full_name: fullName, bio: bio, email: protectedData.email });
      // Reload profile data after update
      protectedInfo();
    } catch (error) {
      console.error(error);
    }
  };

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <Layout>
      <div className="relative">
        <div className="bg-red-100 relative">
          <ProgressBar />
          <CalendarCom className="flex flex-col right-0" />
          <ToDoList />
          <CourseList />
          <SearchCourse />
          <StatusComponent numLessons={10} numQuizzes={5} numPrototypes={3} numHours={20} />
          <div id="dashboard">
            <h1>Welcome to the Dashboard</h1>
            <div className="absolute top-0 right-0 mt-4 mr-4">
              <img
                src={profilepic}
                alt="Avatar"
                className="avatar rounded-full cursor-pointer"
                onClick={toggleDropdown}
                style={{
                  width: '50px',
                  height: '50px',
                }}
              />
              {isDropdownVisible && (
                <div style={dropdownMenuStyle}>
                  <ul style={ulStyle}>
                    <li style={liStyle} onClick={() => navigate('/profile')}>
                      Account Settings
                    </li>
                    <li style={liStyle} onClick={() => {
                      logout();
                      setDropdownVisible(false);
                    }}>
                      Log Out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const dropdownMenuStyle = {
  width: '180px',
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
