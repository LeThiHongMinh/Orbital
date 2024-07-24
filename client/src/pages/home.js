import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux'; // Import useSelector to access dark mode state
import Layout from "../components/layout";
import Hero from '../components/Hero';
import { FaTachometerAlt, FaBook, FaUser } from 'react-icons/fa';
import { contactUs } from '../api/auth';

const Home = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true });
  const { ref: featuresRef, inView: featuresInView } = useInView({ triggerOnce: true });
  const { ref: contactFormRef, inView: contactFormInView } = useInView({ triggerOnce: true });

  // Access dark mode state from Redux
  const isDarkMode = useSelector(state => state.ui.isDarkMode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const response = await contactUs(formData);
      if (response.status === 200) {
        setStatus('Your message has been sent. We will get back to you soon!');
        setFormData({ full_name: '', email: '', message: '' }); // Clear form
      } else {
        setStatus('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Something went wrong. Please try again.');
    }
  };

  return (
    <Layout>
      <main className={`min-h-screen bg-cover bg-center relative ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-red-100 text-gray-800'}`}>
        <section
          className={`fade-in py-4 mb-4 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-1000`}
          ref={heroRef}
        >
          <Hero />
        </section>

        {/* Features Section */}
        <section
          className={`fade-in py-4 mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-red-100'} ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-1000`}
          ref={featuresRef}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">{isDarkMode ? 'About NUStudySeeker' : 'About NUStudySeeker'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {/* Feature 1 */}
            <div className={`feature text-center p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <FaTachometerAlt className={`mx-auto mb-4 text-4xl ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} />
              <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>See an overview of your current progress with detailed analytics and insights.</p>
            </div>
            
            {/* Feature 2 */}
            <div className={`feature text-center p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <FaBook className={`mx-auto mb-4 text-4xl ${isDarkMode ? 'text-green-300' : 'text-green-500'}`} />
              <h3 className="text-xl font-semibold mb-2">Study Activities</h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Plan and track your learning activities to stay on top of your study goals.</p>
            </div>
            
            {/* Feature 3 */}
            <div className={`feature text-center p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <FaUser className={`mx-auto mb-4 text-4xl ${isDarkMode ? 'text-purple-300' : 'text-purple-500'}`} />
              <h3 className="text-xl font-semibold mb-2">Match Portal</h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage and connect with your match partners through a dedicated portal.</p>
            </div>
          </div>
        </section>

        {/* Contact Us Form */}
        <section
          className={`fade-in py-4 mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-red-100'} ${contactFormInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-1000`}
          ref={contactFormRef}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">{isDarkMode ? 'Contact Us' : 'Contact Us'}</h2>
          <form className={`max-w-lg mx-auto p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className={`block text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={`w-full p-3 border border-gray-300 rounded-lg mt-1 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'}`}
                required
              />
            </div>
            <div className="mb-4">
              <label className={`block text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border border-gray-300 rounded-lg mt-1 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'}`}
                required
              />
            </div>
            <div className="mb-4">
              <label className={`block text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`w-full p-3 border border-gray-300 rounded-lg mt-1 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'}`}
                required
              ></textarea>
            </div>
            <div className="text-center">
            <button
  type="submit"
  className={`font-semibold text-lg px-5 py-2.5 rounded-lg shadow-md transition-colors 
    ${isDarkMode ? 'bg-[#bb86fc] text-white hover:bg-[#8c4dff]' : 'bg-red-600 text-white hover:bg-red-500'}`}
>
  Send
</button>

            </div>
            {status && <p className={`mt-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{status}</p>}
          </form>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
