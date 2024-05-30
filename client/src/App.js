import Nav from './components/Nav';
import Hero from './components/Hero';
import Matchmaking from './components/Matchmaking';
import { image2vector } from './assets/images';
//import './index';
//import { backtem } from './assets/images';
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