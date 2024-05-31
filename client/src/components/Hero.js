import Button from "../components/Button";
import { arrowRight } from "../assets/icons";
import { study } from "../assets/images";
const Hero = () => {
  return (
    
    <section
    id = "home"
    className=" flex xl:flex-row flex-col min-h-screen gap-10 max-container text-left ml-10">
        <div className = "relative xl:w-2/5 flex flex-col justify-center items-start w-full max-wl:padding-x pt-28">
        <p className = "text-4xl text-left font-semibold font-montserrat text-coral-red text-bold"> Dora The Kids</p> 
            <h1 className = "text-black  mt-10 font-palanquin text-8xl max-sm:text-[72px] max-sm:leading-[82] font-bold">
            <span className = "text-black shadow-lg xl:whitespace-nowrap relative z-10 pr-10">The Best Place </span>
            <br/>
            <span className="shadow-lg space-x-30 ">To Find</span>
            
            <span className = "text-red-700 shadow-lg inline-block mt-3 "> Study Partner </span>
            </h1>
            <Button iconURL={arrowRight}/>
        </div>
        <span className = "relative flex-1 flex justify-center items-center xl:min-h-screen max-xl:py-40 ">
                <img 
                src = {study}
                alt = "Big shoes"
                width = {500}
                height =  {500}
                className = "object-contain relative z-10"
                />
                </span>
    </section>

  );
};

export default Hero;