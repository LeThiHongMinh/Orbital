import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector to access dark mode state
import axios from 'axios';

const SearchBarLib = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const isDarkMode = useSelector((state) => state.ui.isDarkMode); // Access dark mode state from Redux store

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching for files:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`max-w-lg mx-auto mt-10 p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <h2 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
        Search Books
      </h2>
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
        />
        <button
          onClick={handleSearch}
          className={`mt-4 w-full ${isDarkMode ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <div>
        {results.length > 0 ? (
          <ul>
            {results.map((result) => (
              <li key={result.id} className={`mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                <strong>{result.name}</strong>: {result.description}
              </li>
            ))}
          </ul>
        ) : (
          <p className={`text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>
            No results found.
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchBarLib;
