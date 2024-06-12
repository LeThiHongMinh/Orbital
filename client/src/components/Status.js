import React from 'react';

const StatusComponent = ({ numLessons, numQuizzes, numPrototypes, numHours }) => {
  return (
    <div className="status-component fixed left-0 bottom-0 p-4 bg-white shadow-lg rounded-lg w-full max-w-md">
      <h3 className="text-lg font-semibold mb-60">Your Progress</h3>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Lessons Completed</p>
          <p className="text-xl font-semibold text-gray-900">{numLessons}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Quizzes Completed</p>
          <p className="text-xl font-semibold text-gray-900">{numQuizzes}</p>
        </div>
      </div>
      <div className="flex justify-between mt-60">
        <div>
          <p className="text-sm font-medium text-gray-600">Prototypes Completed</p>
          <p className="text-xl font-semibold text-gray-900">{numPrototypes}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Hours Learned</p>
          <p className="text-xl font-semibold text-gray-900">{numHours}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusComponent;
