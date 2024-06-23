import React, { useState } from 'react';
import LibDisplay from './LibDisplay';
import SearchBar from './SearchBarLib';
import FileList from './FileList';
import Nav from './Nav';

const Library = () => {
  const [isFormVisible, setFormVisible] = useState(false);

  const handleShowForm = () => {
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
  };

  return (
    <div className=" mx-auto p-4 bg-red-100">
      <div className="flex justify-between items-center mb-6">
        <Nav />
        <h1 className="text-3xl font-bold items-center justify-center text-red-800"></h1>
        <button
          onClick={handleShowForm}
          className="bg-red-600 hover:bg-red-700 mt-20 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Upload Notes
        </button>
      </div>
      <SearchBar />
      <div className="flex justify-center">
        <FileList />
      </div>
      <LibDisplay visible={isFormVisible} onClose={handleCloseForm} />
    </div>
  );
};

export default Library;
