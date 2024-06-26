import React, { useState } from 'react';
import axios from 'axios';

const SearchBarLib = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching for files:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Search Books</h2>
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          onClick={handleSearch}
          className="mt-4 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Search
        </button>
      </div>
      <div>
        {results.length > 0 && (
          <ul>
            {results.map((result) => (
              <li key={result.id} className="mb-2">
                <strong>{result.name}</strong>: {result.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBarLib;
