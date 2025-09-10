"use strict";
// Контейнеры
const infoContainer = document.querySelector('.article--info');
const paymentContainer = document.querySelector('.article--payment');
const privacyContainer = document.querySelector('.article--privacy');

const image = document.querySelector('[data-top-image]');
const title = document.querySelector('[data-top-title]');
const slogan = document.querySelector('[data-top-slogan]');

const API_URL = window.AppConfig.API_URL;

async function fetchData() {
    try {
        // Показываем прелоадер
        infoContainer.innerHTML = '<p class="loading">Loading...</p>';
        paymentContainer.innerHTML = '<p class="loading">Loading...</p>';
        privacyContainer.innerHTML = '<p class="loading">Loading...</p>';

        // Запрос к серверу
        const response = await fetch(API_URL);  

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

        // --- Фильтруем всё по page === 'information'
        const informationItems = allData.filter(item => item.page === 'information');
        const articles = informationItems.filter(item => item.type === 'articles');
        const info = articles.filter(item => item.group === 'info');
        const payment = articles.filter(item => item.group === 'payment');
        const privacy = articles.filter(item => item.group === 'privacy');

        const newProducts = json.data.filter(item => item.page === 'ourProducts' && item.new === true);
        if (newProducts.length > 0) {
          const linkMark = document.querySelector('.js-mark');
          linkMark.classList.add('is-visible');
          linkMark.textContent = `${newProducts.length} new`;
          console.log(`Новых товаров: ${newProducts.length}`);
        }
        
        infoContainer.innerHTML = '';
        paymentContainer.innerHTML = '';
        privacyContainer.innerHTML = '';

        const top = (json.data || []).filter(item => item.page === 'information' && item.type === 'top');
        image.style.backgroundImage = `url(${top[0].image})`;
        title.textContent = top[0].title;
        slogan.textContent = top[0].slogan;

        if (info && info.length > 0) {
          // статья
          displayArticles(infoContainer, info);             
        } else {
          infoContainer.innerHTML = '<p class="not-found">Нет статей</p>';          
        }

        if (payment && payment.length > 0) {
          // статья
          displayArticles(paymentContainer, payment);        
        } else {
          paymentContainer.innerHTML = '<p class="not-found">Нет статей</p>';          
        }

        if (privacy && privacy.length > 0) {
          // статья
          displayArticles(privacyContainer, privacy);            
        } else {
          privacyContainer.innerHTML = '<p class="not-found">Нет статей</p>';          
        }     
                
    } catch (error) {
        console.error('Fetch error:', error); 
        infoContainer.innerHTML = `<p class="error-500">${error.message}</p>`;
        paymentContainer.innerHTML = `<p class="error-500">${error.message}</p>`; 
        privacyContainer.innerHTML = `<p class="error-500">${error.message}</p>`;                    
    }
}
fetchData();

// генерации статей
function displayArticles(container, articles) {
  articles.forEach(article => {
    const articleItem = document.createElement('div');
    articleItem.classList.add('article__item', `article__item--${article.group}`);

    // генерируем HTML для изображения, если оно есть
    let imgHTML = '';
    if (article.image) {
      imgHTML = `<img class="article__image article__image--${article.group}" src="${article.image}" alt="${article.alt || ''}">`;
    }

    let icon = '';
    if (article.icon) {
      icon = `<img class="article__icon article__icon--${article.group}" src="${article.icon}">`;
    }

    // генерация абзацев и списков
    let paragraphs = '';
    let listItems = [];

    article.text.split('\n').forEach(t => {
      let line = t.trimEnd();              // убираем пробелы справа
      let cleanLine = line.replace(/^\s+/, ''); // убираем пробелы слева
  
      if (cleanLine.startsWith('-')) {
        // собираем пункты списка
        listItems.push(
         `<li class="article__list article__list--${article.group}">${cleanLine.substring(1).trim()}</li>`
        );
      } else {
        // если перед этим был список — закрываем его
        if (listItems.length) {
          paragraphs += `<ul class="article__ul article__ul--${article.group}">${listItems.join('')}</ul>`;
          listItems = [];
        }
        if (cleanLine) {
         paragraphs += `<p class="article__text article__text--${article.group}">${cleanLine}</p>`;
        }
      }
    });

    // если текст закончился списком — закрываем его
    if (listItems.length) {
      paragraphs += `<ul class="article__ul article__ul--${article.group}">${listItems.join('')}</ul>`;
    }
    //

    articleItem.innerHTML = `
      <div class="article__title-box article__title-box--${article.group}">
        <h3 class="article__title article__title--${article.group}">${article.title}</h3>
        ${icon}
      </div>
      ${imgHTML}
      ${paragraphs}
    `;

    container.appendChild(articleItem);
  });
}

