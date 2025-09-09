'use strict';

const clickManager = {
  clickOutside: true
};

const socialNetworkIcon = document.querySelector('.social-mobile__base-icon');
const linksWrapper = document.querySelector('.social-mobile'); 
const links = document.querySelectorAll('.social-mobile__link');

function showIcons(event) {
  links.forEach(link => link.classList.toggle('icons-show'));
  socialNetworkIcon.classList.toggle('base-icon-hidden');

  if (clickManager.clickOutside) {
    document.addEventListener('click', handleClickOutside);
  }
}

function handleClickOutside(event) {
  if (!linksWrapper.contains(event.target) && event.target !== socialNetworkIcon) {
    links.forEach(link => link.classList.remove('icons-show'));
    socialNetworkIcon.classList.remove('base-icon-hidden');
    document.removeEventListener('click', handleClickOutside);
  }
}

socialNetworkIcon.addEventListener('click', showIcons);

