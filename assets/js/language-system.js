document.addEventListener('DOMContentLoaded', () => {
    // 1. Language State Management
    const defaultLang = 'en';
    let currentLang = localStorage.getItem('site-lang') || defaultLang;

    // 2. Helper: Recursive Text Node Finder
    function getTextNodes(node) {
        let textNodes = [];
        if (node.nodeType === 3) { // Text node
            // Filter out empty/whitespace-only nodes to save performance
            if (node.textContent.trim().length > 0) {
                textNodes.push(node);
            }
        } else {
            for (let child of node.childNodes) {
                textNodes = textNodes.concat(getTextNodes(child));
            }
        }
        return textNodes;
    }

    // 3. Helper: Scramble Animation
    function animateScramble(textNode) {
        const finalText = textNode.textContent;
        // User requested only letters to reduce visual noise and jitter
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let iterations = 0;

        // Clear any existing interval if we attached one (not strictly tracking here, 
        // but assuming fast switches might just overwrite the node anyway)

        const interval = setInterval(() => {
            textNode.textContent = finalText
                .split("")
                .map((letter, index) => {
                    // Respect spaces to preserve word shapes and reduce jitter
                    if (letter === ' ') return ' ';

                    if (index < iterations) {
                        return finalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");

            if (iterations >= finalText.length) {
                clearInterval(interval);
                textNode.textContent = finalText; // Ensure clean finish
            }

            iterations += 3; // Speed of reveal (chars per frame) - Faster as requested
        }, 30); // Frame duration (ms)
    }

    // 4. Function to Apply Translations with Animation
    function applyTranslations(lang) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                const newValue = translations[lang][key];

                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = newValue;
                } else {
                    // 1. Set the new HTML structure immediately
                    // This is necessary to have the correct DOM nodes (like <strong>) to animate
                    element.innerHTML = newValue;

                    // 2. Find all text nodes in the new structure
                    const textNodes = getTextNodes(element);

                    // 3. Animate each text node
                    textNodes.forEach(node => {
                        animateScramble(node);
                    });
                }
            }
        });

        updateToggleUI(lang);
    }

    // 5. Update Toggle Button UI (Visual Feedback)
    function updateToggleUI(lang) {
        const toggleBtn = document.getElementById('lang-toggle-btn');
        if (toggleBtn) {
            if (lang === 'hu') {
                toggleBtn.innerHTML = '<span class="opacity-50">EN</span> / <span class="fw-bold">HU</span>';
            } else {
                toggleBtn.innerHTML = '<span class="fw-bold">EN</span> / <span class="opacity-50">HU</span>';
            }
        }
    }

    // 6. Global Toggle Function
    window.toggleLanguage = function () {
        currentLang = currentLang === 'en' ? 'hu' : 'en';
        localStorage.setItem('site-lang', currentLang);
        applyTranslations(currentLang);
        document.documentElement.lang = currentLang;
    };

    // 7. Initialize (No animation on first load to prevent layout shift/distraction)
    function initialLoad(lang) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.innerHTML = translations[lang][key];
                }
            }
        });
        updateToggleUI(lang);
    }

    initialLoad(currentLang);
    document.documentElement.lang = currentLang;

    // 8. Bind Event Listener
    const toggleBtn = document.getElementById('lang-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.toggleLanguage();
        });
    }
});
