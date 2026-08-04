// archivo.js - JavaScript para Huellitas Web Home Page
// Estructura completa para hacer la página increíble

// Constantes y configuraciones
const STORAGE_KEY = 'huellitas_pet_counts';
const GOOGLE_CLIENT_ID = 'TU_CLIENT_ID_AQUI'; // Reemplaza con tu client ID real

// Funciones de utilidad para localStorage
function loadPetCounts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
}

function savePetCounts(counts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
}

function incrementPetCount(petId) {
    const counts = loadPetCounts();
    counts[petId] = (counts[petId] || 0) + 1;
    savePetCounts(counts);
    console.log(`Pet ${petId} count incremented to ${counts[petId]}`);
}

// Funciones para modales
function getModalContent(modal) {
    return modal.querySelector('.login-modal-content, .notifications-modal-content');
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
        const content = getModalContent(modal);
        // Animación de entrada
        setTimeout(() => {
            modal.style.opacity = '1';
            if (content) {
                content.style.transform = 'translateY(0)';
            }
        }, 10);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.opacity = '0';
        const content = getModalContent(modal);
        if (content) {
            content.style.transform = 'translateY(50px)';
        }
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar scroll
        }, 300);
    }
}

function closeAllModals() {
    closeModal('loginModal');
    closeModal('registerModal');
    closeModal('recoverModal');
    closeModal('notificationsModal');
}

// Funciones de autenticación
function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
}

function getUserName() {
    return localStorage.getItem('userName') || 'Usuario';
}

function loginUser(name = 'Usuario') {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userName', name);
    updateUIForLoggedInUser();
    closeAllModals();
    showNotification(`¡Bienvenido, ${name}!`, 'success');
}

function logoutUser() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userName');
    updateUIForLoggedOutUser();
    showNotification('Has cerrado sesión', 'info');
}

function updateUIForLoggedInUser() {
    const userName = getUserName();
    
    // Ocultar links de login y registro
    document.querySelectorAll('.nav-link.login-link, .nav-link.register-link').forEach(link => {
        link.style.display = 'none';
    });
    
    // Mostrar información del usuario
    let userInfo = document.querySelector('.navbar-user-info');
    if (!userInfo) {
        userInfo = document.createElement('div');
        userInfo.className = 'navbar-user-info';
        userInfo.innerHTML = `
            <span class="user-greeting">Hola, ${userName}</span>
            <button class="logout-btn" onclick="logoutUser()">Cerrar sesión</button>
        `;
        document.querySelector('.navbar-right').appendChild(userInfo);
    }
    
    // Personalizar el contenido principal
    personalizeMainContent(userName);
}

function updateUIForLoggedOutUser() {
    // Mostrar links de login y registro
    document.querySelectorAll('.nav-link.login-link, .nav-link.register-link').forEach(link => {
        link.style.display = 'inline-block';
    });
    
    // Ocultar información del usuario
    const userInfo = document.querySelector('.navbar-user-info');
    if (userInfo) {
        userInfo.remove();
    }
    
    // Restaurar contenido principal
    restoreMainContent();
}

function personalizeMainContent(userName) {
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        // Agregar mensaje de bienvenida personalizado
        let welcomeMessage = document.querySelector('.welcome-message');
        if (!welcomeMessage) {
            welcomeMessage = document.createElement('div');
            welcomeMessage.className = 'welcome-message';
            welcomeMessage.innerHTML = `
                <div style="text-align: center; margin: 20px 0; padding: 20px; background: rgba(255,255,255,0.9); border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <h2 style="color: #6d4dff; margin-bottom: 10px;">¡Bienvenido de vuelta, ${userName}!</h2>
                    <p style="color: #7a6aa8; font-size: 16px;">Explora las últimas publicaciones y encuentra tu próxima mascota favorita.</p>
                </div>
            `;
            mainContainer.insertBefore(welcomeMessage, mainContainer.firstChild);
        }
    }
}

function restoreMainContent() {
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
}

// Funciones para Google Sign-In
function handleCredentialResponse(response) {
    console.log("JWT Token: " + response.credential);

    // Aquí puedes enviar el token a tu servidor backend
    // fetch('/api/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ token: response.credential })
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log('Login successful:', data);
    // })
    // .catch(error => {
    //     console.error('Login failed:', error);
    // });

    // Simular login con Google
    loginUser('Usuario Google');
}
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        font-family: 'Poppins', sans-serif;
    `;

    document.body.appendChild(notification);

    // Auto-remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Animaciones CSS para notificaciones (agregar a CSS si no existen)
const notificationStyles = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;

// Agregar estilos de notificación al head
const style = document.createElement('style');
style.textContent = notificationStyles;
document.head.appendChild(style);

function initializeForms() {
    // Manejar envío de formularios de login y registro
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateLoginForm()) {
            const email = document.getElementById('loginEmail').value;
            const name = email.split('@')[0]; // Simular nombre desde email
            loginUser(name);
            // Redirigir a home.html si no estamos ahí
            if (window.location.pathname !== '/home.html') {
                window.location.href = 'home.html';
            }
        }
    });

    registerForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateRegisterForm()) {
            const name = document.getElementById('registerName').value;
            loginUser(name);
            // Redirigir a home.html si no estamos ahí
            if (window.location.pathname !== '/home.html') {
                window.location.href = 'home.html';
            }
        }
    });
}

function validateLoginForm() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    let isValid = true;

    // Limpiar errores previos
    hideAllErrors('login');

    if (!email) {
        showError('loginEmailError', 'Ingresa tu correo electrónico');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('loginEmailError', 'Ingresa un correo electrónico válido');
        isValid = false;
    }

    if (!password) {
        showError('loginPasswordError', 'Ingresa tu contraseña');
        isValid = false;
    }

    return isValid;
}

function validateRegisterForm() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
    let isValid = true;

    // Limpiar errores previos
    hideAllErrors('register');

    if (!name) {
        showError('registerNameError', 'Ingresa tu nombre completo');
        isValid = false;
    }

    if (!email) {
        showError('registerEmailError', 'Ingresa tu correo electrónico');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('registerEmailError', 'Ingresa un correo electrónico válido');
        isValid = false;
    }

    if (!password) {
        showError('registerPasswordError', 'Crea una contraseña');
        isValid = false;
    } else if (password.length < 6) {
        showError('registerPasswordError', 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    }

    if (!confirmPassword) {
        showError('registerConfirmPasswordError', 'Confirma tu contraseña');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('registerConfirmPasswordError', 'Las contraseñas no coinciden');
        isValid = false;
    }

    return isValid;
}

function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function hideAllErrors(prefix) {
    const errors = document.querySelectorAll(`#${prefix}Form .error-message`);
    errors.forEach(error => {
        error.classList.remove('show');
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para búsqueda
function handleSearch() {
    const searchInputs = document.querySelectorAll('.search-box input');
    const searchData = {
        tipo: searchInputs[0]?.value || '',
        edad: searchInputs[1]?.value || '',
        ubicacion: searchInputs[2]?.value || ''
    };

    // Guardar en localStorage para usar en buscar.html
    localStorage.setItem('huellitas_search', JSON.stringify(searchData));

    // Redirigir a página de búsqueda
    window.location.href = 'buscar.html';
}

// Funciones para mascotas destacadas
function handlePetCardClick(petId) {
    incrementPetCount(petId);
    // Aquí puedes agregar navegación a página de detalle
    // window.location.href = `pet-${petId}.html`;
}

// Funciones de inicialización
function initializeModals() {
    // Event listeners para abrir modales
    document.getElementById('openLoginModal')?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('loginModal');
    });

    document.getElementById('openRegisterModal')?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('registerModal');
    });

    // Event listeners para cerrar modales
    document.getElementById('closeLoginModal')?.addEventListener('click', () => closeModal('loginModal'));
    document.getElementById('closeRegisterModal')?.addEventListener('click', () => closeModal('registerModal'));

    // Cerrar modal al hacer click fuera
    document.getElementById('loginModal')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeModal('loginModal');
        }
    });

    document.getElementById('registerModal')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeModal('registerModal');
        }
    });

    document.getElementById('recoverModal')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeModal('recoverModal');
        }
    });

    document.getElementById('notificationsModal')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeModal('notificationsModal');
        }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function initializePetCards() {
    document.querySelectorAll('.pet-card.big[data-pet]').forEach(card => {
        card.addEventListener('click', () => {
            const petId = card.dataset.pet;
            handlePetCardClick(petId);
        });

        // Agregar efecto hover suave
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
            card.style.transition = 'transform 0.2s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
}

function initializeSearch() {
    const searchBtn = document.querySelector('.search-section .primary-btn');
    searchBtn?.addEventListener('click', handleSearch);

    // Permitir búsqueda con Enter
    document.querySelectorAll('.search-box input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    });
}

function initializeGoogleSignIn() {
    // Verificar si Google API está cargada
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse
        });

        // Renderizar botones de Google Sign-In
        const googleButtons = document.querySelectorAll('.g_id_signin');
        googleButtons.forEach(button => {
            google.accounts.id.renderButton(button, {
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                shape: 'rectangular',
                logo_alignment: 'left'
            });
        });
    } else {
        console.warn('Google Sign-In API not loaded');
    }
}

function initializeNavbarSearch() {
    const navbarSearch = document.querySelector('.navbar-search');
    navbarSearch?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = navbarSearch.value.trim();
            if (query) {
                // Redirigir a búsqueda con query
                localStorage.setItem('huellitas_navbar_search', query);
                window.location.href = 'buscar.html';
            }
        }
    });
}

// Función principal de inicialización
function initializePage() {
    console.log('Initializing Huellitas Web Home Page...');

    // Verificar estado de login y actualizar UI
    if (isLoggedIn()) {
        updateUIForLoggedInUser();
    } else {
        updateUIForLoggedOutUser();
    }

    initializeModals();
    initializeForms();
    initializePetCards();
    initializeSearch();
    initializeNavbarSearch();

    // Inicializar Google Sign-In después de que la página cargue completamente
    window.addEventListener('load', () => {
        initializeGoogleSignIn();
    });

    // Agregar animaciones de scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Agregar efectos de parallax al scroll (opcional)
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.dog-illustration img');
        parallaxElements.forEach(el => {
            el.style.transform = `translateY(${scrolled * 0.1}px)`;
        });
    });

    console.log('Huellitas Web Home Page initialized successfully!');
}

// Función para scroll hacia abajo en modales
function scrollToBottom(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const content = modal.querySelector('.notifications-modal-content');
        if (content) {
            content.scrollTop = content.scrollHeight;
        }
    }
}

// Ejecutar inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// Exportar funciones para uso en consola o otros scripts
window.HuellitasWeb = {
    openModal,
    closeModal,
    showNotification,
    incrementPetCount,
    handleSearch,
    scrollToBottom
};