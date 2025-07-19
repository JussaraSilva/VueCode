document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.cabecalho-site');
    
    window.addEventListener('scroll', function() {
        // Adiciona a classe quando rolar mais de 50px
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = document.getElementById('menuIcon'); // Obter o ícone

    mobileNav.classList.toggle('active'); // Alterna a classe 'active' no menu

    // Alterna as classes do ícone
    if (mobileNav.classList.contains('active')) {
        menuIcon.classList.remove('bi-list');
        menuIcon.classList.add('bi-x'); // Mudar para 'X'
    } else {
        menuIcon.classList.remove('bi-x');
        menuIcon.classList.add('bi-list'); // Mudar de volta para 'hambúrguer'
    }
}

// Opcional: Fechar o menu se clicar fora dele
document.addEventListener('click', function(event) {
    const mobileNav = document.getElementById('mobileNav');
    const btnMenuHiden = document.querySelector('.btn-menu-hiden'); // O botão hambúrguer
    const menuIcon = document.getElementById('menuIcon');

    // Se o clique não foi dentro do menu E não foi no botão que abre/fecha
    if (!mobileNav.contains(event.target) && !btnMenuHiden.contains(event.target) && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        menuIcon.classList.remove('bi-x');
        menuIcon.classList.add('bi-list');
    }
});


// Modal Login e Cadastro 

function openLoginModal() {
  document.getElementById('loginModal').classList.add('active');
}
function openRegisterModal() {
  document.getElementById('registerModal').classList.add('active');
}

function closeModal(event, id) {
  // evita fechar quando clicar dentro do conteúdo
  if (event.target.id !== id) return;
  document.getElementById(id).classList.remove('active');
}

// (Opcional) prevenir reload padrão no submit
document.getElementById('loginForm')
  .addEventListener('submit', e => {
    e.preventDefault();
    // aqui você manda pro seu backend…
    console.log('Login:', 
      e.target.loginEmail.value, 
      e.target.loginPass.value
    );
    closeModal({ target: document.getElementById('loginModal') }, 'loginModal');
  });

document.getElementById('registerForm')
  .addEventListener('submit', e => {
    e.preventDefault();
    console.log('Cadastro:', 
      e.target.regName.value,
      e.target.regEmail.value,
      e.target.regPass.value
    );
    closeModal({ target: document.getElementById('registerModal') }, 'registerModal');
  });


  function closeModal(event, id) {
  const overlay = document.getElementById(id);
  // fecha se clicar no overlay (background) OU no botão .modal-close
  if (event.target === overlay || event.target.classList.contains('modal-close')) {
    overlay.classList.remove('active');
  }
}


