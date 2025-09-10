"use strict";

const productsContainer = document.querySelector('.products-flex-container');
const modalContainer = document.getElementById('modal-container');
const image = document.querySelector('[data-top-image]');
const title = document.querySelector('[data-top-title]');
const slogan = document.querySelector('[data-top-slogan]');
const offerInfo = document.querySelector('[data-top-offer]');

// Используем API из объекта AppConfig


//
let products = [];

async function fetchData() {
  try {
    productsContainer.innerHTML = '<p class="loading">Loading...</p>';


if (!window.AppConfig) {
    console.error('AppConfig ещё не загружен!');
    return;
  }

    const API_URL = window.AppConfig.API_URL;
      
    const response = await fetch(API_URL);

    //const response = await fetch('https://leatherproject.github.io/shop/data/data.json');
    //const response = await fetch('https://raw.githubusercontent.com/leatherproject/shop/main/data/data.json');
    //const response = await fetch('./data/data.json', { cache: 'no-cache' });
    //const response = await fetch("http://localhost:8000/index.php");        

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

    productsContainer.innerHTML = '';

    const top = (json.data || []).filter(item => item.page === 'ourProducts' && item.type === 'top');
    image.style.backgroundImage = `url(${top[0].image})`;
    title.textContent = top[0].title;
    slogan.textContent = top[0].slogan;
    offerInfo.firstChild.textContent = top[0].offer;
    offerInfo.querySelector('a').textContent = top[0].link;

    // Фильтруем товары
    products = (json.data || []).filter(item => item.page === 'ourProducts' && item.type === 'products');
    if (products && products.length > 0) {
      displayProducts(products);  
      disableOrderButtons(); // отключение кнопок если товар уже в хранилище          
    } else {
      productsContainer.innerHTML = '<p class="not-found">Товары не найдены</p>';            
    }    

  } catch (error) {
    console.error('Fetch error:', error);
    productsContainer.innerHTML = `<p class="error-500">${error.message}</p>`;    
  }
}
fetchData();
//

// Карточки товаров
function displayProducts(products) {
  const linkMark = document.querySelector('.js-mark'); // вынесено
  let newCount = 0;

  products.forEach((product, index) => {
    //const productModel = product.model.split('-')[0]; // для вывода в интерфейс отсекаем рандомное число
    const productItem = document.createElement('div');
    productItem.classList.add('card');
    productItem.innerHTML = `
      <span class="card__mark">new</span>
      <img src="${product.preview}" class="card__image" alt="${product.name}">     
      <h3 class="card__subtitle">${product.name}</h3>
      <p class="card__price">${formatPrice(product.price)}</p>
      <p class="card__info-text">${product.description}</p>
        <div class="card__info card__info--top">
          <p class="card__info-type">Цвета</p>
          <div class="card__parameters card__parameters--colors-box">
            <span class="card__info-color">${product.color1}</span> 
            <span class="card__info-color">${product.color2}</span> 
            <span class="card__info-color">${product.color3}</span> 
            <span class="card__info-color">${product.color4}</span>
          </div>
        </div>  
        <div class="card__info">        
          <p class="card__info-size">Размеры:</p><span class="card__info-size">${product.size}</span>      
        </div> 
        <div class="card__info">        
          <p class="card__info-model">Модель:</p><span class="card__info-model">${product.model}</span>      
        </div>
        <div class="card__info card__info--bottom">        
          <p class="card__info-model">Доступно:</p><span class="card__info-model limit"></span>      
        </div>
      <button class="card__add-btn js-add-cart" data-id="${product.model}">добавить</button>
    `;

    const colorMap = window.colorMap || {};

    const colors = productItem.querySelectorAll('.card__info-color');
    colors.forEach((colorEl) => {
      const colorName = colorEl.textContent.trim().toLowerCase();
      const hex = colorMap[colorName];

      if (hex) {
       colorEl.style.backgroundColor = hex;
        colorEl.textContent = colorName; // подсказка
      } else {
        // если цвет не распознан
        colorEl.classList.add('card__info-color--undefined');
        colorEl.textContent = ''; 
      }
    });

    //
    const isInvalid = product.limit === undefined || isNaN(product.limit);
    if (isInvalid) {
      productItem.querySelector('.limit').classList.add('fas', 'fa-question-circle');
    } else {
      productItem.querySelector('.limit').textContent = `${product.limit}`;
    }
     
    //
    const productMark = productItem.querySelector('.card__mark'); 
    //console.log(product.new, index);
    if (product.new) {
      productMark.classList.add('is-visible');  
      linkMark.classList.add('is-visible'); 
      newCount++; // Увеличиваем счётчик 
    } 

    const productImg = productItem.querySelector('.card__image');                     
    // Обработчик события на ошибку
    productImg.onerror = function () {
      this.src = 'img/preview/image-not-found-v-bg.png';
      this.alt = 'Изображение не найдено';
      console.warn(`Не удалось загрузить изображение: ${product.preview}`);
    };

    productImg.addEventListener('click', () => showModal(product));
    productsContainer.appendChild(productItem);

  });

  console.log(`Новых товаров: ${newCount}`);
  if (newCount > 0) {
    linkMark.textContent = `${newCount} new`;
  }
  //TODO - сюда скрипт из collections.js

}
//

// Отключаем кнопки "добавить" для товаров, уже находящихся в корзине
function disableOrderButtons() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  document.querySelectorAll('.js-add-cart').forEach(btn => {
    const model = btn.dataset.id;
    if (cart.some(item => item.model === model)) {
      btn.disabled = true;
      btn.textContent = 'В корзине';
      btn.classList.add('ordered');
    }
  });
}

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('js-add-cart')) {
    const card = event.target.closest('.card');
    //console.log(card);
    if (!card) return;

    const model = event.target.dataset.id || card.dataset.id;

    const matchedProduct = products.find(p => p.model === model);
    if (!matchedProduct) {
      console.warn(`Товар с model "${model}" не найден в JSON`);
      return;
    }

    const belts = matchedProduct.category === 'belt';
    console.log(belts);

let product;

if (belts) {
    product = {
      model,
      name: card.querySelector('.card__subtitle')?.textContent,
      price: matchedProduct.price,
      preview: card.querySelector('.card__image')?.src,
      description: card.querySelector('.card__info-text')?.textContent,
      color1: card.querySelector('.card__info-color:nth-child(1)')?.textContent?.trim(),
      color2: card.querySelector('.card__info-color:nth-child(2)')?.textContent?.trim(),
      color3: card.querySelector('.card__info-color:nth-child(3)')?.textContent?.trim(),
      color4: card.querySelector('.card__info-color:nth-child(4)')?.textContent?.trim(),
      size: card.querySelector('.card__info-size:last-child')?.textContent,
      width1: matchedProduct.width1, 
      width2: matchedProduct.width2,
      width3: matchedProduct.width3, 
      width4: matchedProduct.width4,
      count: 1,
      limit: matchedProduct.limit,
      category: matchedProduct.category,
      selectedColor: card.querySelector('.card__info-color:nth-child(1)')?.textContent?.trim(),
      selectedWidth: matchedProduct.width1,
      customizedValue: ''
    };
} else {
  product = {
      model,
      name: card.querySelector('.card__subtitle')?.textContent,
      price: matchedProduct.price,
      preview: card.querySelector('.card__image')?.src,
      description: card.querySelector('.card__info-text')?.textContent,
      color1: card.querySelector('.card__info-color:nth-child(1)')?.textContent?.trim(),
      color2: card.querySelector('.card__info-color:nth-child(2)')?.textContent?.trim(),
      color3: card.querySelector('.card__info-color:nth-child(3)')?.textContent?.trim(),
      color4: card.querySelector('.card__info-color:nth-child(4)')?.textContent?.trim(),
      size: card.querySelector('.card__info-size:last-child')?.textContent,
      count: 1,
      limit: matchedProduct.limit,
      category: matchedProduct.category,
      selectedColor: card.querySelector('.card__info-color:nth-child(1)')?.textContent?.trim()
    };
}
    
    console.log(product.model, product.price, typeof product.price);

    const existing = cart.find(item => item.model === product.model);

    const countBadge = document.querySelector('.count-badge');
    
    countBadge.classList.add('count-badge--visible');  

    if (existing) {
      existing.count += 1; // увеличиваем количество
   
      // найти блок в корзине и обновить количество
      const existingItem = document.querySelector(`.cart-item[data-model="${product.model}"]`);
      const qtyText = existingItem?.querySelector('.js-qty');
      if (qtyText) {
        qtyText.textContent = `Qty: ${existing.count}`;
      }

      // Отключаем кнопку "добавить"
      event.target.disabled = true;
      event.target.textContent = 'В корзине';
      event.target.classList.add('ordered');

    } else {
      cart.push(product); // добавляем только если новый
      renderCartItem(product); // отрисовываем только новый
      calcTotal();

      // Отключаем кнопку "добавить"
      event.target.disabled = true;
      event.target.textContent = 'В корзине';
      event.target.classList.add('ordered');
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // сохраняем обратно

    // проверить локстор - в консоли F12 -> localStorage.getItem('cart');
    // очистить локстор - в консоли F12 -> localStorage.clear();

    // найти индекс карточки
    //const cards = Array.from(document.querySelectorAll('.card'));
    //const index = cards.indexOf(card);
    //console.log(index);
  }
});

//
const modal = document.createElement('div');
modal.classList.add('modal');
modalContainer.appendChild(modal);

const showModal = (product) => {
  // Формируем HTML для слайдера (динамически)
  const images = Array.isArray(product.imageModal)
  ? product.imageModal
  : product.imageModal
    ? product.imageModal.split(',').map(s => s.trim())
    : [];

  const slidesHTML = images.map(imgSrc => `
    <div class="swiper-slide slide slide--xSwiper">
      <img class="slide__img" src="${imgSrc}" alt="${product.name}">
    </div>
  `).join('');

  modal.innerHTML = `
    <div class="modal-content modal-content--xSwiper">
      <div class="swiper">
        <div class="swiper-wrapper">
          ${slidesHTML}
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-pagination"></div>
      </div>
      <span class="close far fa-times-circle"></span>
    </div>
  `;

  modal.classList.add('modal-view');
  modal.classList.remove('modal-hide');
  disablePageScrolling();

  // Закрытие модалки
  modal.querySelector('.close').addEventListener('click', () => {
    modal.classList.add('modal-hide');
    modal.classList.remove('modal-view');
    enablePageScrolling();
  });

  //
  if (initXswiper) {
    initXswiper();
  } else {
    console.warn('initXswiper() не определена.');
  }
};

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.remove('modal-view');
    modal.classList.add('modal-hide');
    enablePageScrolling();
  }
});

