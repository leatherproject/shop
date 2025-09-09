const pageScroll = document.getElementsByTagName('body')[0]; 
function disablePageScrolling () {
  pageScroll.style.overflowY = "hidden";  	 
}

function enablePageScrolling () {
  pageScroll.style.overflowY = "visible"; // instead of visible - auto or ""
}
