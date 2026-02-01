document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Initial Load & Intro Animation ---
    const introOverlay = document.getElementById('intro-overlay');
    const introText = document.querySelector('.glitch');

    if (introOverlay) {
        // Disable scroll initially
        document.body.style.overflow = 'hidden';

        // 1. Fade out text first (1s)
        setTimeout(() => {
            if (introText) introText.classList.add('fade-out');
        }, 1000);

        // 2. Fade out overlay & enable scroll (1.5s)
        setTimeout(() => {
            introOverlay.classList.add('fade-out');
            document.body.style.overflow = '';

            // Trigger the rest of the site animations
            document.body.classList.add('is-loaded');

            // Remove from DOM after transition
            setTimeout(() => {
                introOverlay.remove();
            }, 1000);
        }, 1500);
    } else {
        // Fallback if no intro found
        window.addEventListener('load', () => {
            document.body.classList.add('is-loaded');
        });
    }

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

});
