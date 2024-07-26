import React from 'react';
import Navbar from './Nav';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

const Layout = ({ children }) => {
  const { isAuth } = useSelector((state) => state.auth);
  const isDarkMode = useSelector((state) => state.ui.isDarkMode); // Get dark mode state from uiSlice

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-red-100'}`}> 
      {isAuth ? <Sidebar /> : <Navbar />}
      <div className="flex-grow pt-16">
        <main className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-red-100 text-black'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
