"use strict";

// Контейнеры
const articlesContainer = document.querySelector('.articles-container');
const faqContainerCare = document.querySelector('.faq-container--care');
const faqContainerProcess = document.querySelector('.faq-container--process');
const modalContainer = document.getElementById('modal-container');

const image = document.querySelector('[data-top-image]');
const title = document.querySelector('[data-top-title]');
const slogan = document.querySelector('[data-top-slogan]');

const swiperWrapper = document.querySelector('.swiper-wrapper');
const modalLayer = document.querySelector('.swiper-modal__layer');

const AppConfig = {
  //API_URL: "http://localhost:8000/index.php", // Локальный сервер
  //API_URL: "https://leatherproject.github.io/shop/data/data.json",
  //API_URL: "https://raw.githubusercontent.com/leatherproject/shop/main/data/data.json",
  API_URL: "./data/data.json', { cache: 'no-cache' }"
};

async function fetchData() {
    try {
        // Показываем прелоадер
        articlesContainer.innerHTML = '<p class="loading">Loading...</p>';
        swiperWrapper.innerHTML = '<p class="loading">Загрузка слайдера...</p>';
        faqContainerCare.innerHTML = '<p class="loading">Care...</p>';
        faqContainerProcess.innerHTML = '<p class="loading">Process...</p>';
        
        // Запрос к серверу
        const response = await fetch(AppConfig.API_URL);  

        //const response = await fetch('https://leatherproject.github.io/shop/data/data.json');
        //const response = await fetch('https://raw.githubusercontent.com/leatherproject/shop/main/data/data.json');
        //const response = await fetch('./data/data.json', { cache: 'no-cache' });

        if (!response.ok) {
            throw new Error('500 Internal Server Error');
        }
        
        let json;
        try {
            json = await response.json();
        } catch (error) {
            console.error('JSON parse error:', error);
            throw new Error('500 Internal Server Error'); // Ошибка парсинга JSON
        }
        const allData = json.data;

        console.log('Полученные данные:', allData); // Проверяем структуру

        // --- Фильтруем всё по page === 'workshop'
        const workshopItems = allData.filter(item => item.page === 'workshop');

        // --- FAQ Care и FAQ Process
        const faqCare = workshopItems.filter(item => item.type === 'faq' && item.group === 'care');
        const faqProcess = workshopItems.filter(item => item.type === 'faq' && item.group === 'process');
        const articles = workshopItems.filter(item => item.type === 'articles');

        // --- Слайдер
        const sliderItems = workshopItems.filter(item => item.type === 'slider');

        //TODO
        const newProducts = json.data.filter(item => item.page === 'ourProducts' && item.new === true);
        if (newProducts.length > 0) {
          const linkMark = document.querySelector('.js-mark');
          linkMark.classList.add('is-visible');
          linkMark.textContent = `${newProducts.length} new`;
          console.log(`Новых товаров: ${newProducts.length}`);
        }
        //TODO
        articlesContainer.innerHTML = '';
        swiperWrapper.innerHTML = '';
        faqContainerCare.innerHTML = '';
        faqContainerProcess.innerHTML = ''; 

        const top = (json.data || []).filter(item => item.page === 'workshop' && item.type === 'top');
        image.style.backgroundImage = `url(${top[0].image})`;
        title.textContent = top[0].title;
        slogan.textContent = top[0].slogan;

        if (articles && articles.length > 0) {
          // статьи
          displayArticles(articles);            
        } else {
          articlesContainer.innerHTML = '<p class="not-found">Нет статей</p>';          
        }     
        
        if (faqCare && faqCare.length > 0) {
          // faq - уход
          displayFaq(faqContainerCare, faqCare);                    
        } else {          
          faqContainerCare.innerHTML = '<p class="not-found">Пусто</p>';
        }

        if (faqProcess && faqProcess.length > 0) {
          // faq - процесс
          displayFaq(faqContainerProcess, faqProcess);                    
        } else {          
          faqContainerProcess.innerHTML = '<p class="not-found">Empty</p>';
        }

        initAccordion(faqContainerCare);
        initAccordion(faqContainerProcess);

        if (sliderItems && sliderItems.length > 0) {
          // слайдер
          createSlider(sliderItems);                        
        } else {
          swiperWrapper.innerHTML = '<p class="not-found">Нет изображений</p>';
        }
                
    } catch (error) {
        console.error('Fetch error:', error); 
        articlesContainer.innerHTML = `<p class="error-500">${error.message}</p>`;       
        swiperWrapper.innerHTML = `<p class="error-500">${error.message}</p>`;
        faqContainerCare.innerHTML = `<p class="error-500">${error.message}</p>`;
        faqContainerProcess.innerHTML = `<p class="error-500">${error.message}</p>`;
    }
}
fetchData();

// статьи
function displayArticles(articles) {
  articles.forEach((article, index) => {
    // Создаем одну сущность - статью
    const articleItem = document.createElement('div');
    articleItem.classList.add('article', `article--${article.group}`);
    //console.log(article.group);

    // генерируем HTML для изображения, если оно есть
    let imgHTML = '';
    if (article.image) {
      imgHTML = `<img class="article__image article__image--${article.group}" src="${article.image}" alt="${article.alt || ''}">`;
    }

    // разбиваем текст на абзацы
    const paragraphs = article.text
      .split('\n')
      .map(t => `<p class="article__text article__text--${article.group}">${t}</p>`)
      .join('');

    articleItem.innerHTML = `
      ${imgHTML}
      <h3 class="article__title article__title--${article.group}">${article.title}</h3>
      ${paragraphs}
    `;
    articlesContainer.appendChild(articleItem);           
  });
}

// faq
function displayFaq(container, faqs) {
  faqs.forEach((faq) => {
    const faqItem = document.createElement('div');
    faqItem.classList.add('faq__item', `faq__item--${faq.group}`);
    //console.log(faq.group);
    faqItem.innerHTML = `     
        <h3 class="faq__question faq__question--${faq.group} js-accordion-toggle">
          <button class="faq__toggle faq__toggle--${faq.group}">${faq.question}</button>
        </h3>
        <div class="faq__answer faq__answer--${faq.group} js-accordion-panel">
          <p class="faq__answer-text faq__answer-text--${faq.group}">${faq.answer}</p>
        </div>      
    `;
    container.appendChild(faqItem);
  });
}

// слайдер
function createSlider(sliderItems) {
  sliderItems.forEach(item => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'slide', 'slide--swiper');
    slide.innerHTML = `<img class="slide__img" src="${item.preview}" alt="${item.alt}" data-modal="${item.imageModal}">`;
            
    swiperWrapper.appendChild(slide);
  });

  // Создаём мод. изобр.
  sliderItems.forEach(item => {
    const modalContent = document.createElement('div');
    modalContent.classList.add('swiper-modal__image-box');
    modalContent.innerHTML = `
      <span class="swiper-modal__close far fa-times-circle"></span>
      <img class="swiper-modal__image" src="${item.imageModal}" alt="${item.alt}">
    `;
                                    
    modalLayer.appendChild(modalContent);

    if (initLightbox) {
      initLightbox();
    } else {
      console.error('Ошибка: initLightbox не найден.');
    }
            
  });
}

