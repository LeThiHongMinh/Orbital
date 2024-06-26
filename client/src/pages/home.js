import Layout from "../components/layout"
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Matchmaking from '../pages/Matchmaking';
import { image2vector } from '../assets/images';
//import './index';
//import { backtem } from './assets/images';

const Home =  () => {
    return (
      <>
      <Layout >
        <main className = " bg-cover min-h-screen bg-red-100 bg-center relative">
        
    <section className="xl:padding-l wide:padding-r padding-b">
      <Hero />
    </section>
    </main>
    </Layout>
    </>
    )
  }
  
export default Home