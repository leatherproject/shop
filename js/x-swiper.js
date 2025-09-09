function initXswiper() {

try {
  
(function() {

var swiper = new Swiper(`.swiper`, {

  // https://swiperjs.com/demos - примеры
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },  
});

})(); // immediately invoked functions

} // try

catch(err) {
  //console.log(err.name, err.message);
}

} // initXswiper

