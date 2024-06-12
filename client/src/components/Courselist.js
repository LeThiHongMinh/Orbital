import React, { useState, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import SearchCourse from './Searchcourse';
import CourseDetail from './Coursedetail';

const CourseList = () => {
  const [courses, setCourses] = useState(() => {
    const storedCourses = localStorage.getItem('courses');
    return storedCourses ? JSON.parse(storedCourses) : [];
  });

  const [courseInfo, setCourseInfo] = useState({
    courseName: '',
    courseCode: '',
    faculty: '',
    aimedLevel: '',
  });

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseInfo((prevCourseInfo) => ({
      ...prevCourseInfo,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCourses((prevCourses) => [...prevCourses, courseInfo]);
    setCourseInfo({
      courseName: '',
      courseCode: '',
      faculty: '',
      aimedLevel: '',
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center justify-center p-8 bg-white shadow-lg rounded-t-lg max-w-3xl w-full mx-auto">
      <h3 className="text-xl mb-4">Course List</h3>
      <div className="flex w-full justify-between">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 mr-4">
          <input
            type="text"
            name="courseName"
            value={courseInfo.courseName}
            onChange={handleChange}
            placeholder="Course Name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            name="courseCode"
            value={courseInfo.courseCode}
            onChange={handleChange}
            placeholder="Course Code"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            name="faculty"
            value={courseInfo.faculty}
            onChange={handleChange}
            placeholder="Faculty"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            name="aimedLevel"
            value={courseInfo.aimedLevel}
            onChange={handleChange}
            placeholder="Aimed Level"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Add Course
          </button>
        </form>
        <ul className="w-full max-w-md">
          {courses.map((course, index) => (
            <li key={index} className="bg-gray-100 rounded-lg p-4 mb-2">
              <Link to={`/course/${course.courseCode}`} className="text-blue-500 hover:underline">
                <span className="font-bold">{course.courseName}</span> - {course.courseCode} - {course.faculty} - {course.aimedLevel}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <SearchCourse courses={courses} />
    </div>
  );
};

export default CourseList;
