import { Note } from "./data-oop.js";
import { renderSideNotes  } from "./renderSideNotes.js";
import { renderMainPage } from "./renderMainPage.js";
import { setCopyEvents } from "./setCopyEvents.js";

export function setEventListeners(){
  //access elements
  const confirmationHolderEl = document.querySelector('.js-confirmation-holder');
  const sideEl = document.querySelector('.js-side-section');
  const mainEl = document.querySelector('.js-main-section'); 
  const yesBtn = document.querySelector('.js-yes-btn');
  const noBtn = document.querySelector('.js-no-btn');

  //event listeners
  yesBtn.addEventListener('click' , handleRemoveNote);
  noBtn.addEventListener('click' , hideOverlayContainer);

  function hideOverlayContainer(){
    confirmationHolderEl.classList.remove('show');
  }
  function handleRemoveNote(){
    hideOverlayContainer();
    hideMainPage();
    //access the current active note and its ID
    const activeNoteEl =  document.querySelector('.active-note');
    const activeNoteId = Number(activeNoteEl.id);
    //add hiding animaition to this note
    activeNoteEl.classList.add('hide-movement-animation');
    //find the index of the note that was deleted
    const activeIndex = findDeletedNoteIndex(activeNoteId);
    //add animation to the notes after the deleted note(ie:those with greater index values)
    addAnimationToGreaterIndexes(activeIndex);
    //after the animation ends update the array
    //and re-render the page
    activeNoteEl.addEventListener('animationend' , ()=>{
      handleDeletedNote(activeNoteId)
    });
  }
  function findDeletedNoteIndex(activeNoteId){
    const NoteObject = new Note();
    const activeIndex = NoteObject.notesStorage.findIndex( note => activeNoteId === note.id);
    return activeIndex;
  }
  function addAnimationToGreaterIndexes(activeIndex){
    const NoteObject = new Note();
    NoteObject.notesStorage.forEach((note,index)=>{
      if(index > activeIndex){
        const noteId = note.id;
        const noteEl = document.getElementById(`${noteId}`);
        noteEl.classList.add('show-up-movement-animation');
      }
    });
  }
  function handleDeletedNote(activeNoteId){
    const NoteObject = new Note();
    NoteObject.removeNote(activeNoteId);
    renderSideNotes(false);
    renderMainPage();
    //add copy btn events to new elements
    setCopyEvents();
  }

  /*
  hide the main page if the screen size is below 360px width
  provided that the side section of the page was hidden 
  while the main section was displayed
  */
  function hideMainPage(){
    sideEl.classList.remove('hide');
    mainEl.classList.remove('show');
  }
}