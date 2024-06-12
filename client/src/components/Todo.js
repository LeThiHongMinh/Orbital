import { useState, useEffect } from 'react';
import NUSTudy from '../assets/images/NUSTudy.png'; // Ensure this path is correct

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  // Load tasks from local storage when the component mounts
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (task.trim()) {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask('');
    }
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const toggleTaskCompletion = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  return (
    <div className="fixed bottom-8 right-8 p-4 bg-red-100 shadow-lg rounded-lg w-full max-w-md">
      <h3 className="text-2xl font-semibold mb-4 text-red-700">To-Do List</h3>
      <form onSubmit={addTask} className="flex mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border border-red-300 p-2 rounded-l-lg flex-grow focus:outline-none focus:border-red-500"
          placeholder="Enter a new task"
        />
        <button
          type="submit"
          className="bg-red-500 text-white p-2 rounded-r-lg hover:bg-red-600 transition"
        >
          Add
        </button>
      </form>
      <ul className="list-disc list-inside">
        {tasks.map((task, index) => (
          <li
            key={index}
            className={`flex items-center justify-between mb-2 p-2 rounded ${
              task.completed ? 'bg-red-200 line-through' : 'bg-red-50'
            }`}
          >
            <span
              onClick={() => toggleTaskCompletion(index)}
              className="cursor-pointer flex items-center flex-grow"
            >
              <img
                src={NUSTudy}
                alt="NUSTudy Logo"
                width={50}
                height={50}
                className="mr-2"
              />
              {task.text}
            </span>
            <button
              onClick={() => deleteTask(index)}
              className="text-red-500 hover:text-red-700 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
