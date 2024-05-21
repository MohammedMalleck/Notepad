import { notesStorage , saveNotesStorage } from "./data.js";
import { renderSideNotes } from "./renderSideNotes.js";

//access elements present in page
const sideEl = document.querySelector('.js-side-section');
const mainEl = document.querySelector('.js-main-section'); 
const fontOptionEl = document.querySelector('.js-font-option');
let headingElementEnter;
let subHeadingElementEnter;

export function renderMainPage(){
  if(notesStorage.length > 0){
    //access the note with active class
    const currentNote = document.querySelector('.active-note');
    //fetch the ID assigned to this note
    const currentNoteId =Number(currentNote.id);
    //get the saved font size if any
    const getName = 'textFontSize' + currentNoteId;
    const textFontSize = JSON.parse(localStorage.getItem(getName)) || false;
    //create style statement for saved font size
    const textStyle = textFontSize ? `style="font-size:${textFontSize};"` : '';
    //find the matching note
    const matchedNote = notesStorage.find(note => currentNoteId === note.id)

    const html = 
    `
      <div class="js-go-back go-back-container">
        <div>< Go Back</div>
      </div>
      <div contenteditable="true" class="js-txt-heading text-container-heading">
      ${matchedNote.heading}
      </div>
      <div contenteditable="true" class="js-txt-sub-heading text-container-sub-heading">
      ${matchedNote.subHeading}
      </div>
      <div id="${matchedNote.id}" ${textStyle}  contenteditable="true" class="js-txt-body text-container-body">
      ${matchedNote.text}
      </div>
    `;

    document.querySelector('.js-text-container').innerHTML = html;  

    //access dynamically generated elements
    const backContainerEl = document.querySelector('.js-go-back');
    const headingNoteEl = document.querySelector('.js-txt-heading');
    const subHeadingNoteEl = document.querySelector('.js-txt-sub-heading');
    const textNoteEl = document.querySelector('.js-txt-body');

    //on clicking back element hide main-section of the page
    //and display side-section of the page
    backContainerEl.addEventListener('click' , ()=>{
      sideEl.classList.remove('hide');
      mainEl.classList.remove('show');
      //remove the flag created to display main-section of page 
      //on reloading provided that the screen width is less than 360px
      localStorage.removeItem('showNote');
    });

    headingNoteEl.addEventListener('input' ,()=>{
    //get the new text inside the heading element
     const newHeadingNote = headingNoteEl.textContent;
     //get the current active note and its ID
     const activeNote = document.querySelector('.active-note');
     const activeNoteId = Number(activeNote.id);
     //save the new heading in notes array
     notesStorage.forEach((note)=>{
      if(note.id === activeNoteId){
        note.heading = newHeadingNote;
      }
     });
     //save the modified notes array
     saveNotesStorage(notesStorage);
     //render side notes section
     renderSideNotes();
    });

    subHeadingNoteEl.addEventListener('input' , ()=>{
      //check if the change was a shift of focus
      //from heading to sub heading
      if(headingElementEnter){
        //if yes , then remove the newly generated div
        //and make the variable used to check the foucs false
        const newDiv = subHeadingNoteEl.children[0];
        newDiv.remove();
        headingElementEnter = false;
      }else{
        //if no , then it means that the user
        //has changed the sub heading

        //get the new changed sub heading
        const newSubHeadingNote = subHeadingNoteEl.innerHTML;
        //get the current active note and its ID
        const activeNote = document.querySelector('.active-note');
        const activeNoteId = Number(activeNote.id);
        //save the new sub heading in the notes array
        notesStorage.forEach((note)=>{
        if(note.id === activeNoteId){
          note.subHeading = newSubHeadingNote;
        }
        });
        //save the modified notes array
        saveNotesStorage(notesStorage);
      }
    });

    textNoteEl.addEventListener('input' , ()=>{
      //check if the change was a shift of focus
      //from sub heading to text 
      if(subHeadingElementEnter){
        //if yes , then remove the newly generated div
        //and make the variable used to check the foucs false
        const newDiv = textNoteEl.children[0];
        newDiv.remove();
        subHeadingElementEnter = false;
      }else{
        //if no , then it means that the user
        //has changed the text

        //get the new changed text
        const newTextNote = textNoteEl.innerHTML;
        //get the current active note and its ID
        const activeNote = document.querySelector('.active-note');
        const activeNoteId = Number(activeNote.id);
        //save the new text in the notes array
        notesStorage.forEach((note)=>{
        if(note.id === activeNoteId){
          note.text= newTextNote;
        }
        });
        //save the modified notes array
        saveNotesStorage(notesStorage);
      }
    });


    //shift focus of heading and sub heading element
    //to sub heading and text element repectively 
    //on clicking "enter" on them.

    headingNoteEl.addEventListener('keydown',(event)=>{
      if(event.key === 'Enter'){
        subHeadingNoteEl.focus();
        headingElementEnter = true;
      }
    });
    
    subHeadingNoteEl.addEventListener('keydown',(event)=>{
      if(event.key === 'Enter'){
        textNoteEl.focus();
        subHeadingElementEnter = true;
      }
    });

}else {
  document.querySelector('.js-text-container').innerHTML = 
  `
    <div class="empty-text-main">
      <span>Empty</span>
    </div>
  `;
}
}
export function displayMainPage(showNote,screenWidth){
  //if screen width is less then 360px and showNote flag is true then 
  //display main-section and hide side-section of the page
  if(showNote && screenWidth < 360.1){
    sideEl.classList.add('hide');
    mainEl.classList.add('show');
  }else if(!showNote && screenWidth < 360.1){
    //if showNote flag is false(main-section is hidden) and 
    //screen width is less then 360px , then remove show class from 
    //font option element in the header
    fontOptionEl.classList.remove('show');
  }
}

