import TextField  from '@mui/material/TextField';
import { Input } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { star } from '../assets/icons';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
const Matchmaking = () => {
  return (
    <>
    
    <div className='ml-3 flex relative flex-col justify-center'>
  
    <div className="ml-10 py-10 flex items-center">
    <img 
                src = {star}
                alt = "star"
                width = {100}
                height =  {100}
                className = " relative z-10"
                />
    <div className="text-black mt-10 font-palanquin text-8xl ml-10  max-sm:text-[72px] max-sm:leading-[82] font-bold shadow-lg xl:whitespace-nowrap relative z-10 pr-10">Matchmaking</div>
   <br />
   </div>
    <section className=" text-red-900 font-bold font-palanquin">
    <div className='w-full'>
    <span className="flex-wrap mt-10 relative space-y-20 "> Your full name </span>
    <form className="p-2 w-full">
    <TextField sx={{width:20}} style={{ width: '100%' }} id="outlined-basic" label="Full name as shown in your student card" variant="outlined" className="block fullWidth bg-transparent text-sm border-0 rounded-md focus:outline-none focus:outline-transparent p-2 ring-inset focus:ring-2 focus:ring-inset ring-1 disabled:text-slate-900 disabled:dark:text-slate-900 disabled:bg-slate-200 disabled:dark:bg-slate-800 disabled:cursor-not-allowed text-slate-700 dark:text-slate-900 placeholder:text-slate-900 placeholder:dark:text-slate-900 ring-slate-300 dark:ring-slate-700 focus:ring-red-950 focus:dark:ring-red-900 shadow-xl"/>
    </form>
    
    </div>
    <br/>
    <span> Course code you want to find study partner </span>
    <form className="p-2 w-full">
    <TextField multiline rows = {2} id="outlined-basic" label="Be careful to spell it correctly!" variant="outlined" className="block w-full bg-transparent text-sm border-0 rounded-md focus:outline-none focus:outline-transparent p-2 ring-inset focus:ring-2 focus:ring-inset ring-1 disabled:text-slate-900 disabled:dark:text-slate-900 disabled:bg-slate-200 disabled:dark:bg-slate-800 disabled:cursor-not-allowed text-slate-700 dark:text-slate-900 placeholder:text-slate-900 placeholder:dark:text-slate-900 ring-slate-300 dark:ring-slate-700 focus:ring-red-950 focus:dark:ring-red-900 shadow-xl"/>
    
    </form>
    <br/>
    <span className=""> Any expectations </span>
    <br />
    <form className="p-2 w-full">
    
    <TextField multiline rows = {4} id="outlined-basic" label="Anything that you want to see at your future studymate" variant="outlined" className="block w-full bg-transparent text-sm border-0 rounded-md focus:outline-none focus:outline-transparent p-2 ring-inset focus:ring-2 focus:ring-inset ring-1 disabled:text-slate-900 disabled:dark:text-slate-900 disabled:bg-slate-200 disabled:dark:bg-slate-800 disabled:cursor-not-allowed text-slate-700 dark:text-slate-900 placeholder:text-slate-900 placeholder:dark:text-slate-900 ring-slate-300 dark:ring-slate-700 focus:ring-red-950 focus:dark:ring-red-900 shadow-xl"/>
    </form>
    <div className='space-x-96 py-5'>
    <FormControl>
  <span className= " text-red-900 font-bold font-palanquin" id="demo-radio-buttons-group-label"> Current Academic Level</span>
  <RadioGroup
    aria-labelledby="demo-radio-buttons-group-label"
    defaultValue="not really good"
    name="radio-buttons-group"
  >
    <FormControlLabel value="not really good" control={<Radio />} label="Not Really Good" />
    <FormControlLabel value="good" control={<Radio />} label="Good" />
    
  </RadioGroup>
</FormControl>
<FormControl>
  <span className= " text-red-900 font-bold font-palanquin" id="expect"> Study Goal</span>
  <RadioGroup
    aria-labelledby="expect"
    defaultValue="A- and above"
    name="expectations"
  >
    <FormControlLabel value="A- and above" control={<Radio />} label="A- and above" />
    <FormControlLabel value="None" control={<Radio />} label="None" /> 
  </RadioGroup>
</FormControl>
</div>
    <div class="text-center p-2 w-full">
          <button className ="inline-flex items-center justify-center py-2.5 px-5 gap-x-2 text-base whitespace-nowrap  rounded-md font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 text-slate-50 dark:text-slate-950 bg-red-500 dark:bg-red-500 outline-indigo-500 dark:outline-indigo-500 hover:bg-red-300 hover:dark:bg-red-300 active:bg-red-900 active:dark:bg-red-900 focus-visible:bg-red-900 focus-visible:dark:bg-red-900 disabled:text-white disabled:border-transparent disabled:bg-slate-300 disabled:dark:bg-slate-700 disabled:cursor-not-allowed shadow-xl">
            <div>Submit</div>
          </button>
        </div>
        
    </section>
    </div>
    </>
  );
};

export default Matchmaking;