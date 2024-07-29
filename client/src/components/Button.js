import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ iconURL, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex justify-center bg-red-600 items-center gap-2 px-7 py-4 border font-montserrat text-lg leading-none bg-coral-red rounded-full text-white border-coral-red mt-10 hover:bg-red-400 shadow-lg transition-transform transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
    >
      Find Now
      <img
        src={iconURL}
        alt="arrow right icon"
        className="ml-2 rounded-full w-5 h-5"
      />
    </button>
  );
};

Button.propTypes = {
  iconURL: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Button;
