document.addEventListener('DOMContentLoaded', () => {
    // 1. Language State Management
    const defaultLang = 'en';
    let currentLang = localStorage.getItem('site-lang') || defaultLang;

    // 2. Function to Apply Translations
    function applyTranslations(lang) {
        // Toggle plain text and HTML content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                // If the translation contains HTML tags, use innerHTML, otherwise textContent
                // To be safe and support formatting tags like <strong>, we use innerHTML.
                // But generally check if it's an input/placeholder.
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.innerHTML = translations[lang][key];
                }
            }
        });

        // Update Toggle UI state if needed
        updateToggleUI(lang);
    }

    // 3. Update Toggle Button UI (Visual Feedback)
    function updateToggleUI(lang) {
        const toggleBtn = document.getElementById('lang-toggle-btn');
        if (toggleBtn) {
            // Option A: Text Toggle "EN / HU" - highlight active
            if (lang === 'hu') {
                toggleBtn.innerHTML = '<span class="opacity-50">EN</span> / <span class="fw-bold">HU</span>';
            } else {
                toggleBtn.innerHTML = '<span class="fw-bold">EN</span> / <span class="opacity-50">HU</span>';
            }
        }
    }

    // 4. Global Toggle Function
    window.toggleLanguage = function () {
        // Switch Logic
        currentLang = currentLang === 'en' ? 'hu' : 'en';

        // Save Preference
        localStorage.setItem('site-lang', currentLang);

        // Apply
        applyTranslations(currentLang);
        document.documentElement.lang = currentLang;
    };

    // 5. Initialize
    applyTranslations(currentLang);
    document.documentElement.lang = currentLang;

    // 6. Bind Event Listener
    const toggleBtn = document.getElementById('lang-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.toggleLanguage();
        });
    }
});
