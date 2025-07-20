# Repos Céleste - Site Web du Cimetière

Ce projet contient le site web officiel du cimetière "Repos Céleste".

## Fonctionnalités

### 🌐 Site Web Complet
- **Design moderne et responsive** - Compatible mobile, tablette et desktop
- **Navigation fluide** avec menu hamburger sur mobile
- **Animations élégantes** et effets de scroll
- **Accessibilité optimisée** avec support clavier et lecteurs d'écran

### 📱 Intégration WhatsApp
- **Lien direct vers le groupe WhatsApp officiel** pour les informations et annonces
- **Boutons d'appel à l'action** stratégiquement placés

### 🗺️ Localisation
- **Intégration Google Maps** pour localiser facilement le cimetière
- **Adresse du bureau** : Rond-point Signers
- **Informations de parking** et d'accès

### 🖼️ Galerie Photo
- **Galerie interactive** avec modal de visualisation
- **Navigation par flèches** et support clavier
- **Images optimisées** avec lazy loading
- **Système de placeholder** automatique si les images ne sont pas disponibles

### ⏰ Informations Horaires
- **Heures de visite** : 8h00 - 14h00
- **Bureau d'accueil** : 8h00 - 16h00 (Rond-point Signers)
- **Créneaux d'enterrement** :
  - 09h00 - 10h00
  - 10h30 - 11h30
  - 12h00 - 13h00
  - 13h30 - 14h30
  - 15h00 - 16h00

### 📞 Contact
- **Formulaire de contact** intégré avec validation
- **Informations de contact** complètes
- **Système de notifications** pour les retours utilisateur

### 🔐 Page d'Accès Sécurisé
- **Portail sécurisé** pour l'accès aux informations des défunts
- **Authentification multi-facteurs** (nom, ID famille, tombe, code)
- **Sessions temporaires** avec expiration automatique (24h)
- **Informations détaillées** : localisation, autorisations, visites
- **Fonctionnalités** : impression d'autorisation, contact administration
- **Sécurité renforcée** : logs, protection contre le débogage

## Structure du Projet

```
reposceleste/
├── index.html          # Page principale
├── acces-securise.html # Page d'accès sécurisé
├── styles.css          # Feuilles de style principales
├── secure-styles.css   # Styles pour la page sécurisée
├── script.js           # JavaScript interactif principal
├── secure-script.js    # JavaScript pour la sécurité
├── images/             # Dossier des images
│   ├── logo.jpg        # Logo du cimetière
│   ├── 1.jpg          # Photo 1 de la galerie
│   ├── 2.jpg          # Photo 2 de la galerie
│   ├── 3.jpg          # Photo 3 de la galerie
│   └── 4.jpg          # Photo 4 de la galerie
└── README.md           # Ce fichier
```

## Installation et Utilisation

1. **Cloner ou télécharger** le projet
2. **Personnaliser** les informations :
   - Remplacer le lien WhatsApp dans `index.html`
   - Ajouter vos vraies coordonnées Google Maps
   - Ajouter vos images dans le dossier `images/`
   - Modifier les informations de contact

3. **Ouvrir** `index.html` dans un navigateur web
4. **Accéder à la page sécurisée** via `acces-securise.html` (indépendante)

## Page d'Accès Sécurisé

### 🔑 Informations de Test
Pour tester la page sécurisée, utilisez ces données d'exemple :

**Famille 1 :**
- Nom du défunt: `Jean Martin`
- ID Famille: `FAM-2025-001`
- Numéro de tombe: `Section A - Rangée 12 - N°45`
- Code d'accès: `123456`

**Famille 2 :**
- Nom du défunt: `Sophie Dubois`
- ID Famille: `FAM-2025-002`
- Numéro de tombe: `Section B - Rangée 8 - N°23`
- Code d'accès: `789012`

### 🛡️ Fonctionnalités de Sécurité
- **Authentification multi-critères** obligatoire
- **Sessions temporaires** avec expiration automatique
- **Logs de sécurité** pour toutes les actions
- **Protection contre le débogage** (F12, clic droit désactivés)
- **Validation côté client** avec formatage automatique
- **Gestion des erreurs** avec délais de sécurité

## Technologies Utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Styles modernes avec Grid et Flexbox
- **JavaScript ES6+** - Interactivité et animations
- **Font Awesome** - Icônes
- **Google Fonts** - Typographie (Inter)

## Fonctionnalités Techniques

- ✅ **Responsive Design** - S'adapte à tous les écrans
- ✅ **Performance optimisée** - Lazy loading des images
- ✅ **SEO friendly** - Structure HTML sémantique
- ✅ **Accessibilité** - Support clavier et lecteurs d'écran
- ✅ **Navigation fluide** - Smooth scroll et animations
- ✅ **Fallback des images** - Placeholders automatiques
- ✅ **Validation des formulaires** - Vérification côté client

## Support Navigateurs

- ✅ Chrome/Edge (modernes)
- ✅ Firefox (moderne)
- ✅ Safari (moderne)
- ✅ Navigateurs mobiles
