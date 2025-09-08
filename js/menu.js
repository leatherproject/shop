(function() {
//
const menu = document.querySelector('.menu');
const mobileLayer = document.querySelector('.mobile-layer');

function setDuration(sec) {
  //const sec = 0.5;
  const millSec = sec * 1000;
  const valueAnim = `${sec}s`; // установка интервала в анимацию
  menu.style.animationDuration = valueAnim;
  mobileLayer.style.animationDuration = valueAnim;
  // for info
  let style = window.getComputedStyle(menu); 
  let styleValueAnim = style.getPropertyValue('animation-duration'); 
  //console.log(styleValueAnim);
  //console.log(valueAnim);
  return millSec;
}
const millSec = setDuration(0.4);
//

// TODO - menu show/hidden
const menuBtn = document.querySelector('.menu-btn');
const menuIcon = document.querySelector('.menu-icon');
menuBtn.addEventListener('click', (event)=> {
  showMenu();
  event.stopPropagation();
});

function stopAnimation() {    
  let timer;
  //console.log(animSec);    
  timer = window.setTimeout( function() {
    menu.classList.remove('menu-mobile');
    mobileLayer.classList.remove('mob-layer-off');
  }, millSec); 
  // сброс таймера:             
  menuBtn.addEventListener('click', () => {
     clearTimeout(timer);
  });
  //
}

function showMenu() {
  menuIcon.classList.toggle('fa-times');
  menuBtn.classList.add('stop-propagation'); // класс виртуальный!
  const menu = document.querySelector('.menu');
  const classIs = menuIcon.classList.contains('fa-times'); 
  const mobileLayer = document.querySelector('.mobile-layer'); 
  //console.log(classIs);  
  if (classIs == true) {
    menu.classList.add('menu-mobile'); 
    mobileLayer.classList.add('mob-layer-on');
    mobileLayer.classList.remove('mob-layer-off');
    disablePageScrolling();    
    menu.classList.add('menu-visible');    
    menu.classList.remove('menu-hidden');     
  } else if (classIs == false) {
    mobileLayer.classList.add('mob-layer-off');
    mobileLayer.classList.remove('mob-layer-on');
    enablePageScrolling(); 
    menu.classList.remove('menu-visible');  
    menu.classList.add('menu-hidden');
    
    stopAnimation(); 
    
  }     
                  
  // TODO - optional - hide menu when clicked anywhere
  document.addEventListener('click', (event) => {
    const menuBtn = document.querySelector('.menu-btn');
    const classIs = event.target.classList.contains('stop-propagation');
    const menuMobileBox = document.querySelector(".menu-mobile");
    const classIsIcon = menuIcon.classList.contains('fa-times'); 
    //console.log(classIs); 
    //console.log(classIsIcon);
    const clickedClass = event.target.className;
    //console.log(clickedClass); 
    if (classIs == false && classIsIcon == true && !menuMobileBox.contains(event.target)) { 
      menuIcon.classList.remove('fa-times'); 
      mobileLayer.classList.add('mob-layer-off');
      mobileLayer.classList.remove('mob-layer-on');
      enablePageScrolling(); 
      menu.classList.remove('menu-visible');      
      menu.classList.add('menu-hidden');
      
      stopAnimation(); 
           
    }
  });  
    
}    

})(); // immediately invoked functions
