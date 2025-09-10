"use strict";

// Контейнеры
const galleryContainer = document.querySelector('.gallery-flex-container');
const modalContainer = document.getElementById('modal-container');
const image = document.querySelector('[data-top-image]');
const title = document.querySelector('[data-top-title]');
const slogan = document.querySelector('[data-top-slogan]');
const offerInfo = document.querySelector('[data-top-offer]');

const swiperWrapper = document.querySelector('.swiper-wrapper');
const modalLayer = document.querySelector('.swiper-modal__layer');

const AppConfig = {
  //API_URL: "http://localhost:8000/index.php", // Локальный сервер
  //API_URL: "https://leatherproject.github.io/shop/data/data.json",
  //API_URL: "https://raw.githubusercontent.com/leatherproject/shop/main/data/data.json",
  API_URL: './data/data.json'
};

async function fetchData() {
  try {
    galleryContainer.innerHTML = '<p class="loading">Loading...</p>';
    swiperWrapper.innerHTML = '<p class="loading">Загрузка слайдера...</p>';
      
    const response = await fetch(AppConfig.API_URL, { cache: 'no-cache' });        

    //const response = await fetch('https://leatherproject.github.io/shop/data/data.json');
    //const response = await fetch('https://raw.githubusercontent.com/leatherproject/shop/main/data/data.json');
    //const response = await fetch('./data/data.json', { cache: 'no-cache' });

    if (!response.ok) throw new Error('500 Internal Server Error');
        
    // Симуляция задержки на уровне сервера (например, обработка запроса или вычислений)
    //await new Promise(resolve => setTimeout(resolve, 2000)); // Задержка 2 секунды

    let json;
    try {
      json = await response.json();
    } catch (error) {
      console.error('JSON parse error:', error);
      throw new Error('500 Internal Server Error');
    }

    const pictures = (json.data || []).filter(item => item.page === 'gallery' && item.type === 'pictures');

    const sliderItems = (json.data || []).filter(item => item.page === 'gallery' && item.type === 'slider');

    //TODO
    const newProducts = json.data.filter(item => item.page === 'ourProducts' && item.new === true);
    if (newProducts.length > 0) {
      const linkMark = document.querySelector('.js-mark');
      linkMark.classList.add('is-visible');
      linkMark.textContent = `${newProducts.length} new`;
      console.log(`Новых товаров: ${newProducts.length}`);
    }
    //TODO

    galleryContainer.innerHTML = '';
    swiperWrapper.innerHTML = '';

    const top = (json.data || []).filter(item => item.page === 'gallery' && item.type === 'top');
    image.style.backgroundImage = `url(${top[0].image})`;
    title.textContent = top[0].title;
    slogan.textContent = top[0].slogan;
    offerInfo.firstChild.textContent = top[0].offer;
    offerInfo.querySelector('a').textContent = top[0].link;

    if (pictures && pictures.length > 0) {
      displayGallery(pictures);            
    } else {      
      galleryContainer.innerHTML = '<p class="not-found">Товары не найдены</p>';            
    }

    //
    if (sliderItems && sliderItems.length > 0) {
      createSlider(sliderItems);                        
    } else {
      swiperWrapper.innerHTML = '<p class="not-found">Нет изображений</p>';
    }
    //

  } catch (error) {
    console.error('Fetch error:', error);
    galleryContainer.innerHTML = `<p class="error-500">${error.message}</p>`;
    swiperWrapper.innerHTML = `<p class="error-500">${error.message}</p>`;
  }
}
fetchData();
//

// Карточки товаров
function displayGallery(pictures) {
  pictures.forEach((item) => {
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('gallery');
    galleryItem.innerHTML = `
      <img src="${item.preview}" class="gallery__img" alt="${item.alt}">
      <div class="gallery__info">
        <h3 class="gallery__caption">${item.caption}</h3>
      </div>
    `;
            
    const galleryImg = galleryItem.querySelector('.gallery__img');                     
    // Обработчик события на ошибку
    galleryImg.onerror = function () {
      this.src = 'img/preview/image-not-found-v-bg.png';
      this.alt = 'Изображение не найдено';
      console.warn(`Не удалось загрузить изображение: ${item.preview}`);
    };

    galleryItem.addEventListener('click', () => showModal(item));
    galleryContainer.appendChild(galleryItem);
  });
}

// Слайдер
function createSlider(sliderItems) {
  // слайды
  sliderItems.forEach(item => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'slide', 'slide--swiper');
    slide.innerHTML = `
      <img class="slide__img" src="${item.preview}" alt="${item.alt}" data-modal="${item.imageModal}">
    `;
            
    swiperWrapper.appendChild(slide);
  });

  // мод. изобр. (lightbox)
  sliderItems.forEach(item => {
    const modalContent = document.createElement('div');
    modalContent.classList.add('swiper-modal__image-box');
    modalContent.innerHTML = `
      <span class="swiper-modal__close far fa-times-circle"></span>
      <img class="swiper-modal__image" src="${item.imageModal}" alt="${item.alt}">
    `;
            
    modalLayer.appendChild(modalContent);

    // lightbox
    // Инициализируем lightbox после загрузки
    // Функцию открытия мод. изобр. забираем из файла lightbox.js и переносим сюда - именно после создания разметки!
    if (initLightbox) {
      initLightbox();
    } else {
      console.error('Ошибка: initLightbox не найден.');
    }
    
  });
}

//
const imageCache = {};
const checkImage = async (url) => {
  if (imageCache[url] !== undefined) return imageCache[url];
  try {
    const loadingMessage = modal.querySelector('.loading-message');
    loadingMessage.textContent = 'Поиск изображения...';
    loadingMessage.classList.add('loading-message');
    const response = await fetch(url, { method: 'HEAD' });
    imageCache[url] = response.ok;
    return response.ok;
  } catch (error) {
    console.error('Ошибка сети:', error);
    return null;
  }
};

//
const modal = document.createElement('div');
modal.classList.add('modal', 'modal--lightbox');
modalContainer.appendChild(modal);

const showModal = async (item) => {
  modal.innerHTML = `
    <div class="modal-content modal-content--lightbox">
      <p class="loading-message"></p>
      <img data-src="${item.imageModal}" class="modal-img" data-alt="${item.alt}">
      <span class="close far fa-times-circle"></span>
    </div>
  `;
            
  modal.classList.add('modal-view');
  modal.classList.remove('modal-hide');
  disablePageScrolling();

  const modalImg = modal.querySelector('.modal-img');
  const loadingMessage = modal.querySelector('.loading-message');
  const imageStatus = await checkImage(item.imageModal);

  setTimeout(function() { //TODO таймер для теста
    if (imageStatus === true) {
      loadingMessage.textContent = 'Загрузка...'; 
      loadingMessage.classList.add('loading-message');
      modalImg.onload = () => {
        loadingMessage.classList.remove('loading-message');
        loadingMessage.remove();
      };
      setTimeout(function() { //TODO таймер для теста
        modalImg.src = modalImg.dataset.src;
        modalImg.alt = modalImg.dataset.alt;
      }, 1500);
    } else if (imageStatus === false) {
      loadingMessage.remove();
      modalImg.src = '/img/preview/image-not-found-v.png'; 
      modalImg.alt = 'Изображение не найдено'; 
      modalImg.style.boxShadow = '0 0 0 0 rgba(0, 0, 0, 0.3)';
    } else {
      loadingMessage.textContent = 'Ошибка сети';
    }

    modal.querySelector('.close').addEventListener('click', () => {
      modal.classList.remove('modal-view');
      modal.classList.add('modal-hide');
      enablePageScrolling();
    });
  }, 1500);

};

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.remove('modal-view');
    modal.classList.add('modal-hide');
    enablePageScrolling();
  }
});

