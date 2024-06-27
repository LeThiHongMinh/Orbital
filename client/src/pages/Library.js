import React, { useState } from 'react';
import Layout from '../components/layout'; // Adjust the path as necessary
import LibDisplay from '../components/LibDisplay';
import SearchBar from '../components/SearchBarLib';
import FileList from '../components/FileList';

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
      <div className="mx-auto p-4 bg-red-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold items-center justify-center text-red-800">Library</h1>
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
          <div className="mt-8">
            <LibDisplay visible={isFormVisible} onClose={handleCloseForm} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Library;
