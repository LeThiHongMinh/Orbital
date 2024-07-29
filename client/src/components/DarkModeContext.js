import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

DarkModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use dark mode context
export const useDarkMode = () => useContext(DarkModeContext);
