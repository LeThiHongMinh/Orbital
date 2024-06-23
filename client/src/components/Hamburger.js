import { blue, red } from '@mui/material/colors';
import ButtonSvg from '../assets/svg/ButtonSvg';
const Hamburger = ({className, href, onClick, children, px, white}) => {
    const classes = `button relative inline-flex items-center justify-center h-11 transition-colors hover:text-color-1 ${px || "px-7"} ${white ? "text-n-8" : "text-n-1"} ${className || ""}`;
   const spanClasses = 'relative z-10 ';
    const renderButton = () => (
    <button className={classes} onClick={onClick}>
        <span className={spanClasses}> {children} </span>
        {ButtonSvg(blue)}  
          </button>
   );
   const renderLink = () => (
    <a href={href} className = {classes}>
         <span className={spanClasses}> {children} </span>
        {ButtonSvg(blue)}
    </a>
   );

return href ? renderLink() : renderButton();
};
export default Hamburger;