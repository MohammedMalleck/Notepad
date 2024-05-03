import { renderSideNotes } from "./renderSideNotes.js";

export class Note{

  notesStorage = JSON.parse(localStorage.getItem('notesStorage')) ||  [];
  totalNotes = JSON.parse(localStorage.getItem('newNumberOfNotes')) || 0;


  getNoteCurrentDate(){
    //get current date
    const getDate = new Date();
    const currentDay = getDate.getDate();
    const formattedDay = currentDay.toString().padStart(2,'0');
    const currentMonth = getDate.getMonth() + 1;
    const formatteMonth = currentMonth.toString().padStart(2,'0');
    const currentYear = getDate.getFullYear()
    const currentDate = `${formattedDay}/${formatteMonth}/${currentYear}`;
    return currentDate;
  }

  addNote(){
    //increase the number of notes by one
    this.totalNotes++;
    //add a note object 
    //to the notes array 
    this.notesStorage.push({
      id:this.totalNotes,
      heading : 'Heading',
      subHeading : 'Sub heading',
      text : 'Write text here...',
      currentDate : this.getNoteCurrentDate()
    });
    //save the modifed notes array
    this.saveNotesStorage();
    //save the increased number of notes
    localStorage.setItem('newNumberOfNotes' , JSON.stringify(this.totalNotes));
    //render side notes to display the new note wih animation
    renderSideNotes(true);
  }

  removeNote(noteId){
    //get the unqiue keys that we made for newHeading
    //and new font size
    const getNameHeading = 'newHeading' + noteId;
    const getTextFont = 'textFontSize' + noteId;
    //using the noteId of the note , get the note to be deleted
    //and filter it out of the notes array
    this.notesStorage = this.notesStorage.filter( note => note.id !== noteId)
    //save the modified notes array
    this.saveNotesStorage();
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
    this.updateNoteNumber();
  }

  saveNotesStorage(){
    localStorage.setItem('notesStorage' , JSON.stringify(this.notesStorage));
  }

  updateNoteNumber(){
    //remove the saved number of notes if the notes array is empty
    //after deleting a note
    if(!this.notesStorage.length){
      localStorage.removeItem('newNumberOfNotes');
    }
  }

}

//access the add to note element
const addNoteEl = document.querySelector('.js-add-note-container');

addNoteEl.addEventListener('click' , ()=>{
  const NoteObject = new Note();
  NoteObject.addNote();
});