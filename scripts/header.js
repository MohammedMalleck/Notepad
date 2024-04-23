export function headerJsCode(){

//access elements
const mainEl = document.querySelector('.js-main-section'); 
const deleteEl = document.querySelector('.js-delete');
const confirmationHolderEl = document.querySelector('.js-confirmation-holder');
const fontOptionEl = document.querySelector('.js-font-option');
const inputContainerEl = document.querySelector('.js-input-container');
const inputEl = document.querySelector('input');
const fontSizeTooltipEl = document.querySelector('.font-size-tooltip');
let fontSizeTooltipElLEFT;
let multiplier;

//on clicking delete icon check if there is an active note on the page
//(ie : there is atleast one note that can be deleted).
//if yes , then display the confirmation message
deleteEl.addEventListener('click' , ()=>{
  const activeNoteEl =  document.querySelector('.active-note');
  if(activeNoteEl){
    confirmationHolderEl.classList.add('show');
  }
});

fontOptionEl.addEventListener('click' , (event)=>{
  const activeNoteEl =  document.querySelector('.active-note');
  const mainElDisplayed = getComputedStyle(mainEl).display === 'flex';
  //diplay range container only if main-section is displayed and 
  //there is atleast one note in the page
  if(activeNoteEl && mainElDisplayed){
    fontOptionEl.classList.toggle('show');
  }
  //on clicking font option el , stop event propagation so that body click
  //event is not triggered 
  event.stopPropagation();
});

inputContainerEl.addEventListener('click' , (event)=>{
  //on clicking input container , stop event propagation so that body click
  //event is not triggered
  event.stopPropagation();
});

document.body.addEventListener('click' , ()=>{
  //whenever body click is tirggered 
  //hide the range container
  fontOptionEl.classList.remove('show');
});

inputEl.addEventListener('input',handleFontSizeChanges);

window.addEventListener('resize',()=>{
  //on resizing the page make sure the
  //font displaying tooltip has positions according to the 
  //range container's width
  positionFontSizeTooltip();
});

function handleFontSizeChanges(){
  renderDataForFontChange();
  //access text note element and it's ID
  const textNoteEl = document.querySelector('.js-txt-body');
  const activeId = textNoteEl.id;
  //create a unique LS name  
  const setName = 'textFontSize' + activeId;
  //get the new font size
  const newFontSize = Number(inputEl.value);
  //get the tooltip(the one displaying the font size)new left value according to the new font size
  const newTooltipLeftValue = fontSizeTooltipElLEFT + (newFontSize * multiplier);
  //give the tooltip the new left value
  fontSizeTooltipEl.style.left = `${newTooltipLeftValue}%`;
  //diplay the new font size digit in the tooltip
  fontSizeTooltipEl.innerHTML = newFontSize;
  //convert the new font size to rem unit
  const newFontSizeREM = `${newFontSize * 0.1}rem`;
  //give the text note el the new font size
  textNoteEl.style.fontSize = `${newFontSizeREM}`;
  //save the new font size
  localStorage.setItem(setName,JSON.stringify(newFontSizeREM));
}
function renderDataForFontChange(){
  //assign data to calculate correct positions
  //of the font describing tooltip
  const screenWidth = window.innerWidth;
  if(screenWidth < 360.1){
    fontSizeTooltipElLEFT = -20;
    multiplier = 0.77;
  }else{
    fontSizeTooltipElLEFT= -15;
    multiplier = 0.81;
  }
}
function positionFontSizeTooltip(){
  renderDataForFontChange();
  //position font describing tooltip according to rnage container width(which below 360px screen width)
  const newFontSize = Number(inputEl.value);
  const newTooltipLeftValue = fontSizeTooltipElLEFT + (newFontSize * multiplier);
  fontSizeTooltipEl.style.left = `${newTooltipLeftValue}%`;
}
}
