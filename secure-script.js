// Base de données simulée des défunts (en production, ceci serait dans une vraie base de données sécurisée)
const defuntsDatabase = {
    'FAM-2025-001': {
        name: 'Jean Martin',
        birthDate: '15/03/1945',
        deathDate: '12/01/2025',
        tombNumber: 'Section A - Rangée 12 - N°45',
        section: 'Section A',
        gpsCoordinates: '45.7578° N, 4.8320° E',
        accessCode: '123456',
        lastVisit: '18/07/2025',
        nextCommemoration: '12/01/2026',
        authorizedBy: 'Marie Martin (Épouse)'
    },
    'FAM-2025-002': {
        name: 'Sophie Dubois',
        birthDate: '22/08/1962',
        deathDate: '05/02/2025',
        tombNumber: 'Section B - Rangée 8 - N°23',
        section: 'Section B',
        gpsCoordinates: '45.7580° N, 4.8325° E',
        accessCode: '789012',
        lastVisit: '10/07/2025',
        nextCommemoration: '05/02/2026',
        authorizedBy: 'Pierre Dubois (Fils)'
    },
    'FAM-2025-003': {
        name: 'Ahmed Hassan',
        birthDate: '10/12/1938',
        deathDate: '28/06/2025',
        tombNumber: 'Section C - Rangée 5 - N°67',
        section: 'Section C',
        gpsCoordinates: '45.7582° N, 4.8318° E',
        accessCode: '456789',
        lastVisit: '15/07/2025',
        nextCommemoration: '28/06/2026',
        authorizedBy: 'Fatima Hassan (Épouse)'
    }
};

// Variables globales
let currentSession = null;
let accessExpiryTime = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkExistingSession();
});

function setupEventListeners() {
    const loginForm = document.getElementById('secure-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Formatage automatique des champs
    const familyIdInput = document.getElementById('family-id');
    if (familyIdInput) {
        familyIdInput.addEventListener('input', formatFamilyId);
    }

    const accessCodeInput = document.getElementById('access-code');
    if (accessCodeInput) {
        accessCodeInput.addEventListener('input', formatAccessCode);
    }

    // Gestion de la sécurité
    setupSecurityFeatures();
}

function formatFamilyId(event) {
    let value = event.target.value.toUpperCase();
    // Format: FAM-YYYY-XXX
    value = value.replace(/[^A-Z0-9]/g, '');
    if (value.length > 3) {
        value = value.substring(0, 3) + '-' + value.substring(3);
    }
    if (value.length > 8) {
        value = value.substring(0, 8) + '-' + value.substring(8);
    }
    if (value.length > 12) {
        value = value.substring(0, 12);
    }
    event.target.value = value;
}

function formatAccessCode(event) {
    let value = event.target.value.replace(/[^0-9]/g, '');
    if (value.length > 6) {
        value = value.substring(0, 6);
    }
    event.target.value = value;
}

function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = {
        deceasedName: formData.get('deceased-name').trim(),
        familyId: formData.get('family-id').trim(),
        tombNumber: formData.get('tomb-number').trim(),
        accessCode: formData.get('access-code').trim()
    };

    // Validation des données
    if (!validateLoginData(loginData)) {
        return;
    }

    // Tentative d'authentification
    const authResult = authenticateUser(loginData);
    
    if (authResult.success) {
        handleSuccessfulLogin(authResult.data, loginData.familyId);
    } else {
        handleFailedLogin(authResult.message);
    }
}

function validateLoginData(data) {
    const errors = [];

    if (!data.deceasedName) {
        errors.push('Le nom du défunt est requis');
    }

    if (!data.familyId || !data.familyId.match(/^FAM-\d{4}-\d{3}$/)) {
        errors.push('L\'ID famille doit être au format FAM-YYYY-XXX');
    }

    if (!data.tombNumber) {
        errors.push('Le numéro de tombe est requis');
    }

    if (!data.accessCode || data.accessCode.length !== 6) {
        errors.push('Le code d\'accès doit contenir 6 chiffres');
    }

    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }

    return true;
}

function authenticateUser(loginData) {
    // Vérifier si l'ID famille existe
    const familyData = defuntsDatabase[loginData.familyId];
    
    if (!familyData) {
        logSecurityEvent('FAILED_LOGIN_ATTEMPT', `Invalid family ID: ${loginData.familyId}`);
        return {
            success: false,
            message: 'ID famille non trouvé dans notre base de données'
        };
    }

    // Vérifier le nom du défunt
    if (familyData.name.toLowerCase() !== loginData.deceasedName.toLowerCase()) {
        logSecurityEvent('FAILED_LOGIN_ATTEMPT', `Name mismatch for ID: ${loginData.familyId}`);
        return {
            success: false,
            message: 'Le nom du défunt ne correspond pas à nos enregistrements'
        };
    }

    // Vérifier le numéro de tombe
    if (familyData.tombNumber !== loginData.tombNumber) {
        logSecurityEvent('FAILED_LOGIN_ATTEMPT', `Tomb number mismatch for ID: ${loginData.familyId}`);
        return {
            success: false,
            message: 'Le numéro de tombe ne correspond pas'
        };
    }

    // Vérifier le code d'accès
    if (familyData.accessCode !== loginData.accessCode) {
        logSecurityEvent('FAILED_LOGIN_ATTEMPT', `Wrong access code for ID: ${loginData.familyId}`);
        return {
            success: false,
            message: 'Code d\'accès incorrect'
        };
    }

    // Authentification réussie
    logSecurityEvent('SUCCESSFUL_LOGIN', `User authenticated for ID: ${loginData.familyId}`);
    return {
        success: true,
        data: familyData
    };
}

function handleSuccessfulLogin(userData, familyId) {
    // Créer la session
    createSession(userData, familyId);
    
    // Afficher les informations
    displayUserInformation(userData, familyId);
    
    // Cacher le formulaire de connexion
    document.getElementById('login-section').style.display = 'none';
    
    // Afficher les informations
    document.getElementById('info-section').style.display = 'block';
    
    // Notification de succès
    showNotification('Accès autorisé avec succès!', 'success');
    
    // Scroll vers les informations
    document.getElementById('info-section').scrollIntoView({ behavior: 'smooth' });
}

function handleFailedLogin(message) {
    showNotification(message, 'error');
    
    // Ajouter un délai de sécurité
    const submitButton = document.querySelector('.btn-secure');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-clock"></i> Veuillez patienter...';
    
    setTimeout(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-unlock"></i> Accéder aux Informations';
    }, 3000);
}

function createSession(userData, familyId) {
    // Créer une session avec expiration (24 heures)
    const now = new Date();
    const expiryTime = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // 24 heures
    
    currentSession = {
        familyId: familyId,
        userData: userData,
        loginTime: now,
        expiryTime: expiryTime
    };
    
    accessExpiryTime = expiryTime;
    
    // Sauvegarder dans le sessionStorage (temporaire)
    sessionStorage.setItem('reposceleste_session', JSON.stringify(currentSession));
    
    // Démarrer le timer d'expiration
    startExpiryTimer();
}

function displayUserInformation(userData, familyId) {
    // Informations du défunt
    document.getElementById('display-name').textContent = userData.name;
    document.getElementById('birth-date').textContent = userData.birthDate;
    document.getElementById('death-date').textContent = userData.deathDate;
    document.getElementById('display-family-id').textContent = familyId;
    
    // Localisation
    document.getElementById('display-tomb-number').textContent = userData.tombNumber;
    document.getElementById('section').textContent = userData.section;
    document.getElementById('gps-coordinates').textContent = userData.gpsCoordinates;
    
    // Autorisation
    const now = new Date();
    document.getElementById('authorization-date').textContent = now.toLocaleDateString('fr-FR');
    document.getElementById('validity-period').textContent = '24 heures';
    document.getElementById('authorized-by').textContent = userData.authorizedBy || 'Administration Repos Céleste';
    
    // Informations de visite
    document.getElementById('last-visit').textContent = userData.lastVisit || 'Première visite';
    document.getElementById('next-commemoration').textContent = userData.nextCommemoration;
    
    // Date d'expiration
    document.getElementById('access-expiry').textContent = accessExpiryTime.toLocaleDateString('fr-FR') + ' ' + accessExpiryTime.toLocaleTimeString('fr-FR');
}

function startExpiryTimer() {
    const updateTimer = () => {
        const now = new Date();
        const timeLeft = accessExpiryTime - now;
        
        if (timeLeft <= 0) {
            // Session expirée
            logout();
            showNotification('Votre session a expiré. Veuillez vous reconnecter.', 'warning');
            return;
        }
        
        // Afficher le temps restant (optionnel)
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        // Mettre à jour l'affichage (si nécessaire)
        // document.getElementById('time-remaining').textContent = `${hours}h ${minutes}m`;
    };
    
    // Mettre à jour toutes les minutes
    setInterval(updateTimer, 60000);
    updateTimer(); // Première mise à jour immédiate
}

function checkExistingSession() {
    const savedSession = sessionStorage.getItem('reposceleste_session');
    
    if (savedSession) {
        try {
            const session = JSON.parse(savedSession);
            const now = new Date();
            const expiryTime = new Date(session.expiryTime);
            
            if (now < expiryTime) {
                // Session encore valide
                currentSession = session;
                accessExpiryTime = expiryTime;
                displayUserInformation(session.userData, session.familyId);
                document.getElementById('login-section').style.display = 'none';
                document.getElementById('info-section').style.display = 'block';
                startExpiryTimer();
            } else {
                // Session expirée
                sessionStorage.removeItem('reposceleste_session');
            }
        } catch (error) {
            // Erreur de parsing, supprimer la session
            sessionStorage.removeItem('reposceleste_session');
        }
    }
}

function logout() {
    // Supprimer la session
    currentSession = null;
    accessExpiryTime = null;
    sessionStorage.removeItem('reposceleste_session');
    
    // Réafficher le formulaire de connexion
    document.getElementById('info-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    
    // Réinitialiser le formulaire
    document.getElementById('secure-login-form').reset();
    
    // Notification
    showNotification('Déconnexion réussie', 'info');
    
    // Scroll vers le formulaire
    document.getElementById('login-section').scrollIntoView({ behavior: 'smooth' });
    
    // Log de sécurité
    logSecurityEvent('USER_LOGOUT', 'User logged out');
}

function printInformation() {
    if (!currentSession) {
        showNotification('Aucune session active', 'error');
        return;
    }
    
    // Créer une version imprimable
    const printWindow = window.open('', '_blank');
    const printContent = generatePrintContent();
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    
    logSecurityEvent('INFORMATION_PRINTED', `Information printed for ID: ${currentSession.familyId}`);
}

function generatePrintContent() {
    const userData = currentSession.userData;
    const familyId = currentSession.familyId;
    const now = new Date();
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Autorisation d'Accès - Repos Céleste</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .info-section { margin-bottom: 20px; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .label { font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; color: #666; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>REPOS CÉLESTE</h1>
            <h2>Autorisation d'Accès Sécurisé</h2>
        </div>
        
        <div class="info-section">
            <h3>Informations du Défunt</h3>
            <div class="info-row"><span class="label">Nom:</span> <span>${userData.name}</span></div>
            <div class="info-row"><span class="label">ID Famille:</span> <span>${familyId}</span></div>
            <div class="info-row"><span class="label">Localisation:</span> <span>${userData.tombNumber}</span></div>
        </div>
        
        <div class="info-section">
            <h3>Autorisation</h3>
            <div class="info-row"><span class="label">Date d'émission:</span> <span>${now.toLocaleDateString('fr-FR')}</span></div>
            <div class="info-row"><span class="label">Valable jusqu'au:</span> <span>${accessExpiryTime.toLocaleDateString('fr-FR')}</span></div>
            <div class="info-row"><span class="label">Autorisé par:</span> <span>${userData.authorizedBy}</span></div>
        </div>
        
        <div class="footer">
            <p>Document généré le ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}</p>
            <p>Repos Céleste - Système d'Accès Sécurisé</p>
        </div>
    </body>
    </html>
    `;
}

function contactAdmin() {
    // Simuler un contact avec l'administration
    const message = `Bonjour,\n\nJe souhaite contacter l'administration concernant:\n\n` +
                   `Défunt: ${currentSession ? currentSession.userData.name : 'N/A'}\n` +
                   `ID Famille: ${currentSession ? currentSession.familyId : 'N/A'}\n\n` +
                   `Merci de me recontacter.\n\nCordialement`;
    
    const mailtoLink = `mailto:support@reposceleste.com?subject=Contact Administration - ${currentSession ? currentSession.familyId : 'Support'}&body=${encodeURIComponent(message)}`;
    
    window.location.href = mailtoLink;
    
    logSecurityEvent('ADMIN_CONTACT', `Admin contact requested for ID: ${currentSession ? currentSession.familyId : 'Unknown'}`);
}

function setupSecurityFeatures() {
    // Désactiver le clic droit
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    
    // Désactiver certaines touches
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || (e.ctrlKey && e.key === 'u') || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
            e.preventDefault();
        }
    });
    
    // Détection de changement d'onglet (pause de session)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && currentSession) {
            logSecurityEvent('TAB_HIDDEN', 'User switched away from tab');
        }
    });
}

function logSecurityEvent(eventType, description) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp: timestamp,
        type: eventType,
        description: description,
        userAgent: navigator.userAgent,
        ip: 'XXX.XXX.XXX.XXX' // En production, récupérer la vraie IP
    };
    
    // En production, envoyer à un serveur de logs sécurisé
    console.log('Security Log:', logEntry);
    
    // Sauvegarder localement pour débogage (à supprimer en production)
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('security_logs', JSON.stringify(logs));
}

function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Créer la nouvelle notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
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
                border-left: 4px solid #4a90e2;
            }
            .notification-success { border-left-color: #28a745; }
            .notification-error { border-left-color: #dc3545; }
            .notification-warning { border-left-color: #ffc107; }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notification-content i {
                font-size: 1.2rem;
            }
            .notification-success .notification-content i { color: #28a745; }
            .notification-error .notification-content i { color: #dc3545; }
            .notification-warning .notification-content i { color: #ffc107; }
            .notification-info .notification-content i { color: #4a90e2; }
            .notification-close {
                background: none;
                border: none;
                font-size: 1rem;
                cursor: pointer;
                color: #666;
                margin-left: 1rem;
            }
            .notification-close:hover { color: #333; }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
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

// Fonctions exposées globalement
window.logout = logout;
window.printInformation = printInformation;
window.contactAdmin = contactAdmin;
