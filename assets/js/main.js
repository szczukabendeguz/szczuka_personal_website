document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Page Initialization ---
    document.body.classList.add('is-loaded');

    // --- 1. Soft Scroll Reveal Engine ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // --- 2. Advanced Parallax (Depth Effect) ---
    const orbs = document.querySelectorAll('.glow-orb');

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        requestAnimationFrame(() => {
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 15;
                orb.style.transform = `translate(${x * speed * -1}px, ${y * speed * -1}px)`;
            });
        });
    });


    // --- 3. Magnetic Buttons (Sticky Cursor Effect) ---
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const strength = 0.4;

            btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });


    // --- 4. Smooth Anchor Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.matches('[data-project]')) {
                return;
            }

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

    // --- 4.1 Project Menu Selection ---
    const projectMenu = document.querySelector('[data-project-menu]');
    const projectPanels = document.querySelector('[data-project-panels]');
    const mobileNav = document.getElementById('mobileProjectNav');

    if (projectPanels) {
        const menuItems = projectMenu ? Array.from(projectMenu.querySelectorAll('.project-menu-item')) : [];
        const mobilePills = mobileNav ? Array.from(mobileNav.querySelectorAll('.mobile-project-pill')) : [];
        const panels = Array.from(projectPanels.querySelectorAll('.project-detail-card'));

        const setActiveProject = (projectId, updateHash = true) => {
            const nextPanel = panels.find(panel => panel.dataset.project === projectId);
            if (!nextPanel) return;

            // Update Desktop Menu
            if (menuItems.length > 0) {
                menuItems.forEach(item => item.classList.remove('is-active'));
                const nextMenuItem = menuItems.find(item => item.dataset.project === projectId);
                if (nextMenuItem) nextMenuItem.classList.add('is-active');
            }

            // Update Mobile Pills (Grid)
            if (mobilePills.length > 0) {
                mobilePills.forEach(pill => pill.classList.remove('is-active'));
                const nextPill = mobilePills.find(pill => pill.dataset.project === projectId);
                if (nextPill) nextPill.classList.add('is-active');
            }

            // Update Panels
            panels.forEach(panel => panel.classList.remove('is-active'));
            nextPanel.classList.add('is-active', 'is-visible');

            if (updateHash) {
                history.pushState(null, '', `#${projectId}`);
            }
        };

        const initialHash = window.location.hash.replace('#', '');
        const hasProject = (id) => panels.some(p => p.dataset.project === id);
        const initialProject = hasProject(initialHash) ? initialHash : (panels[0]?.dataset.project);

        if (initialProject) {
            setActiveProject(initialProject, false);
        }

        // Desktop Menu Click
        if (projectMenu) {
            projectMenu.addEventListener('click', (event) => {
                const targetItem = event.target.closest('.project-menu-item');
                if (!targetItem) return;
                event.preventDefault();
                const projectId = targetItem.dataset.project;
                if (projectId) setActiveProject(projectId, true);
            });
        }

        // Mobile Pills Click
        if (mobileNav) {
            mobileNav.addEventListener('click', (e) => {
                const pill = e.target.closest('.mobile-project-pill');
                if (!pill) return;
                
                const projectId = pill.dataset.project;
                setActiveProject(projectId, true);

                // Scroll to the top of the project-menu-card (where headers are)
                const menuCard = mobileNav.closest('.project-menu-card');
                if (menuCard) {
                    const rect = menuCard.getBoundingClientRect();
                    const absoluteTop = window.pageYOffset + rect.top;
                    const targetPosition = absoluteTop - 100;

                    // Only scroll down if the target is below our current position
                    if (window.pageYOffset < targetPosition) {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        }

        window.addEventListener('hashchange', () => {
            const nextHash = window.location.hash.replace('#', '');
            if (nextHash && hasProject(nextHash)) {
                setActiveProject(nextHash, false);
            }
        });
    }

    // --- 5. Toggle Switch Interaction ---
    const toggleSwitch = document.querySelector('.toggle-switch');

    if (toggleSwitch) {
        let isHovering = false;
        let isInteractive = false;
        let autoLoop;

        // 1. Auto-Toggle Interval (Infinite Loop driven by JS)
        // Uses the same CSS transitions as manual click for consistent physics
        function startAutoLoop() {
            autoLoop = setInterval(() => {
                if (!isHovering && !isInteractive) {
                    toggleSwitch.classList.toggle('toggled-on');
                }
            }, 2500); // 2.5s interval between toggles
        }

        startAutoLoop();

        // 2. Detect Hover -> Stop Auto Loop
        toggleSwitch.addEventListener('mouseenter', () => {
            isHovering = true;
            clearInterval(autoLoop); // Stop the auto-demo immediately
        });

        // 3. Manual Toggle Logic
        // 3. Manual Toggle & Drag Logic
        const toggleBall = toggleSwitch.querySelector('.toggle-ball');
        let isDragging = false;
        let startX = 0;
        let currentX = 0;
        let initialTranslate = 0;
        let hasMoved = false;
        let preventNextClick = false;
        const maxTranslate = 70; // 0 to 70px range

        function getClientX(e) {
            return e.touches ? e.touches[0].clientX : e.clientX;
        }

        function handleDragStart(e) {
            // Allow left click or touch
            if (e.type === 'mousedown' && e.button !== 0) return;

            isDragging = true;
            hasMoved = false;
            startX = getClientX(e);

            clearInterval(autoLoop); // Stop auto demo

            if (!isInteractive) {
                toggleSwitch.classList.add('user-interactive');
                isInteractive = true;
            }

            // Determine initial visual position
            const computedStyle = window.getComputedStyle(toggleBall);
            const matrix = new WebKitCSSMatrix(computedStyle.transform);
            initialTranslate = matrix.m41; // Get current visual X translation

            // Disable transition for direct 1:1 movement
            toggleBall.style.transition = 'none';
        }

        function handleDragMove(e) {
            if (!isDragging) return;

            const x = getClientX(e);
            if (Math.abs(x - startX) > 5) hasMoved = true; // Threshold for "drag" vs "click"

            if (e.type === 'touchmove') e.preventDefault(); // Prevent scroll

            const wrapper = toggleSwitch.closest('.shape-toggle');
            const scale = wrapper ? (parseFloat(getComputedStyle(wrapper).getPropertyValue('--scale-factor')) || 1) : 1;

            const deltaX = (x - startX) / scale;
            let newX = initialTranslate + deltaX;

            // Clamp
            if (newX < 0) newX = 0;
            if (newX > maxTranslate) newX = maxTranslate;

            currentX = newX;

            // Apply specific transform to ball
            const rotation = (newX / maxTranslate) * 360;
            toggleBall.style.transform = `translateY(-50%) translateX(${newX}px) rotate(${rotation}deg)`;

            // Update glow effect position
            toggleSwitch.style.setProperty('--x', `${newX + 10}px`);
        }

        function handleDragEnd(e) {
            if (!isDragging) return;
            isDragging = false;

            // Re-enable transition for the snap animation
            toggleBall.style.transition = '';

            if (hasMoved) {
                // It was a drag. Snap based on final position.
                if (currentX > (maxTranslate / 2)) {
                    toggleSwitch.classList.add('toggled-on');
                } else {
                    toggleSwitch.classList.remove('toggled-on');
                }
                preventNextClick = true;
                setTimeout(() => preventNextClick = false, 100);
            }

            // Clear inline styles so CSS class takes priority
            toggleBall.style.transform = '';
        }

        // Click Listener on entire switch
        toggleSwitch.addEventListener('click', (e) => {
            e.preventDefault();
            clearInterval(autoLoop);

            if (!isInteractive) {
                toggleSwitch.classList.add('user-interactive');
                isInteractive = true;
            }

            if (preventNextClick) {
                preventNextClick = false;
                return;
            }

            toggleSwitch.classList.toggle('toggled-on');
        });

        // Attach listeners
        toggleBall.addEventListener('mousedown', handleDragStart);
        toggleBall.addEventListener('touchstart', handleDragStart, { passive: false });

        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('touchmove', handleDragMove, { passive: false });

        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchend', handleDragEnd);

        // 4. Dynamic Glow Effect (Mouse Tracking)
        toggleSwitch.addEventListener('mousemove', (e) => {
            if (isDragging) return; // Prevent conflict with drag logic

            const rect = toggleSwitch.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            toggleSwitch.style.setProperty('--x', `${x}px`);
            toggleSwitch.style.setProperty('--y', `${y}px`);
        });

        toggleSwitch.addEventListener('mouseleave', () => {
            // Optional: reset or fade out logic is handled by CSS hover state
        });
    }

    // --- 6. Responsive Menu Handling (Smooth Transitions) ---
    const navbarCollapse = document.getElementById('navbarNav');

    // Custom Animation Classes for Mobile Menu
    if (navbarCollapse) {
        navbarCollapse.addEventListener('show.bs.collapse', () => {
            navbarCollapse.classList.add('menu-opening');
            navbarCollapse.classList.remove('menu-closing');
        });

        navbarCollapse.addEventListener('hide.bs.collapse', () => {
            navbarCollapse.classList.add('menu-closing');
            navbarCollapse.classList.remove('menu-opening');
        });

        navbarCollapse.addEventListener('hidden.bs.collapse', () => {
            navbarCollapse.classList.remove('menu-closing');
        });

        navbarCollapse.addEventListener('shown.bs.collapse', () => {
            navbarCollapse.classList.remove('menu-opening');
        });
    }
    let isDesktop = window.innerWidth >= 992;
    let resizeTimer;

    window.addEventListener('resize', () => {
        const currentIsDesktop = window.innerWidth >= 992;

        if (currentIsDesktop !== isDesktop) {
            // State changed (Mobile <-> Desktop)
            isDesktop = currentIsDesktop;

            // 1. Close mobile menu if open (Clean State)
            if (navbarCollapse.classList.contains('show')) {
                // Use Bootstrap API if available, else manual class removal
                if (typeof bootstrap !== 'undefined') {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
                    bsCollapse.hide();
                } else {
                    navbarCollapse.classList.remove('show');
                }
            }

            // 2. Trigger CSS Animations
            document.body.classList.add('menu-switching');

            // Remove class after animation finishes
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.body.classList.remove('menu-switching');
            }, 500);
        }
    });

    // --- 7. Global Tech Stack Cloud ---
    function initGlobalTechStack() {
        const cloudContainer = document.getElementById('global-tech-stack');
        if (!cloudContainer) return;

        // Get current language from localStorage or default
        const lang = localStorage.getItem('site-lang') || 'en';
        
        // Safety check if translations are loaded
        if (typeof translations === 'undefined' || !translations[lang]) return;

        const projectTechKeys = Object.keys(translations[lang]).filter(key => key.startsWith('work_project_') && key.endsWith('_tech'));
        
        const allTechHtml = projectTechKeys.map(key => translations[lang][key]).join('');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = allTechHtml;
        
        const tags = Array.from(tempDiv.querySelectorAll('.tech-tag'));
        const techFrequencies = {};
        tags.forEach(tag => {
            const name = tag.textContent.trim();
            techFrequencies[name] = (techFrequencies[name] || 0) + 1;
        });

        const uniqueTech = Object.keys(techFrequencies);

        // Sort alphabetically
        uniqueTech.sort((a, b) => a.localeCompare(b));

        cloudContainer.innerHTML = uniqueTech.map(tech => {
            const freq = techFrequencies[tech] || 0;
            // Highlight if frequency is 3 or more, or if it's "Jira"
            const isHighlighted = freq >= 3 || tech.toLowerCase() === 'jira';
            const highlightClass = isHighlighted ? 'is-highlighted' : '';
            
            return `
                <span class="tech-tag global-tech-tag ${highlightClass}" data-tech="${tech}">
                    ${tech}
                </span>
            `;
        }).join('');

        cloudContainer.addEventListener('click', (e) => {
            const tag = e.target.closest('.global-tech-tag');
            if (!tag) return;
            
            const techName = tag.dataset.tech;
            
            // 1. Highlight the active tag in the cloud
            cloudContainer.querySelectorAll('.global-tech-tag').forEach(t => t.classList.remove('is-active'));
            tag.classList.add('is-active');

            // 2. Clear previous indicators from the project menu
            document.querySelectorAll('.project-menu-item, .mobile-project-pill').forEach(item => {
                item.classList.remove('has-tech');
            });

            // 3. Find ALL projects that have this tech
            // Mapping from translation key number to slug-based project ID
            const projectSlugMap = {
                '1': 'damocles',
                '2': 'bosch-team',
                '3': 'codelingo',
                '4': 'nullpont-workshop',
                '5': 'valasztas-2026',
                '6': 'esp32-tuner',
                '7': 'nullpont-booking',
                '8': 'bikestore',
                '9': 'carrental',
                '10': 'arduino-maze'
            };

            const matchedProjectIds = projectTechKeys.filter(key => {
                const html = translations[lang][key];
                const searchDiv = document.createElement('div');
                searchDiv.innerHTML = html;
                return Array.from(searchDiv.querySelectorAll('.tech-tag')).some(t => t.textContent.trim() === techName);
            }).map(key => {
                const num = key.replace('work_project_', '').replace('_tech', '');
                return projectSlugMap[num] || num;
            });

            // 4. Mark projects in the menu
            matchedProjectIds.forEach(id => {
                const projectId = id;
                const menuItems = document.querySelectorAll(`[data-project="${projectId}"]`);
                menuItems.forEach(item => item.classList.add('has-tech'));
            });

            // 5. Navigate to the first project that has this tech
            const firstProjectId = matchedProjectIds[0];
            if (firstProjectId) {
                const projectId = `project-${firstProjectId}`;
                
                // Find and click the menu item
                const menuLink = document.querySelector(`.project-menu-item[data-project="${projectId}"]`) || 
                                 document.querySelector(`.mobile-project-pill[data-project="${projectId}"]`);
                
                if (menuLink) {
                    menuLink.click();
                    
                    // Smoothly scroll to the work section layout
                    const projectsLayout = document.querySelector('.work-projects-layout');
                    if (projectsLayout) {
                        const offset = 120; // Sticky header offset
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = projectsLayout.getBoundingClientRect().top;
                        const elementPosition = elementRect - bodyRect;
                        const targetPosition = elementPosition - offset;

                        // Only scroll down if the target is below our current position
                        if (window.pageYOffset < targetPosition) {
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            }
        });
    }

    // Initialize the cloud
    initGlobalTechStack();

    // Re-initialize on language change
    // We can listen for the toggle button or just override window.toggleLanguage
    const originalToggleLanguage = window.toggleLanguage;
    if (originalToggleLanguage) {
        window.toggleLanguage = function() {
            originalToggleLanguage();
            // Wait a tiny bit for translations to apply if needed, 
            // though translations.js is synchronous
            initGlobalTechStack();
        };
    }

});
