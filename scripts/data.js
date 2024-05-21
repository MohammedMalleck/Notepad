import { headerJsCode } from "./header.js";
import { renderSideNotes } from "./renderSideNotes.js";

export let notesStorage = JSON.parse(localStorage.getItem('notesStorage')) ||  [];

let totalNotes;
getNumberOfNotes();

//get current date
const getDate = new Date();
const currentDay = getDate.getDate();
const formattedDay = currentDay.toString().padStart(2,'0');
const currentMonth = getDate.getMonth() + 1;
const formatteMonth = currentMonth.toString().padStart(2,'0');
const currentYear = getDate.getFullYear()
const currentDate = `${formattedDay}/${formatteMonth}/${currentYear}`;

//access the add to note element
const addNoteEl = document.querySelector('.js-add-note-container');

function getNumberOfNotes(){
  totalNotes = JSON.parse(localStorage.getItem('newNumberOfNotes')) || 0;
}

addNoteEl.addEventListener('click' , ()=>{
  //get correct number of notes
  getNumberOfNotes();
  //increase the number of notes by one
  totalNotes++;
  //add a note object 
  //to the notes array 
  notesStorage.push(
    {
      id:totalNotes,
      heading : 'Heading',
      subHeading : 'Sub heading',
      text : 'Write text here...',
      currentDate : currentDate
    },
  );
  //save the modifed notes array
  saveNotesStorage(notesStorage);
  //save the increased number of notes
  localStorage.setItem('newNumberOfNotes' , JSON.stringify(totalNotes));
  //render side notes to display the new note wih animation
  renderSideNotes(true);
})

export function removeNote(noteId){
  //get the unqiue keys that we made for newHeading
  //and new font size
  const getNameHeading = 'newHeading' + noteId;
  const getTextFont = 'textFontSize' + noteId;
  //using the noteId of the note to be delted
  //filter it out of the notes array
  notesStorage = notesStorage.filter( note => note.id !== noteId);
  //save the modified notes array
  saveNotesStorage(notesStorage);
  //remove the previously clicked note Id
  //because now the note with this ID is deleted so we dont need it any more
  localStorage.removeItem('clickedNoteId');
  //remove show note because we want everything to return back to default when screen 
  //size is below 360px width
  localStorage.removeItem('showNote');
  //remove both the unique keys made for saving new heading 
  //and saving new font size 
  localStorage.removeItem(getNameHeading)
  localStorage.removeItem(getTextFont)
  updateNoteNumber();
}

export function saveNotesStorage(notesStorage){
  localStorage.setItem('notesStorage' , JSON.stringify(notesStorage));
}

function updateNoteNumber(){
  //remove the saved number of notes if the notes array is empty
  //after deleting a note
  if(!notesStorage.length){
    localStorage.removeItem('newNumberOfNotes');
  }
}



