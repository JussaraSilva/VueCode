// ========== INICIALIZAÇÃO GERAL ==========
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initModals();
  initSlider();
  // Adicione outras funções aqui no futuro
});

// ========== CABEÇALHO COM SCROLL ==========
function initHeaderScroll() {
  const header = document.querySelector('.cabecalho-site');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ========== MENU MOBILE ==========
function initMobileMenu() {
  const mobileNav = document.getElementById('mobileNav');
  const menuIcon = document.getElementById('menuIcon');
  const btnMenuHiden = document.querySelector('.btn-menu-hiden');

  if (!mobileNav || !menuIcon || !btnMenuHiden) return;

  btnMenuHiden.addEventListener('click', () => {
    mobileNav.classList.toggle('active');

    menuIcon.classList.toggle('bi-list', !mobileNav.classList.contains('active'));
    menuIcon.classList.toggle('bi-x', mobileNav.classList.contains('active'));
  });

  document.addEventListener('click', (event) => {
    const clickedOutside = !mobileNav.contains(event.target) && !btnMenuHiden.contains(event.target);
    if (clickedOutside && mobileNav.classList.contains('active')) {
      mobileNav.classList.remove('active');
      menuIcon.classList.remove('bi-x');
      menuIcon.classList.add('bi-list');
    }
  });
}

// ========== MODAIS DE LOGIN E CADASTRO ==========
function initModals() {
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');

  window.openLoginModal = () => loginModal?.classList.add('active');
  window.openRegisterModal = () => registerModal?.classList.add('active');

  function closeModal(event, id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    const clickedOverlay = event.target === overlay || event.target.classList.contains('modal-close');
    if (clickedOverlay) overlay.classList.remove('active');
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.modal')) return;

    if (e.target.id === 'loginModal' || e.target.classList.contains('modal-close')) {
      closeModal(e, 'loginModal');
    }
    if (e.target.id === 'registerModal' || e.target.classList.contains('modal-close')) {
      closeModal(e, 'registerModal');
    }
  });

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Login:', e.target.loginEmail.value, e.target.loginPass.value);
    loginModal?.classList.remove('active');
  });

  registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Cadastro:', e.target.regName.value, e.target.regEmail.value, e.target.regPass.value);
    registerModal?.classList.remove('active');
  });
}

// ========== SLIDER COM AUTOPLAY E PAGINAÇÃO ==========
function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let autoplayInterval;

  if (!slides.length || !dots.length) return;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      const next = (currentSlide + 1) % slides.length;
      goToSlide(next);
    }, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoplay();
    });
  });

  startAutoplay();
}
