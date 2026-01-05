/*!
* i18n Module for Portfolio Website
* Manages language switching and translations
*/

class I18n {
    constructor() {
        this.currentLanguage = 'ru';
        this.translations = {};
        this.supportedLanguages = ['ru', 'en'];
    }

    // Initialize the i18n system
    async init() {
        // Determine which language to use
        const lang = this.determineLanguage();
        await this.loadTranslations(lang);
        this.applyTranslations();
        this.updateLanguageButton();
        this.setupLanguageSwitcher();
    }

    // Determine language based on URL param, localStorage, or browser language
    determineLanguage() {
        // 1. Check URL parameter (?lang=ru or ?lang=en)
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.supportedLanguages.includes(urlLang)) {
            this.currentLanguage = urlLang;
            localStorage.setItem('preferredLanguage', urlLang);
            return urlLang;
        }

        // 2. Check localStorage for saved preference
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLanguage = savedLang;
            return savedLang;
        }

        // 3. Detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.toLowerCase().split('-')[0];

        if (langCode === 'ru') {
            this.currentLanguage = 'ru';
            return 'ru';
        } else {
            // Default to English for all other languages
            this.currentLanguage = 'en';
            return 'en';
        }
    }

    // Load translations from JSON file
    async loadTranslations(lang) {
        try {
            // Add cache buster for development
            const cacheBuster = new Date().getTime();
            const response = await fetch(`locales/${lang}.json?v=${cacheBuster}`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${lang}`);
            }
            this.translations = await response.json();
            this.currentLanguage = lang;
            console.log(`Loaded translations for ${lang}:`, this.translations);
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to Russian if loading fails
            if (lang !== 'ru') {
                await this.loadTranslations('ru');
            }
        }
    }

    // Get translation by key path (e.g., 'header.title')
    t(keyPath) {
        const keys = keyPath.split('.');
        let value = this.translations;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                console.warn(`Translation key not found: ${keyPath}`);
                return keyPath;
            }
        }
        
        return value;
    }

    // Apply translations to all elements with data-i18n attribute
    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            // Check if element has data-i18n-attr for attribute translation
            const attr = element.getAttribute('data-i18n-attr');
            if (attr) {
                element.setAttribute(attr, translation);
            } else {
                // Check if the translation contains HTML
                if (translation.includes('<br>') || translation.includes('<strong>')) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Apply translations to href attributes (data-i18n-href)
        const hrefElements = document.querySelectorAll('[data-i18n-href]');
        hrefElements.forEach(element => {
            const key = element.getAttribute('data-i18n-href');
            const translation = this.t(key);
            element.setAttribute('href', translation);
        });

        // Update page language attribute
        document.documentElement.lang = this.currentLanguage === 'ru' ? 'ru' : 'en';

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = this.currentLanguage === 'ru'
                ? 'Портфолио Алекса Денисова, разработчика на Unity и C#.'
                : 'Portfolio of Alex Denisov, Unity and C# Developer.';
        }

        // Update page title
        document.title = this.currentLanguage === 'ru'
            ? 'Портфолио Алекса Денисова'
            : 'Alex Denisov Portfolio';
    }

    // Switch to a different language
    async switchLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.error(`Unsupported language: ${lang}`);
            return;
        }

        if (lang === this.currentLanguage) {
            return; // Already using this language
        }

        await this.loadTranslations(lang);
        this.applyTranslations();
        this.updateLanguageButton();

        // Save preference to localStorage
        localStorage.setItem('preferredLanguage', lang);

        // Update URL parameter without reloading the page
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.pushState({}, '', url);
    }

    // Update language button text
    updateLanguageButton() {
        const langButton = document.getElementById('language-switcher');
        if (langButton) {
            langButton.textContent = this.currentLanguage === 'ru' ? 'EN' : 'RU';
            langButton.setAttribute('data-current-lang', this.currentLanguage);
        }
    }

    // Setup language switcher button click handler
    setupLanguageSwitcher() {
        const langButton = document.getElementById('language-switcher');
        if (langButton) {
            langButton.addEventListener('click', (e) => {
                e.preventDefault();
                const newLang = this.currentLanguage === 'ru' ? 'en' : 'ru';
                this.switchLanguage(newLang);
            });
        }
    }
}

// Create global instance
window.i18n = new I18n();

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.i18n.init());
} else {
    window.i18n.init();
}
