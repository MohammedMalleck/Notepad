import { notesStorage } from "./data.js";
import { renderMainPage } from "./renderMainPage.js";
import { setCopyEvents } from "./setCopyEvents.js";

//access elements present in page
const sideEl = document.querySelector('.js-side-section');
const mainEl = document.querySelector('.js-main-section'); 

export function renderSideNotes(enableAnimation){
  if(notesStorage.length > 0){
    //access first and last ID
    const firstNoteId  =  notesStorage[0].id
    const lastIndex =  (notesStorage.length - 1);
    const lastNoteID = notesStorage[lastIndex].id;
    
    //check if the user clicked any note before
    let noteId = JSON.parse(localStorage.getItem('clickedNoteId')) || firstNoteId;
  
    let html = '';

    notesStorage.forEach((note)=>{
      //add active class to the recently clicked note(deafult note is first note);
      const classNoteActive = Number(noteId) === note.id ? 'active-note' : ''; 
      //add z-index to all notes when a new note is added to give a good aniamtion effect.
      const zIndex = enableAnimation ? `style="z-index:${-(note.id)};"`: '';
      html +=
      `
      <div id="${note.id}"  ${zIndex} class="js-note-side note-side-container-holder ${classNoteActive}">
        <div class="note-side-container">
          <div class="note-side-heading">${note.heading === '' ? 'No heading' : note.heading}</div>
          <div class="note-side-date-create">${note.currentDate}</div>
          <div class="note-side-note-logo">
            <i class="fa fa-sticky-note-o" aria-hidden="true"></i>
            <div>Note</div>
          </div>
        </div>
        <div class="seperator-side-section"></div>
      </div>
      ` 
    });

    document.querySelector('.js-side-section').innerHTML = html;

    //add animation
    const lastNoteEl = document.getElementById(`${lastNoteID}`);
    if(enableAnimation){
      lastNoteEl.classList.add('show-movement-animation');
    }

    //edit the heading of the note if its width exceeds the container width
    editNoteHeading();

    //event listeners
    lastNoteEl.addEventListener('animationend',handleLastNoteAnimation);

    document.querySelectorAll('.js-note-side')
      .forEach((noteSideEl)=>{
        noteSideEl.addEventListener('click' , ()=>{
          //remove active class from the previously active note
          removeActiveClass();
          //add active note , to the newly selected note
          noteSideEl.classList.add('active-note');
          //render main page
          renderMainPage();
          //add copy events to new elements
          setCopyEvents();
          //save the ID of the newly selected note
          saveClickedNoteInfo(noteSideEl.id);
          hideSideEl();
        })
      });


      function editNoteHeading(){
        //select and loop through all available note container's
        document.querySelectorAll('.js-note-side')
          .forEach((noteSideContainerEl)=>{
            //get note ID
            const noteId = noteSideContainerEl.id;
            //get note element
            const noteSideEl = noteSideContainerEl.children[0];
            //get note element width
            const noteSideElWidth =  noteSideEl.clientWidth;
            //get note element left padding
            const noteSideElPadding =(getComputedStyle(noteSideEl).paddingLeft).split('px')[0];
            //get note element padding from both sides
            const noteSideElPaddingXNum = Number(noteSideElPadding) * 2
            //subtract the padding from total width to get correct width
            const noteSideElCorrectWidth = noteSideElWidth - noteSideElPaddingXNum;
            //get the heading element inside the note element
            const noteSideHeadingEl = noteSideEl.children[0];
            //get the width of the heading element
            const noteSideHeadingElWidth = noteSideHeadingEl.clientWidth;
            //get the text of the heading element
            const noteSideHeadingElTxt = noteSideHeadingEl.innerText;
            //access the saved heading if any 
            const getName = 'newHeading' + noteId;
            const savedHeading = JSON.parse(localStorage.getItem(getName)) || false;
    
            //check if the heading width is greater than the container width
            if(noteSideHeadingElWidth >= noteSideElCorrectWidth){
              //check if the heading width has been greater before
              if(savedHeading){
                //if yes then display the saved heading 
                noteSideHeadingEl.innerHTML = savedHeading;
              }else{
              //if not(this is first time),then
                //subtract last 3 characters from the heading
                const subtractText = noteSideHeadingElTxt.slice(0,-3);
                //replace them with "." 
                const newHeading = `${subtractText}...`;
                //display the edited heading
                noteSideHeadingEl.innerHTML = newHeading;
                //get the ID and newHeading and save it
                saveNewHeading(noteId,newHeading);
              }
            }else{
            //if the heading width is smaller then container width 
            //then delete the saved heading
              localStorage.removeItem(getName);
            }
            /*
              2 scenarios
              1:- the heading width has never been greater so removing LS wont do anything.
              2:- the heading width is being reduced by the user(as the user changes the heading) , and as it reduces we delete
              the previously saved heading.After removing LS , the note heading will behave like scenario 1
            */
          });
      }

      function saveNewHeading(noteId,newHeading){
        //using ID of the grandparent container('.js-note-side')
        //create an unique LS name and save the heading to keep track
        const setName = 'newHeading' + noteId;
        localStorage.setItem(setName,JSON.stringify(newHeading));
      }

      function hideSideEl(){
        const screenWidth = window.innerWidth;
        //if the screen width is less then 360px then on clicking note,
        //hide the side section of the page and display the main page
        if(screenWidth < 360.1){
          sideEl.classList.add('hide');
          mainEl.classList.add('show');
          //create this flag so that on reloading the page when screen width 
          //is less then 360px display the main section of the page only 
          localStorage.setItem('showNote' , JSON.stringify(true));
        }
      }

      function saveClickedNoteInfo(noteSideElId){
        localStorage.setItem('clickedNoteId' , JSON.stringify(noteSideElId));
      }

      function handleLastNoteAnimation(){
        //remove the animation class
        lastNoteEl.classList.remove('show-movement-animation');
        //if there is only one note in the notes storage , then invoke the render main page 
        //function.
        if(notesStorage.length === 1){
          //render main page after animation is completed
          renderMainPage();
          //set copy btn events 
          setCopyEvents();
        }
        //remove the negavtive index's from all elements since we dont need them anymore
        removeNegativeZIndexes();
        //remove the event listener also because we dont want to execute this code when 
        //deleting a note
        lastNoteEl.removeEventListener('animationend',handleLastNoteAnimation)
      }
      function removeNegativeZIndexes(){
        document.querySelectorAll('.js-note-side')
          .forEach((noteContainerEl)=>{
            noteContainerEl.removeAttribute('style');
          })
      }
  }else{
    document.querySelector('.js-side-section').innerHTML = 
    `
    <div class="empty-text">
      <span>No Notes :(</span>
    </div>
    `;
  }
}

export function removeActiveClass(){
  const activeEl = document.querySelector('.active-note');
  activeEl.classList.remove('active-note');
}