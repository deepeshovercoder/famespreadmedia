'use strict';

/**
 * add event on element
 */


const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * toggle navbar
 */

const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navToggler = document.querySelector("[data-nav-toggler]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
}

addEventOnElem(navToggler, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * header active
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

const inputs = document.querySelectorAll(".input");

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});


class Carousel {
  element = null;
  buttonDisabled = false;
  nav = null;
  items = [];
  size = 3; // number of items to show
  gap = 16; // in px
  activeClass = true;
  itemProps = {
    width: 0,
    left: 0
  };

  constructor(element) {
    this.element = element;
    this.items = document.querySelectorAll(".carousel__item");
    this.nav = element.parentElement.querySelectorAll(".carousel__nav__item");
    this.init();
  }

  async init() {
    await this.setMinItems();

    this.itemProps.width = await this.getSize();
    this.element.style.height = this.items[0].clientHeight + "px";

    // Add event listener to buttons
    for (let i = 0; i < this.nav.length; i++) {
      let currentNavElement = this.nav[i];
      this.nav[i].addEventListener("click", () =>
        this.moveHandler(currentNavElement)
      );
    }

    // update nodelist
    this.nav = this.element.parentElement.querySelector(".carousel__nav");
    await this.build();
  }

  async setMinItems() {
    const minItems = this.size + 2;
    if (this.items.length < minItems) {
      let currentLength = this.items.length;
      for (let i = 0; i < currentLength; i++) {
        let clonedItem = this.items[i].cloneNode(true);
        this.element.append(clonedItem);
      }
      this.items = document.querySelectorAll(".carousel__item");
    }
  }

  async getSize() {
    let totalSpacing = this.gap * (this.size - 1); // no need to space for last element
    let width = this.element.clientWidth - totalSpacing; // width without scrollbar
    width = width / this.size;

    return width;
  }

  async build() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].style.width = this.itemProps.width + "px";
      // (i - 1) so we start with second item and get clean animation (hides shifting)
      this.items[i].style.left =
        (this.itemProps.width + this.gap) * (i - 1) + "px";
    }
    if (this.activeClass) {
      this.setActiveClass();
    }

    this.toString(this.items);
  }

  async move(pos) {
    let item = 0;

    // Assign cloned item
    if (pos === "next") {
      item = this.items[0];
    } else {
      item = this.items[this.items.length - 1];
    }

    let clonedItem = item.cloneNode(true);

    if (pos === "next") {
      this.element.append(clonedItem);
    } else {
      this.element.prepend(clonedItem);
    }
    item.remove();
    // Since NodeList and static update it
    this.items = document.querySelectorAll(".carousel__item");
  }

  async next() {
    this.move("next");
    this.build();
  }

  async prev() {
    this.move("prev");
    this.build();
  }

  async setActiveClass() {
    let mean = Math.round(this.size / 2);
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].classList.remove("carousel__item--active");
      if (i === mean) {
        this.items[i].classList.add("carousel__item--active");
      }
    }
  }

  async moveHandler(element) {
    if (!this.buttonDisabled) {
      // Disabled button to prevent spam clicking
      this.buttonDisabled = true;
      let direction = element.getAttribute("data-direction");
      if (direction === "next") {
        this.next();
      } else {
        this.prev();
      }
      setTimeout(() => (this.buttonDisabled = false), 800);
    }
  }
}

// testimonials
const slider = document.querySelector(".testimonial-slider");
const testimonials = document.querySelectorAll(".testimonial");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const dotsContainer = document.querySelector(".dots-container");

let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let autoSlideInterval;

//* event listeners

function initApp() {
  slider.addEventListener("touchstart", handleTouchStart);
  slider.addEventListener("touchend", handleTouchEnd);
  slider.addEventListener("mouseover", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);
  nextBtn.addEventListener("click", nextTestimonial);
  prevBtn.addEventListener("click", prevTestimonial);
}

//* auto slide

function startAutoSlide() {
  autoSlideInterval = setInterval(nextTestimonial, 5000); // 5s
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

//* touch navigation

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].clientX;

  handleTouchSwipe();
}

function handleTouchSwipe() {
  const swipeThreshold = 50; // swipe sensitivity

  if (touchStartX - touchEndX > swipeThreshold) {
    nextTestimonial(); // swipe left
  } else if (touchEndX - touchStartX > swipeThreshold) {
    prevTestimonial(); // swipe right
  }
}

//* dot navigation

function renderDotButtons() {
  for (let i = 0; i < testimonials.length; i++) {
    const button = document.createElement("button");
    button.classList.add("dot");
    button.classList.toggle("active", i === currentIndex);
    button.ariaLabel = `Jump to Testimonial ${i + 1}`;
    button.addEventListener("click", () => showTestimonial(i));
    dotsContainer.appendChild(button);
  }
}

//* slide functions

function showTestimonial(index) {
  currentIndex = index;

  // update slide position
  testimonials.forEach((testimonial) => {
    testimonial.style.transform = `translateX(${-index * 100}%)`;
  });

  // update active dot
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

function nextTestimonial() {
  const nextIndex = (currentIndex + 1) % testimonials.length;
  showTestimonial(nextIndex);
}

function prevTestimonial() {
  const prevIndex =
    (currentIndex - 1 + testimonials.length) % testimonials.length;
  showTestimonial(prevIndex);
}

//* initialize

document.addEventListener("DOMContentLoaded", function () {
  renderDotButtons();
  startAutoSlide();
  initApp();
});

