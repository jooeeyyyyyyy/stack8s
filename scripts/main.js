/* =====================================================
   STACK8S - SIMPLE WORKING SLIDERS WITH MOBILE TOUCH
   ===================================================== */

// =====================================================
// TOUCH/SWIPE UTILITY FOR MOBILE
// =====================================================

function addSwipeSupport(element, onSwipeLeft, onSwipeRight) {
  if (!element) return;
  
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  
  const minSwipeDistance = 50; // Minimum distance for a swipe
  
  element.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });
  
  element.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    const xDiff = touchStartX - touchEndX;
    const yDiff = Math.abs(touchStartY - touchEndY);
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(xDiff) > yDiff && Math.abs(xDiff) > minSwipeDistance) {
      if (xDiff > 0) {
        // Swipe left (next)
        onSwipeLeft?.();
      } else {
        // Swipe right (prev)
        onSwipeRight?.();
      }
    }
  }, { passive: true });
}

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

  // Add swipe support for mobile
  addSwipeSupport(track.parentElement, next, prev);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  updateCards();
  console.log('✓ Use Cases: 4 cards with crossfade, 4 dots + touch swipe');
}

// =====================================================
// PRICING PREVIEW SLIDER (Homepage)
// 3 cards, show 2 at a time, 2 positions, 2 dots
// =====================================================

function initPricingPreviewSlider() {
  const track = document.getElementById('pricing-preview-track');
  const pricingSection = document.getElementById('pricing-preview');
  const prevBtn = pricingSection?.querySelector('.slider__arrow--prev');
  const nextBtn = pricingSection?.querySelector('.slider__arrow--next');
  const dotsContainer = document.getElementById('pricing-preview-dots');

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
    const cardWidth = cards[0]?.offsetWidth || 0;
    const gap = 40;
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

  addSwipeSupport(track.parentElement, next, prev);
  window.addEventListener('resize', updateSlider);
  setTimeout(updateSlider, 100);
  console.log('✓ Pricing Preview: 4 cards, 2 visible, 3 positions, 3 dots + touch swipe');
}

// =====================================================
// PRICING SLIDER
// 4 cards, show 2 at a time, 3 positions, 3 dots
// =====================================================

function initPricingSlider() {
  // Check for homepage preview slider first
  const previewTrack = document.getElementById('pricing-preview-track');
  if (previewTrack) {
    initPricingPreviewSlider();
  }
  
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

  // Add swipe support for mobile
  addSwipeSupport(track.parentElement, next, prev);

  // Recalculate on resize
  window.addEventListener('resize', updateSlider);

  // Initialize after layout
  setTimeout(updateSlider, 100);
  console.log('✓ Pricing: 4 cards, 2 visible, 3 positions, 3 dots + touch swipe');
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
// ANIMATED NAVBAR (DESKTOP)
// =====================================================

function initAnimatedNavbar() {
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const navbar = document.querySelector('.navbar');
  const navItems = document.querySelectorAll('.navbar__item');
  
  if (!navbar || !navbarWrapper) return;
  
  // Function to calculate and update navbar height
  function updateNavbarHeight() {
    let maxDropdownHeight = 0;
    let hasActiveDropdown = false;
    
    // Find all dropdowns that are direct children of navbar
    const dropdowns = navbar.querySelectorAll('.navbar__dropdown');
    
    dropdowns.forEach(dropdown => {
      if (dropdown.classList.contains('is-active')) {
        hasActiveDropdown = true;
        // Temporarily show dropdown to measure its actual height
        const originalMaxHeight = dropdown.style.maxHeight;
        const originalVisibility = dropdown.style.visibility;
        const originalOpacity = dropdown.style.opacity;
        const originalOverflow = dropdown.style.overflow;
        
        dropdown.style.maxHeight = 'none';
        dropdown.style.visibility = 'visible';
        dropdown.style.opacity = '1';
        dropdown.style.overflow = 'visible';
        
        // Measure the actual content height
        const dropdownContent = dropdown.querySelector('.navbar__dropdown-content');
        if (dropdownContent) {
          const contentHeight = dropdownContent.offsetHeight;
          // Add padding-top (1rem = 16px) and margin-top (0.5rem = 8px) = 24px total
          const totalHeight = contentHeight + 24;
          maxDropdownHeight = Math.max(maxDropdownHeight, totalHeight);
        }
        
        // Restore original styles
        dropdown.style.maxHeight = originalMaxHeight;
        dropdown.style.visibility = originalVisibility;
        dropdown.style.opacity = originalOpacity;
        dropdown.style.overflow = originalOverflow;
      }
    });
    
    // Update navbar height - let dropdown extend naturally without extra padding
    // The dropdown will extend the navbar naturally through its own height
    // No need to add padding-bottom when dropdown is active
  }
  
  // Handle dropdown hover states with sequenced animations
  let activeDropdown = null;
  let hoverTimeout = null;
  
  navItems.forEach(item => {
    const dropdownId = item.getAttribute('data-dropdown');
    if (!dropdownId) return;
    
    const dropdown = navbar.querySelector(`.navbar__dropdown[data-dropdown-target="${dropdownId}"]`);
    if (!dropdown) return;
    
    // Opening: hover item -> extend navbar
    item.addEventListener('mouseenter', () => {
      // Clear any pending close timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      
      // Close previously active dropdown if switching between items
      if (activeDropdown && activeDropdown !== dropdown) {
        activeDropdown.classList.remove('is-active');
        navbar.classList.remove('has-dropdown-item-hover');
      }
      
      // Open new dropdown smoothly
      navbar.classList.add('has-dropdown-item-hover');
      dropdown.classList.add('is-active');
      activeDropdown = dropdown;
    });
    
    item.addEventListener('mouseleave', () => {
      // Small delay to allow moving to dropdown
      hoverTimeout = setTimeout(() => {
        // Check if mouse is still over dropdown or item
        if (!dropdown.matches(':hover') && !item.matches(':hover')) {
          dropdown.classList.remove('is-active');
          navbar.classList.remove('has-dropdown-item-hover');
          if (activeDropdown === dropdown) {
            activeDropdown = null;
          }
        }
      }, 100);
    });
    
    // Also handle dropdown direct hover
    dropdown.addEventListener('mouseenter', () => {
      // Clear any pending close timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      
      // Keep dropdown open when hovering it
      navbar.classList.add('has-dropdown-item-hover');
      dropdown.classList.add('is-active');
      activeDropdown = dropdown;
    });
    
    dropdown.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        if (!item.matches(':hover')) {
          dropdown.classList.remove('is-active');
          navbar.classList.remove('has-dropdown-item-hover');
          if (activeDropdown === dropdown) {
            activeDropdown = null;
          }
        }
      }, 100);
    });
  });
  
  // Auto-hide navbar on scroll down
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  function updateNavbar() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      navbarWrapper.classList.add('navbar-hidden');
      // Close all dropdowns when hiding
      navbar.querySelectorAll('.navbar__dropdown').forEach(dropdown => {
        dropdown.classList.remove('is-active');
      });
      // Remove corner radius class
      navbar.classList.remove('has-dropdown-item-hover');
      updateNavbarHeight();
    } else {
      navbarWrapper.classList.remove('navbar-hidden');
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
  }
  
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
  
  // Recalculate on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateNavbarHeight();
    }, 100);
  });
  
  console.log('✓ Animated Navbar initialized with dynamic height extension');
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
        // Account for navbar height (desktop) or header height (mobile)
        const offset = window.innerWidth > 1024 ? 120 : 100;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Handle hash navigation on page load (for cross-page links like /company.html#contact)
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        const offset = window.innerWidth > 1024 ? 120 : 100;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    }, 100);
  }
}

// =====================================================
// BUTTONS
// =====================================================

function initButtons() {
  // All "Book a Demo" buttons (including navbar)
  document.querySelectorAll('.btn-primary, button').forEach(button => {
    if (button.textContent.includes('Book') || button.textContent.includes('Demo')) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('📅 Book a Demo clicked');
        
        // Check if we're on homepage
        const pathname = window.location.pathname;
        const isHomepage = pathname === '/' || pathname === '/index.html' || pathname.endsWith('/') || pathname.endsWith('index.html') || pathname.split('/').pop() === '' || pathname.split('/').pop() === 'index.html';
        
        if (isHomepage) {
          // Scroll to final CTA on homepage
          const finalCta = document.getElementById('final-cta');
          if (finalCta) {
            const offset = window.innerWidth > 1024 ? 120 : 100;
            window.scrollTo({
              top: finalCta.offsetTop - offset,
              behavior: 'smooth'
            });
          }
        } else {
          // Navigate to company page contact section
          window.location.href = 'company.html#contact';
        }
      });
    }
  });
  
  console.log('✓ Buttons initialized');
}

// =====================================================
// INIT
// =====================================================

// =====================================================
// PROVIDERS PREVIEW CAROUSEL (Homepage)
// =====================================================

function initProvidersPreviewCarousel() {
  const track = document.getElementById('providers-preview-track');
  const pricingSection = document.getElementById('pricing-preview');
  const prevBtn = pricingSection?.querySelector('.providers-carousel .slider__arrow--prev');
  const nextBtn = pricingSection?.querySelector('.providers-carousel .slider__arrow--next');
  const dotsContainer = document.getElementById('providers-preview-dots');

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

  addSwipeSupport(track.parentElement, next, prev);
  window.addEventListener('resize', updateSlider);
  setTimeout(updateSlider, 100);
  console.log('✓ Providers Preview: 4 cards, 3 visible, 2 positions + touch swipe');
}

// =====================================================
// CLOUD PROVIDERS CAROUSEL
// Shows 3 cards at a time, slides by 1
// =====================================================

function initProvidersCarousel() {
  // Check for homepage preview carousel first
  const previewTrack = document.getElementById('providers-preview-track');
  if (previewTrack) {
    initProvidersPreviewCarousel();
  }
  
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

  // Add swipe support for mobile
  addSwipeSupport(track.parentElement, next, prev);

  window.addEventListener('resize', updateSlider);
  setTimeout(updateSlider, 100);
  
  console.log('✓ Providers: 4 cards, 3 visible, 2 positions + touch swipe');
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

  // Add swipe support for mobile
  addSwipeSupport(track.parentElement, next, prev);

  updateContent();
  console.log(`✓ Steps Carousel: ${totalSlides} steps - text swaps, cards slide + touch swipe`);
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

  // Add swipe support for mobile
  const benefitsSection = document.querySelector('.benefits-map');
  addSwipeSupport(benefitsSection, next, prev);

  updateStage();
  console.log(`✓ Benefits Map: ${totalStages} stages with world map + touch swipe`);
}

// =====================================================
// ACTIVE NAVIGATION STATE
// =====================================================

function initActiveNavigation() {
  // Get current page path
  let currentPath = window.location.pathname;
  // Normalize path: remove leading/trailing slashes and handle index.html
  currentPath = currentPath.replace(/^\/+|\/+$/g, '');
  if (!currentPath || currentPath === 'index.html') {
    currentPath = '';
  }
  
  const isHomepage = !currentPath || currentPath === 'index.html' || currentPath === '';
  
  // Don't highlight anything on homepage
  if (isHomepage) {
    return;
  }
  
  // Map of page paths to navigation items (normalized)
  const pageMap = {
    'platform.html': { main: 'Platform', type: 'dropdown', sub: 'Overview' },
    'platform-components.html': { main: 'Platform', type: 'dropdown', sub: 'Components' },
    'solutions.html': { main: 'Solutions', type: 'link' },
    'pricing.html': { main: 'Pricing', type: 'link' },
    'resources.html': { main: 'About', type: 'dropdown', sub: 'Resources' },
    'company.html': { main: 'About', type: 'dropdown', sub: 'Company' },
  };
  
  const currentPage = pageMap[currentPath];
  if (!currentPage) {
    console.log(`⚠ No active navigation mapping for: ${currentPath}`);
    return;
  }
  
  // Highlight desktop navbar
  const navbarLinks = document.querySelectorAll('.navbar__link');
  const navbarItems = document.querySelectorAll('.navbar__item');
  const dropdownLinks = document.querySelectorAll('.navbar__dropdown-link');
  
  navbarLinks.forEach(link => {
    const linkText = link.textContent.trim();
    if (currentPage.type === 'link' && linkText === currentPage.main) {
      link.classList.add('active');
      link.closest('.navbar__item')?.classList.add('active');
    } else if (currentPage.type === 'dropdown' && linkText === currentPage.main) {
      link.classList.add('active');
      link.closest('.navbar__item')?.classList.add('active');
    }
  });
  
  // Highlight dropdown items
  if (currentPage.type === 'dropdown' && currentPage.sub) {
    dropdownLinks.forEach(link => {
      if (link.textContent.trim() === currentPage.sub) {
        link.classList.add('active');
      }
    });
  }
  
  // Highlight mobile menu
  const mobileLinks = document.querySelectorAll('.mobile-menu__link, .header__nav-list a');
  mobileLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      // Normalize both paths for comparison
      const normalizedHref = href.replace(/^\/+|\/+$/g, '') || 'index.html';
      const normalizedCurrent = currentPath || 'index.html';
      
      // Match if paths are equal (handles both /page.html and page.html)
      if (normalizedHref === normalizedCurrent || 
          href === `/${currentPath}` ||
          href === currentPath ||
          (normalizedHref === 'index.html' && normalizedCurrent === '')) {
        link.classList.add('active');
      }
    }
  });
  
  // Also highlight mobile menu items that match the current page by text
  // This handles the case where Resources/Company are nested under About
  if (currentPage.type === 'dropdown' && currentPage.sub) {
    mobileLinks.forEach(link => {
      const linkText = link.textContent.trim();
      if (linkText === currentPage.sub) {
        link.classList.add('active');
      }
    });
  }
  
  console.log(`✓ Active navigation: ${currentPage.main}${currentPage.sub ? ` > ${currentPage.sub}` : ''}`);
}

// =====================================================
// FAQ COLLAPSIBLES / ACCORDION
// =====================================================

function initFaqCollapsibles() {
  const collapsibles = document.querySelectorAll('[data-collapsible]');
  
  if (collapsibles.length === 0) return;
  
  collapsibles.forEach(collapsible => {
    const header = collapsible.querySelector('.faq-collapsible__header');
    const content = collapsible.querySelector('.faq-collapsible__content');
    const inner = collapsible.querySelector('.faq-collapsible__inner');
    
    if (!header || !content || !inner) return;
    
    // Set initial state
    collapsible.setAttribute('data-expanded', 'false');
    header.setAttribute('aria-expanded', 'false');
    
    // Calculate content height for smooth animation
    let contentHeight = 0;
    
    function updateContentHeight() {
      // Temporarily expand to measure
      content.style.maxHeight = 'none';
      contentHeight = inner.offsetHeight;
      content.style.maxHeight = collapsible.getAttribute('data-expanded') === 'true' ? `${contentHeight}px` : '0px';
    }
    
    // Initial measurement
    updateContentHeight();
    
    // Recalculate on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (collapsible.getAttribute('data-expanded') === 'true') {
          updateContentHeight();
        }
      }, 100);
    });
    
    header.addEventListener('click', () => {
      const isExpanded = collapsible.getAttribute('data-expanded') === 'true';
      
      // Update state
      collapsible.setAttribute('data-expanded', isExpanded ? 'false' : 'true');
      header.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      
      // Update height
      if (!isExpanded) {
        // Expanding: measure first, then animate
        updateContentHeight();
        requestAnimationFrame(() => {
          content.style.maxHeight = `${contentHeight}px`;
        });
      } else {
        // Collapsing: animate to 0
        content.style.maxHeight = '0px';
      }
    });
  });
  
  console.log(`✓ FAQ Collapsibles: ${collapsibles.length} items initialized`);
}

function init() {
  console.log('Stack8s - Initializing...');
  
  initAnimatedNavbar();
  initHeader();
  initMobileMenu();
  initActiveNavigation();
  initFaqCollapsibles();
  initProvidersCarousel();
  initBenefitsMap();
  initUseCasesCarousel();
  initPricingSlider(); // This will also init preview slider if on homepage
  initPlatformDiagram();
  initStepsCarousel();
  initSmoothScroll();
  initButtons();
  initRadialOrbitalTimeline();
  
  console.log('Stack8s - Ready!');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
