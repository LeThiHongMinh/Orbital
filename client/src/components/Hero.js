import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { arrowRight } from '../assets/icons';
import { study } from '../assets/images';

const Hero = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isAuth) {
      navigate('/matchmaking');
    } else {
      navigate('/login');
    }
  };

  return (
    <section
      id='home'
      className={`flex xl:flex-row flex-col min-h-screen gap-10 max-container text-left ml-10 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-red-100 text-black'}`}
    >
      <div className={`relative xl:w-2/5 flex flex-col justify-center items-start w-full max-wl:padding-x pt-28 ${isDarkMode ? 'bg-gray-800' : 'bg-red-100'}`}>
        <p className={`text-4xl text-left font-semibold font-montserrat ${isDarkMode ? 'text-coral-red' : 'text-coral-red'} font-bold`}>
          Dora The Kids
        </p>
        <h1 className={`text-8xl mt-10 font-palanquin font-bold ${isDarkMode ? 'text-gray-100' : 'text-black'} max-sm:text-[72px] max-sm:leading-[82]`}>
          <span className={`shadow-lg xl:whitespace-nowrap relative z-10 pr-10 ${isDarkMode ? 'text-gray-100' : 'text-black'}`}>
            The Best Place
          </span>
          <br />
          <span className='shadow-lg space-x-30'>To Find</span>
          <span className={`text-red-700 shadow-lg inline-block mt-3 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
            Study Partner
          </span>
        </h1>
        <Button iconURL={arrowRight} onClick={handleButtonClick} />
      </div>
      <span className='relative flex-1 flex justify-center items-center xl:min-h-screen max-xl:py-40'>
        <img
          src={study}
          alt='Big shoes'
          width={500}
          height={500}
          className='object-contain relative z-10'
        />
      </span>
    </section>
  );
};

export default Hero;
