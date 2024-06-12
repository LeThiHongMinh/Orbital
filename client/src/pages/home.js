import Layout from "../components/layout"
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Matchmaking from '../components/Matchmaking';
import { image2vector } from '../assets/images';
//import './index';
//import { backtem } from './assets/images';

const Home =  () => {
    return (
      <>
      <Layout >
        <main className = " bg-cover min-h-screen bg-red-100 bg-center relative">
        
      <Nav />
    <section className="xl:padding-l wide:padding-r padding-b">
      <Hero />
    </section>
    <section className="bg-cover min-h-screen bg-red-100 bg-center relative">
      <Matchmaking />
    </section>
    </main>
    </Layout>
    </>
    )
  }
  
export default Home