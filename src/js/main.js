const footerAction = document.querySelector(".footer__header__action");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".modal__close");
const modalContent = document.querySelector(".modal__content");
const contactForm = document.querySelector(".contact-form");
const fullNameError = document.querySelector(".contact-form__error--full-name");
const emailError = document.querySelector(".contact-form__error--email");
const messageError = document.querySelector(".contact-form__error--message");
const mainTitle = document.querySelector(".modal__title--main");
const successTitle = document.querySelector(".modal__title--success");
const contactFormAction = document.querySelector(".contact-form__action");

const EMAIL_REGEX = /^[\w.-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

const lockBodyScroll = () => {
  document.body.classList.add("scroll-lock");
};

const unlockBodyScroll = () => {
  document.body.classList.remove("scroll-lock");
};

const handleOpenModal = () => {
  mainTitle.classList.remove("modal__title--hidden");
  successTitle.classList.add("modal__title--hidden");
  contactForm.classList.remove("contact-form--hidden");
  modal.classList.add("modal--opened");
  lockBodyScroll();
};

const handleCloseModal = () => {
  modal.classList.remove("modal--opened");
  unlockBodyScroll();
};

const handleClickModal = (event) => {
  if (modalContent.contains(event.target)) {
    return;
  }

  handleCloseModal();
};

const onSubmitForm = (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const { fullName, email, message } = Object.fromEntries(formData);
  let isError = false;

  if (fullName.length < 4) {
    fullNameError.classList.add("contact-form__error--visible");
    isError = true;
  } else {
    fullNameError.classList.remove("contact-form__error--visible");
  }

  if (!EMAIL_REGEX.test(email)) {
    emailError.classList.add("contact-form__error--visible");
    isError = true;
  } else {
    emailError.classList.remove("contact-form__error--visible");
  }

  if (message.length < 4) {
    messageError.classList.add("contact-form__error--visible");
    isError = true;
  } else {
    messageError.classList.remove("contact-form__error--visible");
  }

  if (isError) {
    return;
  }

  contactFormAction.disabled = true;

  fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    body: JSON.stringify({ fullName, email, message }),
  })
    .then(() => {
      mainTitle.classList.add("modal__title--hidden");
      successTitle.classList.remove("modal__title--hidden");
      contactForm.classList.add("contact-form--hidden");
    })
    .finally(() => {
      contactFormAction.disabled = false;
    });
};

footerAction.addEventListener("click", handleOpenModal);

closeModal.addEventListener("click", handleCloseModal);

modal.addEventListener("click", handleClickModal);

contactForm.addEventListener("submit", onSubmitForm);
