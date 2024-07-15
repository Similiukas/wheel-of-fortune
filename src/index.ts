import { startAnimation } from './header-animation';
import './style.css';
import { setUpWheel, spinWheel } from './wheel-animation';

startAnimation();
setUpWheel();

document.querySelector('#button')?.addEventListener('click', spinWheel);
