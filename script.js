// Navigation mobile
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu mobile
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Fermer le menu quand on clique sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Effet de scroll sur le header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Smooth scroll pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer tous les éléments à animer
    document.querySelectorAll('.info-card, .service-card, .gallery-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les données du formulaire
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');

            // Validation simple
            if (!name || !email || !message) {
                showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }

            // Validation email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Veuillez entrer une adresse email valide.', 'error');
                return;
            }

            // Simuler l'envoi du formulaire
            showNotification('Message envoyé avec succès! Nous vous répondrons bientôt.', 'success');
            this.reset();
        });
    }

    // Gestion de la galerie photo
    setupGallery();
});

// Images de la galerie (vous pouvez personnaliser cette liste)
const galleryImages = [
    'images/1.jpg',
    'images/2.jpg',
    'images/3.jpg',
    'images/4.jpg'
];

let currentImageIndex = 0;

function setupGallery() {
    // Les vraies images sont déjà configurées dans le HTML
    // Cette fonction n'est plus nécessaire mais on la garde pour compatibilité
}

function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    // Trouver l'index de l'image actuelle
    currentImageIndex = galleryImages.findIndex(img => img === imageSrc);
    if (currentImageIndex === -1) {
        // Si l'image n'est pas dans la liste, utiliser l'index basé sur l'élément
        const galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));
        currentImageIndex = galleryItems.findIndex(img => img.src.includes(imageSrc));
    }
    
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    document.body.style.overflow = 'hidden';
    
    // Ajouter les événements clavier
    document.addEventListener('keydown', handleModalKeydown);
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Retirer les événements clavier
    document.removeEventListener('keydown', handleModalKeydown);
}

function changeImage(direction) {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const totalImages = galleryItems.length;
    
    currentImageIndex += direction;
    
    if (currentImageIndex >= totalImages) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = totalImages - 1;
    }
    
    const modalImg = document.getElementById('modalImage');
    modalImg.src = galleryItems[currentImageIndex].src;
}

function handleModalKeydown(e) {
    switch(e.key) {
        case 'Escape':
            closeModal();
            break;
        case 'ArrowLeft':
            changeImage(-1);
            break;
        case 'ArrowRight':
            changeImage(1);
            break;
    }
}

// Fermer le modal en cliquant en dehors de l'image
document.addEventListener('click', function(e) {
    const modal = document.getElementById('imageModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Système de notifications
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Créer la nouvelle notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Ajouter les styles de notification si ils n'existent pas
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                padding: 1rem 1.5rem;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-left: 4px solid #5a8a5f;
            }
            .notification-success {
                border-left-color: #28a745;
            }
            .notification-error {
                border-left-color: #dc3545;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notification-content i {
                font-size: 1.2rem;
            }
            .notification-success .notification-content i {
                color: #28a745;
            }
            .notification-error .notification-content i {
                color: #dc3545;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1rem;
                cursor: pointer;
                color: #666;
                margin-left: 1rem;
            }
            .notification-close:hover {
                color: #333;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Effet de parallaxe léger sur le hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Compteur animé pour les statistiques (si vous voulez ajouter des statistiques)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.ceil(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Lazy loading pour les images
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Gestion des erreurs d'images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Remplacer par une image de placeholder si l'image ne charge pas
            if (!this.src.includes('picsum.photos')) {
                this.src = 'https://picsum.photos/400/250?grayscale';
                this.alt = 'Image non disponible';
            }
        });
    });
});
