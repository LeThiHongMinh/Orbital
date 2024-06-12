// SearchCourse.js
import React, { useState } from 'react';

const SearchCourse = ({ courses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    filterResults(e.target.value);
  };

  const filterResults = (term) => {
    if (!Array.isArray(courses)) return; // Check if courses is not an array

    const filteredResults = courses.filter((course) =>
      course.courseName.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  return (
    <div className="fixed mt-1 left-0 p-4 bg-gray-200 shadow-lg rounded-lg max-w-md w-full">
      <h3 className="text-lg mb-4">Search Courses by Course Code</h3>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Enter course code..."
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
      />
      <ul className="mt-4">
        {searchResults.map((course, index) => (
          <li key={index} className="mb-2">
            <span className="font-bold">{course.courseName}</span> - {course.courseCode} - {course.faculty} - {course.aimedLevel}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchCourse;
