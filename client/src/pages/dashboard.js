import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProtectedInfo, onLogout } from '../api/auth';
import Layout from '../components/layout';
import { unauthenticateUser } from '../redux/slices/authSlice';
import Calendar from 'react-calendar';
import CalendarCom from '../components/Calendar';
import ProgressBar from '../components/ProgressBar';
import ToDoList from '../components/Todo';
//import CourseList from '../components/Courselist';
import SearchCourse from '../components/Searchcourse';
import CourseList from '../components/Courselist';
import StatusComponent from '../components/Status';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState(null);

  const logout = async () => {
    try {
      await onLogout();

      dispatch(unauthenticateUser());
      localStorage.removeItem('isAuth');
    } catch (error) {
      console.log(error.response);
    }
  };

  const protectedInfo = async () => {
    try {
      const { data } = await fetchProtectedInfo();

      setProtectedData(data.info);

      setLoading(false);
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    protectedInfo();
  }, []);

  return loading ? (
    <Layout className="bg-red-400">
      <div className="bg-red-100">
      <ProgressBar />
        <CalendarCom className="flex flex-col right-0" />
        <ToDoList />
        <CourseList />
        <SearchCourse />
        <StatusComponent numLessons={10} numQuizzes={5} numPrototypes={3} numHours={20} />

       
        <h1>
          <div className=" bg-red-400 px-5 border-r-4 shadow-lg">
            <h2 className="pb-5 text-6xl text-red-700">
            </h2>
            
          </div>
        </h1>
        
      </div>
    </Layout>
  ) : (
    <div>
      <Layout>
        <h1 className>Dashboard</h1>
        <h2>{protectedData}</h2>

        <button onClick={() => logout()} className="btn btn-primary">
          Logout
        </button>
      </Layout>
    </div>
  );
};

export default Dashboard;
