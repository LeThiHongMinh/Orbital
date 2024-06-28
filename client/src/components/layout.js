import React from 'react';
import Navbar from './Nav';
import Sidebar from './Sidebar';
import { useSelector, useDispatch } from 'react-redux';
import { authenticateUser } from '../redux/slices/authSlice';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.auth);

  // Example usage: Dispatch authenticateUser action
  React.useEffect(() => {
    // Example scenario: Trigger authentication on component mount
    dispatch(authenticateUser());
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-red-100">
      {/* Example of conditional rendering */}
      {isAuth ? <Sidebar /> : <Navbar />}
      <div className="flex-grow">
        <main className="p-6 bg-red-100">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
