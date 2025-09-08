(function() {
'use strict';

const header = document.querySelector('.header'); 
const socialMobile = document.querySelector('.social-mobile'); 

let scroll = 0; // Инициализация переменной для хранения текущей позиции прокрутки
function onScroll() {
      
  let top = window.pageYOffset; // Получение текущей позиции прокрутки

  // Изменение классов элементов в зависимости от направления прокрутки
  if (scroll > top) {
    if (header) header.classList.remove('header--scroll');
    // Прокрутка вверх — фон хедера прозрачный
    if (top === 0 && header) {
      header.classList.remove('header-scroll-bg');
    }

    if (socialMobile) socialMobile.classList.remove('social-mob--scroll');

   } else if (scroll < top) {
     if (header) header.classList.add('header--scroll');

     if (socialMobile) socialMobile.classList.add('social-mob--scroll');
        
     // Прокрутка вниз — фон хедера серый
     if (top > 0 && header) {
       header.classList.add('header-scroll-bg');
     }
   }
   scroll = top; // Обновление переменной scroll для следующего вызова onScroll
}

  try {
    onScroll();
    window.onscroll = onScroll; // Присвоение обработчика события прокрутки
  } catch (error) {
    console.error('Error initializing scrollingX:', error); // Логирование ошибки, если что-то пошло не так
  }

})(); // immediately invoked functions
