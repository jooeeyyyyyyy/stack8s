/* =====================================================
   STACK8S - SIMPLE WORKING SLIDERS
   ===================================================== */

// =====================================================
// HEADER
// =====================================================

function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.setAttribute('data-hidden', 'true');
    } else {
      header.setAttribute('data-hidden', 'false');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateHeader();
}

// =====================================================
// MOBILE MENU TOGGLE
// =====================================================

function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuClose = document.querySelector('.mobile-menu__close');
  const menuLinks = document.querySelectorAll('.mobile-menu__link');
  const menuCTA = document.querySelector('.mobile-menu__cta');

  if (!menuToggle || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Open menu
  menuToggle.addEventListener('click', openMenu);

  // Close button
  menuClose?.addEventListener('click', closeMenu);

  // Close when clicking a link
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close when clicking CTA
  menuCTA?.addEventListener('click', closeMenu);

  // Close when clicking background
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMenu();
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  console.log('✓ Mobile Menu Ready');
}

// =====================================================
// USE CASES CAROUSEL
// 4 cards, show 1 at a time, 4 dots
// =====================================================

function initUseCasesCarousel() {
  const track = document.getElementById('use-cases-track');
  const prevBtn = document.querySelector('.use-cases .slider__arrow--prev');
  const nextBtn = document.querySelector('.use-cases .slider__arrow--next');
  const dotsContainer = document.getElementById('use-cases-dots');

  if (!track) return;

  const cards = Array.from(track.children);
  const totalCards = cards.length;
  let currentIndex = 0;

  // Create dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider__dot';
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateCards() {
    // Crossfade cards using data-active
    cards.forEach((card, index) => {
      const isActive = index === currentIndex;
      card.setAttribute('data-active', isActive);
    });
    
    // Update dots
    const dots = dotsContainer?.children || [];
    Array.from(dots).forEach((dot, i) => {
      dot.classList.toggle('slider__dot--active', i === currentIndex);
    });
  }

  function goTo(index) {
    currentIndex = index;
    updateCards();
  }

  function next() {
    currentIndex = (currentIndex + 1) % totalCards;
    updateCards();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateCards();
  }

  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  updateCards();
  console.log('✓ Use Cases: 4 cards with crossfade, 4 dots');
}

// =====================================================
// PRICING SLIDER
// 4 cards, show 2 at a time, 3 positions, 3 dots
// =====================================================

function initPricingSlider() {
  const track = document.getElementById('pricing-track');
  const prevBtn = document.querySelector('.pricing .slider__arrow--prev');
  const nextBtn = document.querySelector('.pricing .slider__arrow--next');
  const dotsContainer = document.getElementById('pricing-dots');

  if (!track) return;

  const cards = Array.from(track.children);
  const totalCards = cards.length; // 4
  const cardsVisible = 2;
  const totalPositions = totalCards - cardsVisible + 1; // 4 - 2 + 1 = 3
  let currentPosition = 0;

  // Create dots (one per position)
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPositions; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider__dot';
      dot.setAttribute('aria-label', `Position ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateSlider() {
    // Calculate offset: each position moves by one card width + half gap
    const cardWidth = cards[0]?.offsetWidth || 0;
    const gap = 40; // 2.5rem = 40px
    const moveDistance = cardWidth + gap;
    const offset = -currentPosition * moveDistance;
    
    track.style.transform = `translateX(${offset}px)`;
    
    // Update dots
    const dots = dotsContainer?.children || [];
    Array.from(dots).forEach((dot, i) => {
      dot.classList.toggle('slider__dot--active', i === currentPosition);
    });
  }

  function goTo(position) {
    currentPosition = Math.max(0, Math.min(position, totalPositions - 1));
    updateSlider();
  }

  function next() {
    if (currentPosition < totalPositions - 1) {
      goTo(currentPosition + 1);
    }
  }

  function prev() {
    if (currentPosition > 0) {
      goTo(currentPosition - 1);
    }
  }

  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  // Recalculate on resize
  window.addEventListener('resize', updateSlider);

  // Initialize after layout
  setTimeout(updateSlider, 100);
  console.log('✓ Pricing: 4 cards, 2 visible, 3 positions, 3 dots');
}

// =====================================================
// PLATFORM DIAGRAM
// =====================================================

function initPlatformDiagram() {
  const tabs = document.querySelectorAll('.platform-diagram__tab');
  const views = document.querySelectorAll('.diagram-view');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetView = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('platform-diagram__tab--active'));
      tab.classList.add('platform-diagram__tab--active');

      views.forEach(view => {
        view.classList.toggle('diagram-view--active', view.dataset.view === targetView);
      });
    });
  });
}

// =====================================================
// SMOOTH SCROLL
// =====================================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
}

// =====================================================
// BUTTONS
// =====================================================

function initButtons() {
  // All "Book a Demo" buttons
  document.querySelectorAll('.btn-primary').forEach(button => {
    if (button.textContent.includes('Book') || button.textContent.includes('Demo')) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('📅 Book a Demo clicked');
        
        // Opens typeform :D
        alert('Opens typeform :D');
      });
    }
  });
}

// =====================================================
// INIT
// =====================================================

// =====================================================
// CLOUD PROVIDERS CAROUSEL
// Shows 3 cards at a time, slides by 1
// =====================================================

function initProvidersCarousel() {
  const track = document.getElementById('providers-track');
  const prevBtn = document.querySelector('.cloud-integrations .slider__arrow--prev');
  const nextBtn = document.querySelector('.cloud-integrations .slider__arrow--next');
  const dotsContainer = document.getElementById('providers-dots');

  if (!track) return;

  const cards = Array.from(track.children);
  const totalCards = cards.length; // 4
  const cardsVisible = 3; // Show 3 at a time
  const totalPositions = totalCards - cardsVisible + 1; // 4 - 3 + 1 = 2
  let currentPosition = 0;

  // Create dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalPositions; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider__dot';
      dot.setAttribute('aria-label', `Position ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateSlider() {
    const cardWidth = cards[0]?.offsetWidth || 0;
    const gap = 32; // 2rem = 32px
    const moveDistance = cardWidth + gap;
    const offset = -currentPosition * moveDistance;
    
    track.style.transform = `translateX(${offset}px)`;
    
    const dots = dotsContainer?.children || [];
    Array.from(dots).forEach((dot, i) => {
      dot.classList.toggle('slider__dot--active', i === currentPosition);
    });
  }

  function goTo(position) {
    currentPosition = Math.max(0, Math.min(position, totalPositions - 1));
    updateSlider();
  }

  function next() {
    if (currentPosition < totalPositions - 1) {
      goTo(currentPosition + 1);
    }
  }

  function prev() {
    if (currentPosition > 0) {
      goTo(currentPosition - 1);
    }
  }

  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  window.addEventListener('resize', updateSlider);
  setTimeout(updateSlider, 100);
  
  console.log('✓ Providers: 4 cards, 3 visible, 2 positions');
}

// =====================================================
// STEPS VISUAL CAROUSEL
// Right side: slides visual cards
// Left side: swaps text content
// =====================================================

function initStepsCarousel() {
  const track = document.getElementById('steps-track');
  const textContents = document.querySelectorAll('.steps-carousel__text-content');
  const prevBtn = document.querySelector('.how-it-works .slider__arrow--prev');
  const nextBtn = document.querySelector('.how-it-works .slider__arrow--next');
  const dotsContainer = document.getElementById('steps-dots');

  if (!track) return;

  const slides = Array.from(track.children);
  const totalSlides = slides.length;
  let currentIndex = 0;

  // Create dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider__dot';
      dot.setAttribute('aria-label', `Step ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateContent() {
    // Fade visual cards (right side)
    slides.forEach((slide, index) => {
      const isActive = index === currentIndex;
      slide.setAttribute('data-active', isActive);
    });
    
    // Swap text content (left side)
    textContents.forEach((content, index) => {
      const isActive = index === currentIndex;
      content.setAttribute('data-active', isActive);
    });
    
    // Update dots
    const dots = dotsContainer?.children || [];
    Array.from(dots).forEach((dot, i) => {
      dot.classList.toggle('slider__dot--active', i === currentIndex);
    });
  }

  function goTo(index) {
    currentIndex = index;
    updateContent();
  }

  function next() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateContent();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateContent();
  }

  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  updateContent();
  console.log(`✓ Steps Carousel: ${totalSlides} steps - text swaps, cards slide`);
}

// =====================================================
// BENEFITS MAP - INTERACTIVE STAGES
// =====================================================

function initBenefitsMap() {
  const textContents = document.querySelectorAll('.benefits-text-content');
  const prevBtn = document.querySelector('.benefits-map .slider__arrow--prev');
  const nextBtn = document.querySelector('.benefits-map .slider__arrow--next');
  const dotsContainer = document.getElementById('benefits-dots');

  if (!textContents.length) return;

  const totalStages = textContents.length;
  let currentStage = 0;

  // Create dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalStages; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider__dot';
      dot.setAttribute('aria-label', `Stage ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateStage() {
    // Swap text content
    textContents.forEach((content, index) => {
      const isActive = index === currentStage;
      content.setAttribute('data-active', isActive);
    });
    
    // Update dots
    const dots = dotsContainer?.children || [];
    Array.from(dots).forEach((dot, i) => {
      dot.classList.toggle('slider__dot--active', i === currentStage);
    });
  }

  function goTo(stage) {
    currentStage = stage;
    updateStage();
  }

  function next() {
    currentStage = (currentStage + 1) % totalStages;
    updateStage();
  }

  function prev() {
    currentStage = (currentStage - 1 + totalStages) % totalStages;
    updateStage();
  }

  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  updateStage();
  console.log(`✓ Benefits Map: ${totalStages} stages with world map`);
}

function init() {
  console.log('Stack8s - Initializing...');
  
  initHeader();
  initMobileMenu();
  initProvidersCarousel();
  initBenefitsMap();
  initUseCasesCarousel();
  initPricingSlider();
  initPlatformDiagram();
  initStepsCarousel();
  initSmoothScroll();
  initButtons();
  
  console.log('Stack8s - Ready!');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
