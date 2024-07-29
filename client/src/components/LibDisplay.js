import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector to access dark mode state
import axios from 'axios';
import PropTypes from 'prop-types';

const LibDisplay = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const isDarkMode = useSelector((state) => state.ui.isDarkMode); // Access dark mode state from Redux store

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !description || !file) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('file', file);

    try {
      const response = await axios.post('https://orbital-kq4q.onrender.com/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('File uploaded successfully');
        // Optionally reset form fields after successful upload
        setName('');
        setDescription('');
        setFile(null);
        onClose();
      } else {
        alert('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-600'}`}>
      <div className={`max-w-lg mx-auto mt-10 p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Upload Note or Resource
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Description:
            </label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Upload PDF:
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${isDarkMode ? 'file:bg-gray-700 file:text-gray-400 hover:file:bg-gray-800' : 'file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100'}`}
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className={`bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isDarkMode ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

LibDisplay.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LibDisplay;
