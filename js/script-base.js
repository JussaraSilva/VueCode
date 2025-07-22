// ========== INICIALIZAÇÃO GERAL ==========
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initModals();
  initSlider();
  initializeFaqAccordion();
  initMenuScrollSpy();
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

// Este é o seu módulo ou arquivo JS principal
// Supondo que você já tenha uma estrutura como esta para outras funções

function initializeFaqAccordion() {
        const faqQuestions = document.querySelectorAll('.faq-question');

        faqQuestions.forEach(button => {
            button.addEventListener('click', () => {
                const faqItem = button.closest('.faq-item');
                const faqAnswer = faqItem.querySelector('.faq-answer');

                // Fecha qualquer outra resposta aberta na mesma categoria
                const parentCategory = button.closest('.faq-category');
                parentCategory.querySelectorAll('.faq-question.active').forEach(activeButton => {
                    if (activeButton !== button) {
                        activeButton.classList.remove('active');
                        activeButton.closest('.faq-item').querySelector('.faq-answer').classList.remove('show');
                        activeButton.closest('.faq-item').querySelector('.faq-answer').style.maxHeight = '0';
                        activeButton.closest('.faq-item').querySelector('.faq-answer').style.paddingBottom = '0';
                    }
                });

                // Alterna a classe 'active' na pergunta
                button.classList.toggle('active');

                // Alterna a exibição da resposta
                if (faqAnswer.classList.contains('show')) {
                    faqAnswer.classList.remove('show');
                    faqAnswer.style.maxHeight = '0';
                    faqAnswer.style.paddingBottom = '0';
                } else {
                    faqAnswer.classList.add('show');
                    // Define a altura máxima para a altura real do conteúdo para a transição
                    faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
                    faqAnswer.style.paddingBottom = '25px'; // Volta ao padding original
                }
            });
        });
    }



/**
 * Inicializa o comportamento de ativação do item de menu
 * com base na seção visível na tela (scrollspy).
 * Usa IntersectionObserver para performance.
 */
function initMenuScrollSpy() {
    // Seleciona todos os links do menu que apontam para IDs internas (começam com #)
    const menuLinks = document.querySelectorAll('.menu-header a[href^="#"]');

    // Seleciona todas as seções principais da página que têm uma ID.
    // Ajuste o seletor 'main section[id]' se suas seções estiverem em outro lugar
    // ou tiverem uma classe específica que você prefira usar (ex: '.section-page[id]').
    const sections = document.querySelectorAll('main section[id]');

    // Função auxiliar para remover a classe 'active' de todos os links do menu
    const removeActiveClass = () => {
        menuLinks.forEach(link => {
            link.classList.remove('active');
        });
    };

    // Callback que será executado quando uma seção entra ou sai da viewport
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Se a seção está intersectando a viewport (está visível)
                removeActiveClass(); // Remove 'active' de todos os links primeiro
                const currentSectionId = entry.target.id; // Pega a ID da seção visível
                const correspondingLink = document.querySelector(`.menu-header a[href="#${currentSectionId}"]`); // Encontra o link correspondente no menu

                if (correspondingLink) {
                    correspondingLink.classList.add('active'); // Adiciona a classe 'active' ao link correto
                }
            }
        });
    };

    // Opções para o IntersectionObserver
    const observerOptions = {
        root: null, // O 'root' é a viewport padrão (janela do navegador)
        // O 'rootMargin' define uma margem ao redor da 'root'.
        // '0px 0px -50% 0px' significa que a intersecção será calculada quando
        // a parte inferior da viewport estiver 50% acima do elemento.
        // Isso faz com que a ativação do menu ocorra quando o topo da seção
        // atinge aproximadamente a metade da tela.
        // Você pode ajustar este valor (ex: '-20%' para ativar mais cedo, '-80%' para mais tarde)
        rootMargin: '0px 0px -50% 0px',
        threshold: 0.1 // A seção deve estar 10% visível para ser considerada "intersecting"
    };

    // Cria uma nova instância do IntersectionObserver
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Começa a observar cada seção
    sections.forEach(section => {
        observer.observe(section);
    });

    // Opcional: Adicionar scroll suave ao clicar nos links do menu
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o comportamento padrão de pular
            const targetId = link.getAttribute('href'); // Pega o href (ex: "#recursos")
            const targetSection = document.querySelector(targetId); // Encontra a seção correspondente

            if (targetSection) {
                // Rola suavemente até a seção.
                // O '- (window.innerHeight * 0.1)' adiciona um pequeno offset do topo,
                // útil se você tem um cabeçalho fixo. Ajuste ou remova se necessário.
                window.scrollTo({
                    top: targetSection.offsetTop - (window.innerHeight * 0.1),
                    behavior: 'smooth'
                });

                // Para uma resposta visual mais imediata, você pode ativar a classe aqui também,
                // embora o IntersectionObserver vá revalidar ao final do scroll.
                removeActiveClass();
                link.classList.add('active');
            }
        });
    });

    // Lida com o caso de a página ser carregada com um hash na URL (ex: meudominio.com/#contato)
    // ou quando o usuário dá um refresh na página em uma seção específica.
    const activateOnLoad = () => {
        const currentHash = window.location.hash;
        if (currentHash) {
            const correspondingLink = document.querySelector(`.menu-header a[href="${currentHash}"]`);
            if (correspondingLink) {
                removeActiveClass();
                correspondingLink.classList.add('active');
                // Opcional: Rolar para a seção se a página carregou com um hash
                const targetSection = document.querySelector(currentHash);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - (window.innerHeight * 0.1), // Ajuste conforme a altura do seu header
                        behavior: 'smooth'
                    });
                }
            }
        } else {
            // Se não há hash, ative o "Início" por padrão ao carregar
            const inicioLink = document.querySelector('.menu-header a[href="#inicio"]');
            if (inicioLink) {
                removeActiveClass(); // Certifica-se de que nada mais esteja ativo
                inicioLink.classList.add('active');
            }
        }
    };

    // Chama a função ao carregar a página
    activateOnLoad();
    // Adiciona um listener para o evento hashchange, caso o usuário mude o hash diretamente na URL
    window.addEventListener('hashchange', activateOnLoad);
}