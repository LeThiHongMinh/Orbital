import React from 'react';
import { useLocation } from 'react-router-dom';
import { NUSTudy } from '../assets/images';
import { useState } from 'react';
import { disablePageScroll, enablePageScroll } from "scroll-lock";
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
    <div className={`fixed top-0 left-0 w-full bg-red-50 rounded-sm z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm "}`}>
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a href="/">
          <img className='block xl:mr-8'
            src={NUSTudy}
            alt="Logo"
            width={50}
            height={15}
          />
        </a>
        <p className="border-black decoration-double ml-5 font-palanquin justify-between text-3xl max-sm:text-[72px] max-sm:leading-[82] font-bold z-10">
          NUSTudy Seeker
        </p>
        <nav className={`${
          openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] space-x-10 left-0 flex-row right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}>
          <div className="relative text-black z-10 flex flex-col space-y-20  items-center justify-center m-auto lg:space-x-10  lg:flex-row lg:space-y-0">
            {navigation.map((item) => (
              <a key={item.label}
                href={item.href}
                onClick={handleClick}
                id={item.id}
                className={`${
                  item.onlyMobile ? "lg:hidden" : ""
                  } lg:font-semibold m-auto stroke-black block shadow-2xl relative font-palanquin font-bold lg:static lg:flex lg:mx-auto lg:bg-n-8 leading-normal text-2xl transition-colors ${item.href === pathname.hash ? "z-2 lg:text-n-1 " : "lg-text-n-1/50 "}lg:leading-5 lg:hover:text-n-1 xl:px-12`}>
                {item.label}
              </a>
            ))}
          </div>
          <HamburgerMenu />
        </nav>

        <div className='container'>
          {isAuth ? (
            <div>
              <button onClick={() => logout()} className='btn btn-primary'>
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex lg:flex-row">
              <NavLink className=" font-palanquin font-bold text-2xl fixed top-[5rem] left-0  right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent" to='/login'>
                <span>Login</span>
              </NavLink>
              <NavLink to='/register' className=' font-palanquin font-bold  text-2xl fixed top-[5rem] space-x-10 left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent'>
                <span>Register</span>
              </NavLink>
            </div>
          )}
        </div>
        <Hamburger
            className="lg:hidden" onClick={toggleNavigation} >
              Menu 
              </Hamburger>
      </div>
    </div>
  );
};

export default Nav;
