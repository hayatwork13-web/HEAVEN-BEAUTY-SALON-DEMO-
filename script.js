document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. Sticky Header & Active Nav Link Highlight
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function handleScroll() {
    // Sticky Class
    if (window.scrollY > 50) {
      header.classList.add('shadow-md', 'py-3');
      header.classList.remove('py-5');
    } else {
      header.classList.remove('shadow-md', 'py-3');
      header.classList.add('py-5');
    }

    // Active Section Highlight
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 160; // Offset for header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Update Desktop Nav Links
    navLinks.forEach(link => {
      link.classList.remove('active-nav-link');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active-nav-link');
      }
    });

    // Update Mobile Nav Links
    mobileNavLinks.forEach(link => {
      link.classList.remove('text-[#C85A87]', 'font-semibold');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('text-[#C85A87]', 'font-semibold');
      }
    });

    // Show/Hide Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
      backToTopBtn.classList.add('opacity-100', 'translate-y-0');
    } else {
      backToTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
      backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial call

  // 2. Mobile Menu Toggle
  const menuBtn = document.getElementById('menu-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && closeMenuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('translate-x-full');
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    });

    closeMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('translate-x-full');
      document.body.style.overflow = ''; // Restore body scroll
    });

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Scroll Reveal Animations
  const reveals = document.querySelectorAll('.reveal');

  function revealOnScroll() {
    reveals.forEach(reveal => {
      const windowHeight = window.innerHeight;
      const elementTop = reveal.getBoundingClientRect().top;
      const elementVisible = 100; // Trigger threshold in pixels

      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial run

  // 4. Service Filter / Categorization Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('filter-btn-active'));
      // Add active class to clicked button
      btn.classList.add('filter-btn-active');

      const category = btn.getAttribute('data-category');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 300);
        }
      });
    });
  });

  // 5. Testimonials Slider
  const testimonialTrack = document.getElementById('testimonials-track');
  const testimonials = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  let currentIndex = 0;
  const totalSlides = testimonials.length;

  function updateTestimonialSlider() {
    if (!testimonialTrack) return;
    testimonialTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  if (prevBtn && nextBtn && testimonialTrack) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateTestimonialSlider();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateTestimonialSlider();
    });

    // Auto-advance every 6 seconds
    let autoPlayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateTestimonialSlider();
    }, 6000);

    // Reset autoplay interval on click
    [prevBtn, nextBtn].forEach(btn => {
      btn.addEventListener('click', () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
          currentIndex = (currentIndex + 1) % totalSlides;
          updateTestimonialSlider();
        }, 6000);
      });
    });
  }

  // 6. Pre-fill Service from Service Selection & Auto Scroll
  const quickBookBtns = document.querySelectorAll('.quick-book-btn');
  const serviceDropdown = document.getElementById('appointment-service');
  const appointmentSection = document.getElementById('contact');

  quickBookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      
      if (serviceDropdown && serviceName) {
        serviceDropdown.value = serviceName;
      }

      if (appointmentSection) {
        const offset = 100; // offset for sticky header
        const elementPosition = appointmentSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 7. Interactive Booking Form & Dynamic Success Popup
  const bookingForm = document.getElementById('booking-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-success-modal');
  const modalWhatsappLink = document.getElementById('modal-whatsapp-link');

  let latestBookingDetails = null;

  if (bookingForm && successModal && closeModalBtn) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Form data collection
      const name = document.getElementById('appointment-name').value.trim();
      const phone = document.getElementById('appointment-phone').value.trim();
      const service = document.getElementById('appointment-service').value;
      const date = document.getElementById('appointment-date').value;
      const time = document.getElementById('appointment-time').value;
      const message = document.getElementById('appointment-message').value.trim();

      // Simple validation check
      if (!name || !phone || !service || !date || !time) {
        alert('Please fill in all required fields marked with an asterisk (*).');
        return;
      }

      // Store booking details
      latestBookingDetails = { name, phone, service, date, time, message };

      // Generate formatted message for WhatsApp link inside the modal
      const formattedMessage = `Hello Heaven Beauty Salon & Studio, I would like to book an appointment.\n\n` +
        `*Name:* ${name}\n` +
        `*Phone:* ${phone}\n` +
        `*Service:* ${service}\n` +
        `*Date:* ${date}\n` +
        `*Time:* ${time}\n` +
        `${message ? `*Notes:* ${message}` : ''}`;

      const encodedMessage = encodeURIComponent(formattedMessage);
      const whatsappUrl = `https://wa.me/923003287865?text=${encodedMessage}`;

      if (modalWhatsappLink) {
        modalWhatsappLink.setAttribute('href', whatsappUrl);
      }

      // Show success modal with beautiful bounce transition
      successModal.classList.remove('hidden', 'pointer-events-none', 'opacity-0');
      successModal.classList.add('flex', 'opacity-100');
      document.body.style.overflow = 'hidden';

      // Reset form
      bookingForm.reset();
    });

    closeModalBtn.addEventListener('click', () => {
      successModal.classList.add('hidden', 'pointer-events-none', 'opacity-0');
      successModal.classList.remove('flex', 'opacity-100');
      document.body.style.overflow = '';
    });

    // Close modal if clicking outside content
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.add('hidden', 'pointer-events-none', 'opacity-0');
        successModal.classList.remove('flex', 'opacity-100');
        document.body.style.overflow = '';
      }
    });
  }

  // 8. Gallery / Portfolio Lightbox Modal (Premium Feature)
  const galleryItems = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxGradient = document.getElementById('lightbox-gradient');
  const closeLightboxBtn = document.getElementById('close-lightbox');

  if (galleryItems.length > 0 && lightboxModal && closeLightboxBtn) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const title = item.querySelector('h4').textContent;
        const desc = item.querySelector('p').textContent;
        const gradientClass = item.querySelector('.aspect-\\[4\\/5\\]').className;

        // Apply metadata to lightbox
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;

        // Clone the gradient card layout inside the lightbox dynamically
        lightboxGradient.className = "w-full h-80 rounded-2xl flex flex-col justify-between p-8 relative overflow-hidden shadow-inner " + gradientClass;
        
        // Show lightbox
        lightboxModal.classList.remove('hidden', 'pointer-events-none', 'opacity-0');
        lightboxModal.classList.add('flex', 'opacity-100');
        document.body.style.overflow = 'hidden';
      });
    });

    closeLightboxBtn.addEventListener('click', () => {
      lightboxModal.classList.add('hidden', 'pointer-events-none', 'opacity-0');
      lightboxModal.classList.remove('flex', 'opacity-100');
      document.body.style.overflow = '';
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.add('hidden', 'pointer-events-none', 'opacity-0');
        lightboxModal.classList.remove('flex', 'opacity-100');
        document.body.style.overflow = '';
      }
    });
  }

  // 9. Back To Top click event
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 10. Dynamic Philosophy Tab switching in About us
  const philosophyTabs = document.querySelectorAll('.philosophy-tab');
  const philosophyContents = document.querySelectorAll('.philosophy-content');

  philosophyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      // Update tabs
      philosophyTabs.forEach(t => {
        t.classList.remove('border-[#C85A87]', 'text-[#C85A87]');
        t.classList.add('border-transparent', 'text-[#6D6D6D]');
      });
      tab.classList.add('border-[#C85A87]', 'text-[#C85A87]');
      tab.classList.remove('border-transparent', 'text-[#6D6D6D]');

      // Update contents
      philosophyContents.forEach(content => {
        if (content.getAttribute('id') === targetId) {
          content.classList.remove('hidden');
          content.classList.add('animate-[subtleFade_0.4s_ease-out]');
        } else {
          content.classList.add('hidden');
          content.classList.remove('animate-[subtleFade_0.4s_ease-out]');
        }
      });
    });
  });
});
