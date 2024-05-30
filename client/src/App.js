import Nav from './components/Nav';
import Hero from './components/Hero';
import Matchmaking from './components/Matchmaking';
//import { backtem } from './assets/images';
import './App.css';
function App() {
  return (
    <main className = "bg-today bg-cover bg-center relative">
      <Nav />
    <section className="xl:padding-l wide:padding-r padding-b">
      <Hero />
    </section>
    <section>
      <Matchmaking />
    </section>
    </main>
);
}



export default App