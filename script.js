document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // BÖLÜM 1: MOBİL NAVBAR VE AKORDİYON MENÜ
    // ======================================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('is-active');
            mobileMenu.classList.toggle('is-open');
        });
    }

    const mobileMenuTriggers = document.querySelectorAll('.mobile-menu__trigger');
    mobileMenuTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const submenu = trigger.nextElementSibling;
            trigger.classList.toggle('submenu-open');
            if (submenu.style.maxHeight) {
                submenu.style.maxHeight = null;
            } else {
                submenu.style.maxHeight = submenu.scrollHeight + 'px';
            }
        });
    });

    // ======================================================
    // BÖLÜM 2: ANA HERO SLIDER (NOKTALI NAVİGASYONLU)
    // ======================================================
    const heroSliderTrack = document.getElementById('hero-slider-track');
    if (heroSliderTrack) {
        const prevBtn = document.getElementById('hero-slider-prev');
        const nextBtn = document.getElementById('hero-slider-next');
        const paginationContainer = document.getElementById('hero-slider-pagination');
        const slides = Array.from(heroSliderTrack.children);
        const slideCount = slides.length;
        let currentIndex = 0;

        if (slideCount > 0) {
            // Pagination noktalarını oluştur
            for (let i = 0; i < slideCount; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Slayt ${i + 1}'e git`);
                dot.addEventListener('click', () => goToSlide(i));
                paginationContainer.appendChild(dot);
            }
            const dots = Array.from(paginationContainer.children);

            function goToSlide(index) {
                currentIndex = index;
                const slideWidth = slides[0].clientWidth;
                heroSliderTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
                updatePagination();
            }

            function updatePagination() {
                dots.forEach((dot, index) => {
                    dot.classList.toggle('is-active', index === currentIndex);
                });
            }
            
            nextBtn.addEventListener('click', () => {
                const nextIndex = (currentIndex + 1) % slideCount;
                goToSlide(nextIndex);
            });

            prevBtn.addEventListener('click', () => {
                const prevIndex = (currentIndex - 1 + slideCount) % slideCount;
                goToSlide(prevIndex);
            });

            new ResizeObserver(() => {
                goToSlide(currentIndex);
            }).observe(heroSliderTrack);

            goToSlide(0); // Başlangıç durumu
        }
    }
    
    // ======================================================
    // BÖLÜM 3: GÜNCEL HABERLER (SEKME MANTIĞI)
    // ======================================================
    const tabsContainer = document.querySelector('.news-tabs');
    const contentPanels = document.querySelectorAll('.news-content__panel');
    
    if (tabsContainer && contentPanels.length > 0) {
        tabsContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const targetTab = e.target.dataset.tab;

                tabsContainer.querySelector('.is-active').classList.remove('is-active');
                e.target.classList.add('is-active');

                contentPanels.forEach(panel => {
                    panel.classList.toggle('is-active', panel.dataset.content === targetTab);
                });
            }
        });
    }
});