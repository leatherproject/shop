//export const accordion = () => {

function initAccordion(container) {
  const questions = container.querySelectorAll('.js-accordion-toggle');

  questions.forEach(question => {
    question.addEventListener('click', () => {
      question.classList.toggle('active');
      const faqItem = question.closest('.faq__item');
      const panel = faqItem.querySelector('.faq__answer');

      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        panel.classList.remove('js-open-style'); //TODO - тест
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.classList.add('js-open-style'); //TODO - тест
      }
    });
  });
}

//} // export

