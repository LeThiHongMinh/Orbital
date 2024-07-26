import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import { star } from '../assets/icons';
import { submitForm } from "../api/auth";
import Layout from '../components/layout'; // Adjust the path as necessary

const Matchmaking = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    courseCode: '',
    expectations: '',
    academicLevel: 'not really good',
    studyGoal: 'A- and above'
  });

  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');
  const isAuth = useSelector(state => state.auth.isAuth);
  const isDarkMode = useSelector(state => state.ui?.isDarkMode ?? false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuth) {
      setError('Please login to submit the form.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      await submitForm(formData);
      console.log('Form submitted successfully!');
      setNotification('Form submitted successfully!');

      // Optionally, you can reset the form fields after submission
      setFormData({
        fullName: '',
        courseCode: '',
        expectations: '',
        academicLevel: 'not really good',
        studyGoal: 'A- and above'
      });

      // Hide the notification after 3 seconds
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to submit the form. Please try again later.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <Layout>
      <div className={`ml-3 flex flex-col justify-center min-h-screen bg-cover bg-center relative ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-red-100 text-red-900'}`}>
        <div className="ml-10 py-10 flex items-center">
          <img 
            src={star}
            alt="star"
            width={100}
            height={100}
            className="relative z-10"
          />
          <div className={`text-8xl mt-10 font-palanquin ml-10 max-sm:text-[72px] max-sm:leading-[82] font-bold shadow-lg xl:whitespace-nowrap relative z-10 pr-10 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Matchmaking
          </div>
        </div>
        <section className="font-bold font-palanquin">
          <div className='w-full'>
            <form className="p-2 w-full" onSubmit={handleSubmit}>
              <span className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Full Name</span>
              <TextField
                required
                sx={{ width: 20 }}
                style={{ width: '100%' }}
                id="outlined-basic"
                variant="outlined"
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`block fullWidth bg-transparent text-sm border-0 rounded-md focus:outline-none focus:outline-transparent p-2 ring-inset focus:ring-2 focus:ring-inset ring-1 ${isDarkMode ? 'text-white placeholder:text-gray-400 ring-gray-700' : 'text-slate-700 placeholder:text-slate-900 ring-slate-300'} shadow-xl`}
              />
              <br />
              <span className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Course code you want to find study partner</span>
              <TextField
                required
                multiline
                rows={2}
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                id="outlined-basic"
                variant="outlined"
                className={`block w-full bg-transparent text-sm border-0 rounded-md focus:outline-none focus:outline-transparent p-2 ring-inset focus:ring-2 focus:ring-inset ring-1 ${isDarkMode ? 'text-white placeholder:text-gray-400 ring-gray-700' : 'text-slate-700 placeholder:text-slate-900 ring-slate-300'} shadow-xl`}
              />
              <br />
              <span className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Any expectations</span>
              <br />
              <TextField
                required
                multiline
                rows={4}
                name="expectations"
                id="outlined-basic"
                value={formData.expectations}
                onChange={handleChange}
                className={`block w-full bg-transparent text-sm border-0 rounded-md focus:outline-none focus:outline-transparent p-2 ring-inset focus:ring-2 focus:ring-inset ring-1 ${isDarkMode ? 'text-white placeholder:text-gray-400 ring-gray-700' : 'text-slate-700 placeholder:text-slate-900 ring-slate-300'} shadow-xl`}
              />
              <div className='space-x-96 py-5'>
                <FormControl>
                  <span className={`${isDarkMode ? 'text-white' : 'text-black'}`} id="demo-radio-buttons-group-label">Current Academic Level</span>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="academicLevel"
                    value={formData.academicLevel}
                    onChange={handleChange}
                  >
                    <FormControlLabel value="not really good" control={<Radio />} label="Not Really Good" />
                    <FormControlLabel value="good" control={<Radio />} label="Good" />
                  </RadioGroup>
                </FormControl>
                <FormControl>
                  <span className={`${isDarkMode ? 'text-white' : 'text-black'}`} id="expect">Study Goal</span>
                  <RadioGroup
                    aria-labelledby="expect"
                    name="studyGoal"
                    value={formData.studyGoal}
                    onChange={handleChange}
                  >
                    <FormControlLabel value="A- and above" control={<Radio />} label="A- and above" />
                    <FormControlLabel value="None" control={<Radio />} label="None" />
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="text-center p-2 w-full">
                <button className={`inline-flex items-center justify-center py-2.5 px-5 gap-x-2 text-base whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${isDarkMode ? 'text-slate-950 bg-red-500 outline-indigo-500 hover:bg-red-300 active:bg-red-900' : 'text-slate-50 bg-red-500 outline-indigo-500 hover:bg-red-300 active:bg-red-900'} shadow-xl`} type="submit">
                  <div>Submit</div>
                </button>
              </div>
              {notification && (
                <div className={`text-center p-2 w-full mt-4 ${isDarkMode ? 'text-green-300' : 'text-green-500'} font-bold`}>
                  {notification}
                </div>
              )}
              {error && (
                <div className={`text-center p-2 w-full mt-4 ${isDarkMode ? 'text-red-300' : 'text-red-500'} font-bold`}>
                  {error}
                </div>
              )}
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Matchmaking;
