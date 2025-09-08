
try {
  const moduleSliderSwiper = document.getElementById('sliderSwiper'); 
  if (moduleSliderSwiper !== null) {
  
var swiper = new Swiper(`.swiper`, {

  // https://swiperjs.com/demos - Slides per view
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1.3,
      spaceBetween: 10
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 2,
      spaceBetween: 10
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 2.3,
      spaceBetween: 10
    },
    867: {
      slidesPerView: 3,
      spaceBetween: 10
    },
    1100: {
      slidesPerView: 3, //1.25 
      spaceBetween: 45, //10
    }
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },  

  /*
  autoplay: {
    delay: 1000,    
  },
  speed: 1100,
  */

  //spaceBetween: 50,
  /*
  effect: 'coverflow',
  coverflowEffect: {
    rotate: 30,
    slideShadows: true,
  },
  */

  /*
  effect: 'creative',
  creativeEffect: {
    prev: {
      // will set `translateZ(-400px)` on previous slides
      translate: [0, 0, -400],
    },
    next: {
      // will set `translateX(100%)` on next slides
      translate: ['100%', 0, 0],
    },
  },
  */

  //effect: 'flip',

  /*
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  */
  
  /*
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  */

});

// TODO initLightbox был здесь

//

} // if (moduleTapeCarousel !== null)

} // try

catch(err) {
  //console.log(err.name, err.message);
}

