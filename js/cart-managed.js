"use strict";

  const cartBtn = document.querySelector('.cart-btn'); 
  const cartOverlay = document.getElementById('cartOverlay'); 
  const cartCloseBtn = document.querySelector('.cart-panel__close-btn');
  const panel = document.querySelector('.cart-panel');

  cartBtn.addEventListener('click', () => {
   const isOpen = panel.classList.toggle('cart-visible');

    if (isOpen) {
     // открываем
      cartOverlay.classList.remove('cart-overlay-hide');
      cartOverlay.classList.add('cart-overlay-view');
      disablePageScrolling();
    } else {
     // закрываем
     cartOverlay.classList.remove('cart-overlay-view');
     cartOverlay.classList.add('cart-overlay-hide');
     enablePageScrolling();
    }
  });

  function closeCart() {
    panel.classList.remove('cart-visible');
    cartOverlay.classList.remove('cart-overlay-view');
    cartOverlay.classList.add('cart-overlay-hide');
    enablePageScrolling();
  }
  
  cartOverlay.addEventListener('click', closeCart);
  cartCloseBtn.addEventListener('click', closeCart);


// Функция отрисовки одного товара в корзине
function renderCartItem(product) {
  //const productModel = product.model.split('-')[0]; // для вывода в интерфейс отсекаем рандомное число
  const item = document.createElement('div');
  item.className = 'cart-item';
  item.dataset.model = product.model; // уникальный ключ, аналог id
  item.innerHTML = `
    <button class="btn-remove fas fa-trash-alt" data-model="${product.model}"></button>
    <img class="preview" src="${product.preview}" alt="${product.name}">
    <p class="model">${product.model}</p>
    <p class="name">${product.name}</p>
    <p class="price">${formatPrice(product.price)}</p>
    <p class="cart-item__info-type">Количество</p>
    <div class="cart-item__controls">
      <button class="cart-item__minus-btn js-minus" data-model="${product.model}">&minus;</button>
      <span class="cart-item__qty js-qty">${product.count}</span>
      <button class="cart-item__plus-btn js-plus" data-model="${product.model}">&plus;</button>
    </div>
    <div class="cart-item__option-colors">
      <p class="cart-item__info-type">Colors</p>
      <div class="cart-item__option-wrapper cart-item__option-wrapper--colors">
        <span class="cart-item__info-color">${product.color1}</span> 
        <span class="cart-item__info-color">${product.color2}</span> 
        <span class="cart-item__info-color">${product.color3}</span> 
        <span class="cart-item__info-color">${product.color4}</span> 
      </div>
    </div>
    <div class="cart-item__option-size">
      <p class="cart-item__info-type">Ширина ремня</p>
      <div class="cart-item__option-wrapper cart-item__option-wrapper--size">
        <span class="cart-item__info-size">${product.width1}</span> 
        <span class="cart-item__info-size">${product.width2}</span> 
        <span class="cart-item__info-size">${product.width3}</span> 
        <span class="cart-item__info-size">${product.width4}</span> 
      </div>
    </div>
    <div class="cart-item__option-customized">
      <label class="cart-item__customized-label" for="waist">Обхват талии (см)
        <span class="cart-item__customized-result"></span>
      </label>
      <input class="cart-item__customized-input" type="number" step="0.1" id="waist" name="waist" min="30" max="200" required>
      <button class="cart-item__customized-btn js-customized-set">ok</button>
    </div>
  `;
  document.querySelector('.js-cart').appendChild(item);

  //
  const colorMap = window.colorMap || {};

  const colors = item.querySelectorAll('.cart-item__info-color');
  colors.forEach((colorEl) => {
    const colorName = colorEl.textContent.trim().toLowerCase();
    const hex = colorMap[colorName];
    if (hex) {
      colorEl.style.backgroundColor = hex;
      colorEl.textContent = colorName; 
    } else {     
      colorEl.classList.add('cart-item__info-color--undefined');
      colorEl.textContent = ''; 
    }

    // Добавляем выделение если цвет совпадает с выбранным
    if (product.selectedColor && product.selectedColor.toLowerCase() === colorName) {
      colorEl.classList.add('color--selected');
    }
  });
  //

  const belts = product.category === 'belt';
  console.log(belts, product.category);

  //
  const sizeBox = item.querySelector('.cart-item__option-size');
  if (!belts) {
    sizeBox.classList.add('cart-item__option-size--hidden');
  }
  const allWidth = item.querySelectorAll('.cart-item__info-size');
  allWidth.forEach((widthEl) => {
    const widthValue = widthEl.textContent.trim().toLowerCase();
    //const hex = colorMap[width];
    //colorEl.style.backgroundColor = hex;
    if (widthValue !== 'undefined') {
      widthEl.textContent = widthValue; 
    } else {
      widthEl.classList.add('cart-item__info-size--undefined');
    }

    // Добавляем выделение если цвет совпадает с выбранным
    if (product.selectedWidth && product.selectedWidth.toLowerCase() === widthValue) {
      widthEl.classList.add('size--selected');
    }
  });
  //

  //
  const waistValue = item.querySelector('.cart-item__customized-result');
  const customizedBox = item.querySelector('.cart-item__option-customized');
  //const belts = product.category === 'belt';
  console.log(belts, product.category);
  if (belts) {
    waistValue.textContent = product.customizedValue || '';
  } else {
    customizedBox.classList.add('cart-item__option-customized--undefined');
  }
  //

  // логика отключения кнопок при limit = 1
  const btnPlus = item.querySelector('.js-plus');
  const btnMinus = item.querySelector('.js-minus');
  const isInvalid = product.limit === undefined || isNaN(product.limit);

  if (product.limit === 1) {
    btnPlus.disabled = true;
    btnMinus.disabled = true;
    btnPlus.classList.add('disabled-btn');
    btnMinus.classList.add('disabled-btn');
  }
  if (product.count === product.limit) {
    btnPlus.disabled = true;
    btnPlus.classList.add('disabled-btn');
  }
  if (isInvalid) {
    btnPlus.disabled = true;
    btnMinus.disabled = true;
    btnPlus.classList.add('disabled-btn');
    btnMinus.classList.add('disabled-btn');
  }

}

// Загрузка корзины из localStorage при старте
const cartContainer = document.querySelector('.js-cart');
const cart = JSON.parse(localStorage.getItem('cart') || '[]');
console.log(cart);
cart.forEach(renderCartItem); // отрисовываем каждый товар
calcTotal();

const countBadge = document.querySelector('.count-badge');
if (cart.length > 0) {
  countBadge.classList.add('count-badge--visible');
}

//
function calcTotal() {
  const countValue = document.querySelector('.cart-icon__count');
  const priceValue = document.querySelector('.price-total');
  let totalCount = 0;
  let totalPrice = 0;
  cart.forEach(product => {
    totalCount += product.count;
    totalPrice += product.count * product.price;
  });
  countValue.textContent = totalCount;
  priceValue.textContent = `Сумма: ${formatPrice(totalPrice)}`;
  console.log(totalCount); 
  console.log(totalPrice);
}
calcTotal();
//

// управления qty в корзине
cartContainer.addEventListener('click', function (event) {

  // Обработка выбора цвета
  const colorSpan = event.target.closest('.cart-item__info-color');
  if (colorSpan) {
    const cartItem = colorSpan.closest('.cart-item');
    const model = cartItem.dataset.model;
    const item = cart.find(p => p.model === model);
    if (!item) return;

    const selectedColor = colorSpan.textContent.trim().toLowerCase();

    const allColors = cartItem.querySelectorAll('.cart-item__info-color');
    allColors.forEach(c => c.classList.remove('color--selected'));

    colorSpan.classList.add('color--selected');
    item.selectedColor = selectedColor;
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(`Выбран цвет для ${model}: ${selectedColor}`);
    return; // выходим — дальше ничего не делаем
  }
  //

  // Обработка выбора размера
  const widthSpan = event.target.closest('.cart-item__info-size');
  if (widthSpan) {
    const cartItem = widthSpan.closest('.cart-item');
    const model = cartItem.dataset.model;
    const item = cart.find(p => p.model === model);
    if (!item) return;

    const selectedWidth = widthSpan.textContent.trim().toLowerCase();

    const allWidth = cartItem.querySelectorAll('.cart-item__info-size');
    allWidth.forEach(w => w.classList.remove('size--selected'));

    widthSpan.classList.add('size--selected');
    item.selectedWidth = selectedWidth;
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(`Выбран размер для ${model}: ${selectedWidth}`);
    return; // выходим — дальше ничего не делаем
  }
  //

  const model = event.target.dataset.model;
  if (!model) return;

  const item = cart.find(p => p.model === model);
  if (!item) return;

  const cartItem = document.querySelector(`.cart-item[data-model="${model}"]`);
  const qtySpan = cartItem.querySelector('.js-qty');

  // Удаление товара
  if (event.target.classList.contains('btn-remove')) {
    cart.splice(cart.indexOf(item), 1);
    cartItem?.remove();
    localStorage.setItem('cart', JSON.stringify(cart));

    // ВОССТАНОВИТЬ кнопку "добавить"
    const orderBtn = document.querySelector(`.js-add-cart[data-id="${model}"]`);
    if (orderBtn) {
      orderBtn.disabled = false;
      orderBtn.textContent = 'добавить';
      orderBtn.classList.remove('ordered');
    }

    if (!cart.length > 0) {
      countBadge.classList.remove('count-badge--visible');
    }

    calcTotal();

    return; // важно! чтобы дальше не пошла логика +/−
  }

  const btnPlus = cartItem.querySelector('.js-plus');
  const btnMinus = cartItem.querySelector('.js-minus');
  //const isLimited = item.limit;
  //console.log(isLimited, isNaN(item.limit));

  const isInvalid = item.limit === undefined || isNaN(item.limit);

  if (event.target.classList.contains('js-plus')) {
    if (!isInvalid && item.count < item.limit) {
      item.count++;
    }
  } else if (event.target.classList.contains('js-minus')) {
    if (item.count > 1) {
      item.count--;
    }
  }

  if (qtySpan) {
    qtySpan.textContent = `${item.count}`;
  }

  btnPlus.disabled = !isInvalid && item.count >= item.limit;
  btnMinus.disabled = item.count <= 1;

  btnPlus.classList.toggle('disabled-btn', btnPlus.disabled);
  btnMinus.classList.toggle('disabled-btn', btnMinus.disabled);

  if (isInvalid) {
    btnPlus.classList.add('disabled-btn', btnPlus.disabled);
    btnMinus.classList.add('disabled-btn', btnMinus.disabled);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  calcTotal();

});
//

// 2. Обработка ВВОДА в поле "обхват талии" (вне блока click!)
cartContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('js-customized-set')) {    
    const cartItem = event.target.closest('.cart-item');
    const input = cartItem.querySelector('.cart-item__customized-input');
    const waistValue = cartItem.querySelector('.cart-item__customized-result');

    // Нормализация (замена запятой на точку, если ввели вручную)
    input.value = input.value.replace(',', '.');
    console.log(input.value);
    waistValue.value = input.value;

    // Проверка валидности
    if (!input.checkValidity()) {
      input.reportValidity(); // покажет встроенное сообщение
      return;
    }

    // Если валидно — удаляем ошибку
    input.classList.remove('input--error');

    const model = cartItem.dataset.model;
    const item = cart.find(p => p.model === model);
    if (!item) return;

    const customizedValue = parseFloat(input.value.trim());

    // Выводим в спан и очищаем input
    waistValue.textContent = customizedValue;
    input.value = '';

    // Обновляем хранилище
    item.customizedValue = customizedValue;
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(`Талия обновлена: ${model} — ${customizedValue} см`);
  }
});

// Очистка всей корзины (вне cartContainer.addEventListener!)
document.querySelector('.js-clear-all').addEventListener('click', () => {
  localStorage.removeItem('cart');
  cart.length = 0;
  cartContainer.innerHTML = '';
  countBadge.classList.remove('count-badge--visible');
  calcTotal();

  // Восстановить все кнопки "добавить"
  document.querySelectorAll('.js-add-cart').forEach(btn => {
    btn.disabled = false;
    btn.textContent = 'добавить';
    btn.classList.remove('ordered');
  });

});

//
document.getElementById('openOrderBtn').addEventListener('click', () => {

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  //if (cart.length === 0) return;
  //TODO
  const orderWarning = document.querySelector('.js-order-warning');
  if (cart.length === 0) {
    orderWarning.textContent = 'Корзина пуста!';
    setTimeout(function() {
      orderWarning.textContent = '';
    }, 2200);
    console.log('Корзина пуста!');
    return;
  }

  for (const item of cart) {
    if (item.category === 'belt') {
      const value = item.customizedValue;
      const numericValue = Number(value);

      // Если нет значения или оно невалидное
      if (!value || isNaN(numericValue)) {
        // Находим соответствующий элемент в DOM
        const cartItem = document.querySelector(`.cart-item[data-model="${item.model}"]`);
        const input = cartItem?.querySelector('.cart-item__customized-input');

        if (input) {
          input.reportValidity();              // покажет сообщение + сам сфокусирует
          input.classList.add('input--error'); 
        } else {
          console.warn(`Поле талии не найдено для модели ${item.model}`);
        }

        return; // Прерываем — форму не открываем
      }
    }
  }

  showForm(); 

});

document.getElementById('closeOrderBtn').addEventListener('click', () => {
  closeForm(); 	 
});

function showForm() {
  cartOverlay.removeEventListener('click', closeCart);
  document.querySelector('.form-overlay').classList.add('form-overlay-view');
  document.querySelector('.form-overlay').classList.remove('form-overlay-hide');
  document.querySelector('.cart-panel').style.overflowY = 'hidden';  	 
}

function closeForm() {
  cartOverlay.addEventListener('click', closeCart);
  document.querySelector('.form-overlay').classList.remove('form-overlay-view');
  document.querySelector('.form-overlay').classList.add('form-overlay-hide');
  document.querySelector('.cart-panel').style.overflowY = 'visible';  
}

const form = document.getElementById('orderForm');
const phoneInput = document.getElementById('phoneInput');
const phoneError = document.getElementById('phoneError');
const checkbox = document.getElementById('formAgreement');

checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    checkbox.classList.remove('input--error');
  }
});

//
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const phone = phoneInput.value.trim();

  // Сброс ошибок
  phoneError.textContent = '';
  phoneInput.classList.remove('input--error');
  checkbox.classList.remove('input--error');

  // Проверка формата
  const phonePattern = /^\+380\d{9}$/;
  if (!phonePattern.test(phone)) {
    phoneError.textContent = 'Введите номер в формате +380XXXXXXXXX';
    phoneInput.classList.add('input--error');
    phoneInput.focus();
    return; // Прерываем отправку формы
  }
  
  if (!checkbox.checked) {
    //checkbox.reportValidity();
    checkbox.classList.add('input--error');
    checkbox.focus();
    return; // останавливаем отправку
  } 
  console.log(checkbox.checked);

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  //showDialog("Отправка заказа...");

  // --- Нативная отправка формы ---
  form.phone.value = phone;
  form.cart.value = JSON.stringify(cart);
  form.secret.value = "Ffvmerug87544g8n4REgv4tgmu"; // твой секрет для GAS
  form.action = "https://script.google.com/macros/s/AKfycbwqmt9Q9Ju0vUAABMzEjNO0nnmjanZltcVxqmyDTFIdakivlgR2xn5JBITIQRTP5IwIAA/exec"; // твой GAS URL
  form.method = "POST";
  console.log(form.secret.value);
  form.submit();

  // Очистка и сообщение
  localStorage.removeItem('cart');

  document.getElementById('phoneInput').value = '';
  enablePageScrolling();
  document.querySelector('.cart__dialog-overlay').classList.remove('c-dialog-view');
  document.querySelector('.cart__dialog-overlay').classList.add('c-dialog-hide');
  //updateInterface();

});
//

  function showDialog(message) {
    disablePageScrolling();
    document.getElementById('modalMessage').textContent = message;
    document.querySelector('.cart__dialog-overlay').classList.remove('c-dialog-hide');
    document.querySelector('.cart__dialog-overlay').classList.add('c-dialog-view');
    closeForm(); 
  }

  function closeDialog() {
    enablePageScrolling();
    document.querySelector('.cart__dialog-overlay').classList.remove('c-dialog-view');
    document.querySelector('.cart__dialog-overlay').classList.add('c-dialog-hide');
    document.getElementById('closeModalBtn').style.display = 'none';
    closeForm(); 
  }

  function updateInterface() {
    document.getElementById('phoneInput').value = '';
    //enablePageScrolling();
    document.querySelector('.cart__dialog-overlay').classList.remove('c-dialog-view');
    document.querySelector('.cart__dialog-overlay').classList.add('c-dialog-hide');
    window.location.reload();
  }


document.getElementById('closeModalBtn').addEventListener('click', closeDialog);
document.getElementById('okBtn').addEventListener('click', updateInterface);

//
window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;

  const latestCart = JSON.parse(localStorage.getItem('cart') || '[]');

  // Обновляем переменную cart
  cart.length = 0;
  cart.push(...latestCart);

  // Обновляем отображение
  cartContainer.innerHTML = '';
  latestCart.forEach(renderCartItem);
  calcTotal();
  if (!cart.length > 0) {
    countBadge.classList.remove('count-badge--visible');
  }

  document.querySelectorAll('.js-add-cart').forEach(btn => {
    const inCart = latestCart.some(p => p.model === btn.dataset.id);
    btn.disabled = inCart;
    btn.textContent = inCart ? 'В корзине' : 'добавить';
    if (!inCart) {
      btn.classList.remove('ordered');
    }
  });
});

