import React from 'react';
import Navbar from './Nav';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

const Layout = ({ children }) => {
  const { isAuth } = useSelector((state) => state.auth);

  return (
    <div className="flex h-screen bg-red-100">
      <Navbar />
      {/* {isAuth ? <Sidebar /> : <Navbar />} */}
      <div className="flex-grow">
        <main className="p-6 bg-red-100" >{children}</main>
      </div>
    </div>
  );
};

export default Layout;
