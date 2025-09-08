function initLightbox() {

// set parameters:
const closeIcon = 'far fa-times-circle'; // иконка Font awesome
const animationSec = 0.3; // время появления/растворения

//
const layer = `swiper-modal__layer`;
const modalImageBox = `swiper-modal__image-box`;
const slideImage = `.slide__img`;
const close = `swiper-modal__close`;
const layerView = `layer-view`;
const layerHidden = `layer-hidden`;
const imageFilters = `filters`;

const modalLayer = document.getElementsByClassName(layer)[0];
const effect = document.getElementsByClassName('for-effects');

let onEffect = 
    function () {
      for (let i = 0; i < effect.length; i++) {
       effect[i].classList.add(imageFilters);
      }  
    };
    
let offEffect = 
    function () {
      for (let i = 0; i < effect.length; i++) {
       effect[i].classList.remove(imageFilters);
      }  
    };

// установка интервала в анимацию
function setDuration(sec) {
  //const s = 0.5;
  const millSec = sec * 1000;
  const valueAnim = `${sec}s`; 
  modalLayer.style.animationDuration = valueAnim;
  //console.log(valueAnim);
  // info
  let style = window.getComputedStyle(modalLayer); 
  let styleValueAnim = style.getPropertyValue('animation-duration'); 
  //console.log(styleValueAnim);
  //console.log(modalLayer);
  //console.log(millSec);
  return millSec;
}
const millSec = setDuration(animationSec);

function stopAnimation() {  
  let timer; 
  //console.log(millSec);    
  timer = window.setTimeout( function() {
    modalLayer.classList.remove(layerHidden);
    //console.log(modalLayer.classList.contains(layerHidden));  
  }, millSec); 

  //console.log(modalLayer.classList.contains(layerHidden));                    
}
//
   
function showModalImg() {  
  modalLayer.classList.add(layerView);
  //modalLayer.classList.remove(layerHidden);   
  onEffect(); 
  disablePageScrolling();    
  //stopAnimation();
  //console.log(modalLayer);
}


// назначение слушателя на каждый элемент:
/*
// TODO - or variant:
const itemImg = document.querySelectorAll(slideImage);
//console.log(itemImg);
//console.log(itemImg[2]);
//console.log(itemImg.length);
itemImg.forEach(s => {
  s.addEventListener('click', (event) => {
    let sIndex = Array.prototype.indexOf.call(itemImg, event.target);
    //console.log(sIndex);
    showModalImg();
    counterImg(sIndex + 1);
    clearInterval(timer); 
  });
});
//
*/

// TODO - or variant from es6 '...' operator:
const itemI = document.querySelectorAll(slideImage);
//console.log(itemImg);
//console.log(itemImg[2]);
//console.log(itemImg.length);
itemI.forEach(s => {
  s.addEventListener('click', (event) => {
    let sIndex = [...document.querySelectorAll(slideImage)].indexOf(event.target);
    //console.log(sIndex);
    showModalImg();
    counterImg(sIndex + 1);
    //clearInterval(timer); // if auto play
  });
});
//

// проверка наличия элементов превью на странице:
const collection = [itemI];
//console.log(collection, 'sliderSwiperProducts');

// обработчик иконки close:
//const clickedClass = event.target.className;
document.addEventListener('click', (event) => {
  const clickedClass = event.target.className;
  //console.log(clickedClass);
  if (clickedClass === `${close} ${closeIcon}`) {    
    //modalLayer.style.display = "none";    
    modalLayer.classList.remove(layerView);
    modalLayer.classList.add(layerHidden); 
    offEffect();
    enablePageScrolling();   
    stopAnimation();
    //console.log(modalLayer); 
  }
});

//
modalLayer.addEventListener('click', closeModalLayer);
function closeModalLayer() {
  let clickedСlass = event.target.className;
  let elementEvent = event.target;
  //console.log(clickedСlass);
  //console.log(elementEvent);
  if (clickedСlass === `${layer} ${layerView}` || clickedСlass === '') {
    modalLayer.classList.remove(layerView);
    modalLayer.classList.add(layerHidden); 
    offEffect();
    enablePageScrolling(); 
    stopAnimation();
    //console.log(modalLayer);
  } 
}


// TODO - modal image
let imgIndex = 1;
showImg(imgIndex);

function counterImg(w) {
  showImg(imgIndex = w);
}

function showImg(w) {
  const img = document.getElementsByClassName(modalImageBox);
  let i;
   
  if (w > img.length) {
    imgIndex = 1
  }
    
  if (w < 1) {
    imgIndex = img.length
  }
      
  for (i = 0; i < img.length; i++) {
    img[i].style.display = "none";
  }
     
  img[imgIndex-1].style.display = "block";      
  
}

} // initLightbox
