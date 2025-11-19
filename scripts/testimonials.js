/* =====================================================
   TESTIMONIALS - GSAP Continuous Scroll Animation
   ===================================================== */

// Testimonials data
const testimonials = [
  {
    text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "Our business functions improved with a user-friendly design and positive customer feedback.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];

// Split testimonials into columns
const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

// Function to create testimonial card HTML
function createTestimonialCard(testimonial) {
  return `
    <div class="testimonial-card">
      <div class="testimonial-card__text">${testimonial.text}</div>
      <div class="testimonial-card__author">
        <img 
          src="${testimonial.image}" 
          alt="${testimonial.name}"
          class="testimonial-card__avatar"
          width="40"
          height="40"
          loading="lazy"
        />
        <div class="testimonial-card__info">
          <div class="testimonial-card__name">${testimonial.name}</div>
          <div class="testimonial-card__role">${testimonial.role}</div>
        </div>
      </div>
    </div>
  `;
}

// Function to populate a column with testimonials (duplicated for seamless loop)
function populateColumn(columnElement, testimonialsArray) {
  // Create two sets of testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonialsArray, ...testimonialsArray];
  
  duplicatedTestimonials.forEach(testimonial => {
    const cardHTML = createTestimonialCard(testimonial);
    columnElement.insertAdjacentHTML('beforeend', cardHTML);
  });
}

// Initialize mobile carousel
function initTestimonialsCarousel() {
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.querySelector('.testimonials .slider__arrow--prev');
  const nextBtn = document.querySelector('.testimonials .slider__arrow--next');
  const dotsContainer = document.getElementById('testimonials-dots');
  
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
  
  // Populate mobile carousel with all testimonials
  testimonials.forEach(testimonial => {
    const cardHTML = createTestimonialCard(testimonial);
    const cardElement = document.createElement('div');
    cardElement.innerHTML = cardHTML.trim();
    const card = cardElement.firstElementChild;
    track.appendChild(card);
  });
  
  const cards = track.querySelectorAll('.testimonial-card');
  if (cards.length === 0) return;
  
  const totalCards = cards.length;
  let currentIndex = 0;
  
  // Create dots
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalCards; i++) {
    const dot = document.createElement('button');
    dot.className = 'slider__dot';
    if (i === 0) dot.classList.add('slider__dot--active');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
  
  function updateCards() {
    // Crossfade cards using data-active
    cards.forEach((card, index) => {
      const isActive = index === currentIndex;
      card.setAttribute('data-active', isActive);
    });
    
    // Update dots
    const dots = dotsContainer.querySelectorAll('.slider__dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('slider__dot--active');
      } else {
        dot.classList.remove('slider__dot--active');
      }
    });
  }
  
  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, totalCards - 1));
    updateCards();
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalCards;
    updateCards();
  }
  
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateCards();
  }
  
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);
  
  // Add swipe support (using the same function from main.js)
  // We'll need to check if it's available or implement it here
  if (typeof addSwipeSupport === 'function') {
    addSwipeSupport(track.parentElement, nextSlide, prevSlide);
  } else {
    // Fallback swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;
    
    track.parentElement.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.parentElement.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const xDiff = touchStartX - touchEndX;
      if (Math.abs(xDiff) > minSwipeDistance) {
        if (xDiff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }, { passive: true });
  }
  
  updateCards();
  console.log('✓ Testimonials Mobile Carousel initialized');
}

// Initialize testimonials section
document.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.innerWidth <= 767;
  
  // Initialize desktop scrolling columns
  if (!isMobile) {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded. Testimonials animation will not work.');
      return;
    }

    const columnsWrapper = document.querySelector('.testimonials__columns-wrapper--desktop');
    if (!columnsWrapper) return;

    const columns = columnsWrapper.querySelectorAll('.testimonials__column');
    
    if (columns.length === 0) return;

    // Populate columns
    const columnData = [firstColumn, secondColumn, thirdColumn];
    
    columns.forEach((column, index) => {
      if (columnData[index]) {
        populateColumn(column, columnData[index]);
      }
    });

    // Animate columns with GSAP
    // Wait a bit for content to render and calculate heights
    setTimeout(() => {
      columns.forEach((column, index) => {
        const duration = parseInt(column.getAttribute('data-duration')) || 15;
        
        // Get the total height of the content (includes duplicated items)
        const contentHeight = column.scrollHeight;
        
        // Calculate the distance to move (half the content height for seamless loop)
        // Since we duplicated the testimonials, moving by 50% creates seamless loop
        const moveDistance = contentHeight / 2;
        
        // Set initial transform to ensure smooth animation
        gsap.set(column, { y: 0 });
        
        // Create animation that moves up by 50% of content height
        // Using linear ease for continuous, smooth scrolling
        gsap.to(column, {
          y: -moveDistance,
          duration: duration,
          ease: "none", // "none" is equivalent to "linear" in GSAP
          repeat: -1,
        });
      });
    }, 100);

    console.log('✓ Testimonials Desktop Columns initialized');
  } else {
    // Initialize mobile carousel
    initTestimonialsCarousel();
  }
  
  // Handle window resize - no need to reload, just reinitialize if needed
  // The CSS media queries handle the visibility, so we don't need to reload
});

