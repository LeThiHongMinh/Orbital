import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NUSTudy } from '../assets/images';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { onLogout } from '../api/auth';
import { unauthenticateUser } from '../redux/slices/authSlice';
import { HamburgerMenu } from '../design/Header';
import { navigation } from '../constants';
import Hamburger from './Hamburger';

const Nav = () => {
  const { isAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  const logout = async () => {
    try {
      await onLogout();
      dispatch(unauthenticateUser());
      localStorage.removeItem('isAuth');
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-red-50 z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm">
      <div className="flex items-center justify-between px-5 lg:px-7.5 xl:px-10 py-2"> {/* Adjusted padding for height */}
        <div className="flex items-center space-x-1"> {/* Reduced space between logo and title */}
          <a href="/">
            <img
              className="block xl:mr-4" // Reduced margin-right for closer spacing
              src={NUSTudy}
              alt="Logo"
              width={50}
              height={15}
            />
          </a>
          <p className="font-palanquin text-2xl font-bold z-10">
            NUSTudy Seeker
          </p>
        </div>
        <nav
          className={`${
            openNavigation ? 'flex' : 'hidden'
          } fixed top-[3rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:bg-transparent`} // Adjusted top spacing
        >
          <div className="relative text-black z-10 flex flex-col space-y-10 items-center m-auto lg:space-x-10 lg:flex-row lg:space-y-0">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={handleClick}
                id={item.id}
                className={`${
                  item.onlyMobile ? 'lg:hidden' : ''
                } lg:font-semibold m-auto stroke-black block shadow-2xl relative font-palanquin font-bold lg:flex lg:mx-auto lg:bg-n-8 leading-normal text-xl transition-colors ${
                  item.href === pathname.hash ? 'z-2 lg:text-n-1' : 'lg-text-n-1/50'
                } lg:leading-5 lg:hover:text-n-1 xl:px-8`}
              >
                {item.label}
              </a>
            ))}
          </div>
          <HamburgerMenu />
        </nav>
        <div className="flex items-center space-x-4">
          {isAuth ? (
            <button onClick={logout} className="btn btn-primary">
              Logout
            </button>
          ) : (
            <div className="hidden lg:flex lg:flex-row space-x-4">
              <NavLink
                className="font-palanquin font-bold text-xl lg:flex lg:mx-auto bg-red-600 text-white px-4 py-2 rounded-[5px] hover:bg-red-400 shadow-lg transition-transform transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" // Updated button styles
                to="/login"
              >
                <span>Login</span>
              </NavLink>
              <NavLink
                to="/register"
                className="font-palanquin font-bold text-xl lg:flex lg:mx-auto bg-red-600 text-white px-4 py-2 rounded-[5px] hover:bg-red-400 shadow-lg transition-transform transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75" // Updated button styles
              >
                <span>Register</span>
              </NavLink>
            </div>
          )}
        </div>
        <Hamburger className="lg:hidden" onClick={toggleNavigation}>
          Menu
        </Hamburger>
      </div>
    </div>
  );
};

export default Nav;
