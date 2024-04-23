import { renderSideNotes } from "./renderSideNotes.js";
import { renderMainPage , displayMainPage } from "./renderMainPage.js";
import { headerJsCode } from "./header.js";
import { setEventListeners } from "./setEventListeners.js";
import { setCopyEvents } from "./setCopyEvents.js";

//set event listeners once for the confirmaiton message buttons
setEventListeners();
//dont enable animations on page reload
renderSideNotes(false);
renderMainPage();
//add event listeners to elements present in the head section
headerJsCode();
//set copy btn events 
setCopyEvents();


//display main page on reload in smaller screen widths
const screenWidth = window.innerWidth;
const showNote = JSON.parse(localStorage.getItem('showNote')) || false;
const sideEl = document.querySelector('.js-side-section');
const mainEl = document.querySelector('.js-main-section'); 
displayMainPage(showNote,screenWidth);
//display main page as the user changes the screen width
window.addEventListener('resize' , ()=>{
  const screenWidth = window.innerWidth;
  const showNote = JSON.parse(localStorage.getItem('showNote')) || false;
  if(screenWidth > 360.1){
    sideEl.classList.remove('hide');
    mainEl.classList.remove('show');
  }
  displayMainPage(showNote,screenWidth);
});