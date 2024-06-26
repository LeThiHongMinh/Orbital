import React, { useState } from 'react';
import Layout from './layout'; // Adjust the path as necessary
import LibDisplay from './LibDisplay';
import SearchBar from './SearchBarLib';

const Library = () => {
  const [isFormVisible, setFormVisible] = useState(false);

  const handleShowForm = () => {
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Library</h1>
            <button
              onClick={handleShowForm}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Upload Notes
            </button>
          </div>
          <SearchBar />
          <div className="mt-8">
            <LibDisplay visible={isFormVisible} onClose={handleCloseForm} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Library;
