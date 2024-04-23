export function setCopyEvents(){
  const copyEl = document.querySelector('.js-copy');
  const copiedMessageEl = document.querySelector('.copied-message');
  const headingEl = document.querySelector('.js-txt-heading');
  const subHeadingEl = document.querySelector('.js-txt-sub-heading');
  const textEl = document.querySelector('.js-txt-body');
  let copyTextString;

  //on tirggering mousedown event on copy icon,
  //prevent the focus to be shifted from the previously focused element to copy icon
  copyEl.addEventListener('mousedown',(e)=>{
  e.preventDefault();
  })

  copyEl.addEventListener('click',handleCopyEvent);

  function handleCopyEvent(){
    //get the selection object
    const selection = window.getSelection();
    //using the selection object get the focused node
    const focused = selection.focusNode;
    if(focused){
      //get the focused element 
      const focusedEl = focused.parentElement;
      //get the parent element of focused element
      const grandFocusedEl = focusedEl.parentElement;
  
      /*
      if the focused el is same as
      the heading el||sub heading el||text el
      or if the grandfocusedel is same as the text el
      only then execute the code related to copying text to clipboard
      */
      if(
        focusedEl === headingEl ||
        focusedEl === subHeadingEl ||
        focusedEl === textEl ||
        grandFocusedEl === textEl
      ){
        //get the entire text of the focused node
        const contentOne = focused.textContent;
        //get the range of the selection 
        const range = selection.getRangeAt(0);
        //make a dupilication of this selection
        const clone = range.cloneRange();
        //select all the node contents inside the focused el
        clone.selectNodeContents(focusedEl);
        //set the start and end of the selected node
        clone.setStart(range.startContainer,range.startOffset);
        clone.setEnd(range.endContainer,range.endOffset);
        //convert the clone text content into string
        const contentTwo = clone.toString();
    
        //if content two is not an empty string then save it in the copy text
        //variable otherwise save the content one in the in the copy text variable
        contentTwo !== '' ? copyTextString = contentTwo : copyTextString = contentOne;
        
        copyText();
        //add display animation
        copiedMessageEl.classList.add('display-copy-message');
        copiedMessageEl.addEventListener('animationend',()=>{
          copiedMessageEl.classList.remove('display-copy-message');
        });
      }
    }
  }
  function copyText(){
    //copy the text string inside copyText variable to the clipboard
    navigator.clipboard.writeText(copyTextString);
  }
}