import React, { useState } from 'react';
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
    <>
      <Layout>
        <main className="bg-cover min-h-screen bg-red-100 bg-center relative">
          <section className="xl:padding-l wide:padding-r padding-b mb-12"> {/* Added margin-bottom */}
            <Hero />
          </section>

          {/* Features Section */}
          <section className="features xl:padding-l wide:padding-r padding-b mb-12 bg-red-100"> {/* Added margin-bottom */}
            <h2 className="text-2xl font-bold mb-6 text-center">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="feature text-center p-6 bg-white rounded-lg shadow-md">
                <FaTachometerAlt className="mx-auto mb-4 text-4xl text-blue-500" />
                <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
                <p>See an overview of your current progress with detailed analytics and insights.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="feature text-center p-6 bg-white rounded-lg shadow-md">
                <FaBook className="mx-auto mb-4 text-4xl text-green-500" />
                <h3 className="text-xl font-semibold mb-2">Study Activities</h3>
                <p>Plan and track your learning activities to stay on top of your study goals.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="feature text-center p-6 bg-white rounded-lg shadow-md">
                <FaUser className="mx-auto mb-4 text-4xl text-purple-500" />
                <h3 className="text-xl font-semibold mb-2">Match Portal</h3>
                <p>Manage and connect with your match partners through a dedicated portal.</p>
              </div>
            </div>
          </section>

          {/* Contact Us Form */}
          <section className="contact-form xl:padding-l wide:padding-r padding-b mb-12 bg-red-100"> {/* Added margin-bottom */}
            <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
            <form className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="font-palanquin font-bold text-xl bg-red-600 text-white px-4 py-2 rounded-[5px] hover:bg-red-400 shadow-lg transition-transform transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                  Send
                </button>
              </div>
              {status && <p className="mt-4 text-center">{status}</p>}
            </form>
          </section>
        </main>
      </Layout>
    </>
  );
};

export default Home;
