/* ============================================
   MAIN JAVASCRIPT - Sound Effects Store
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Shopify theme loaded');
  
  // Initialize all interactive components
  initializeAccordions();
  initializeCart();
  initializeMobileMenu();
});

/* ============================================
   ACCORDION / FAQ FUNCTIONALITY
   ============================================ */
function initializeAccordions() {
  const buttons = document.querySelectorAll('.faq-question');
  
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const item = this.closest('.faq-item');
      
      // Close other items
      const siblings = item.parentNode.querySelectorAll('.faq-item.active');
      siblings.forEach(sibling => {
        if (sibling !== item) {
          sibling.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

/* ============================================
   CART FUNCTIONALITY
   ============================================ */
function initializeCart() {
  const cartButtons = document.querySelectorAll('.add-to-cart-form');
  
  cartButtons.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('.cta-button');
      const originalText = submitBtn.textContent;
      
      // Disable button during submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Adding...';
      
      // Submit form
      const formData = new FormData(this);
      
      fetch('/cart/add.js', {
        method: 'POST',
        body: new URLSearchParams(formData)
      })
      .then(response => response.json())
      .then(data => {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Added!';
        
        // Update cart count
        updateCartCount();
        
        // Reset button text after 2 seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
        }, 2000);
      })
      .catch(error => {
        console.error('Error:', error);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
    });
  });
}

/**
 * Update cart count in header
 */
function updateCartCount() {
  fetch('/cart.js')
    .then(response => response.json())
    .then(cart => {
      const cartCount = document.querySelector('.cart-count');
      if (cartCount) {
        cartCount.textContent = cart.item_count;
      }
    });
}

/* ============================================
   MOBILE MENU TOGGLE
   ============================================ */
function initializeMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const nav = document.querySelector('.header-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      nav.classList.toggle('open');
    });
  }
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Format price for display
 */
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

/**
 * Debounce function for resize/scroll events
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* ============================================
   LAZY LOADING
   ============================================ */
if ('IntersectionObserver' in window) {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}
