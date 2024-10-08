import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {
  WelcomePage,
  GitHubBanner,
  Refine,
  Authenticated,
} from '@refinedev/core';
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import {
  useNotificationProvider,
} from '@refinedev/antd';
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from '@refinedev/react-router-v6';
import { App as AntdApp } from 'antd';
//import { authProvider, dataProvider, liveProvider } from "./providers";
import '@refinedev/antd/dist/reset.css';
import Dashboard from './pages/dashboard';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import { useSelector } from 'react-redux';
import CourseDetail from './components/Coursedetail';
import CourseList from './components/Courselist';
import Matchmaking from './pages/Matchmaking';
import Library from './pages/Library';
import ProfileForm from './pages/Profile';
import StudyActivities from './pages/studyActivities';
import Partner from './components/Partner';
import FeedbackForm from './components/FeedbackForm';
import Portals from './pages/portal';
import { DarkModeProvider } from './components/DarkModeContext'; // Import DarkModeProvider
import NotificationsPage from './pages/Noti';

const PrivateRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth);
  return <>{isAuth ? <Outlet /> : <Navigate to='/login' />}</>;
};

const RestrictedRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth);
  return <>{!isAuth ? <Outlet /> : <Navigate to='/' />}</>;
};

const App = () => {
  const [courses, setCourses] = useState(() => {
    const storedCourses = localStorage.getItem('courses');
    return storedCourses ? JSON.parse(storedCourses) : [];
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  return (
    <DarkModeProvider>
      <BrowserRouter>
       
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path = '/home' element={<Home />} />
          <Route path = '/matchmaking' element={<Matchmaking />} />
          <Route path='/library' element = {<Library />} />
          <Route path='/partner' element={<Partner />} />
          <Route path='/feedback' element={<FeedbackForm />} />

        <Route element={<PrivateRoutes />}>
          <Route path='/noti' element={<NotificationsPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/profile' element={<ProfileForm />} />
          <Route path='/studyActivities' element={<StudyActivities />} />
          <Route path='/portals' element={<Portals />} />
        </Route>
        
        <Route path="/" element={<CourseList courses={courses} setCourses={setCourses} />} />
        <Route path="/course/:courseCode" element={<CourseDetail courses={courses} />} />

          <Route path="/" element={<CourseList courses={courses} setCourses={setCourses} />} />
          <Route path="/course/:courseCode" element={<CourseDetail courses={courses} />} />

          <Route element={<RestrictedRoutes />}>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
          </Route>
        </Routes>
        
      </BrowserRouter>
      </DarkModeProvider>
  
  );
};

export default App;
