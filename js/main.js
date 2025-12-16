// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const skillBars = document.querySelectorAll('.skill-bar');
const statsNumbers = document.querySelectorAll('.stat-number');
const sections = document.querySelectorAll('section');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initFormHandler();
    initParallax();
    initTypingEffect();
    initCountUpAnimation();
    initLazyLoading();
    // initCursorTrail(); // Uncomment if you want cursor trail effect
});

// Navigation Functions
function initNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active nav link on scroll
    window.addEventListener('scroll', highlightActiveLink);
}

function highlightActiveLink() {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink?.classList.add('active');
        }
    });
}

// Scroll Effects
function initScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            backToTopBtn.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            backToTopBtn.classList.remove('visible');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to top button
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animations on Scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');

                // Animate skill bars when visible
                if (entry.target.classList.contains('skills')) {
                    animateSkillBars();
                }

                // Animate stats when visible
                if (entry.target.classList.contains('about')) {
                    animateStats();
                }
            }
        });
    }, observerOptions);

    // Elements to observe
    const animateElements = document.querySelectorAll('.skill-item, .project-card, .timeline-item, .education-card');
    animateElements.forEach(el => observer.observe(el));

    // Observe sections
    sections.forEach(section => observer.observe(section));
}

// Animate skill bars
function animateSkillBars() {
    skillBars.forEach(bar => {
        const level = bar.style.getPropertyValue('--skill-level');
        bar.style.width = '0%';

        setTimeout(() => {
            bar.style.width = level;
        }, 200);
    });
}

// Animate counting stats
function animateStats() {
    statsNumbers.forEach(stat => {
        const target = parseInt(stat.innerText);
        const increment = target / 50;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.innerText = target + (stat.innerText.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current) + (stat.innerText.includes('+') ? '+' : '');
            }
        }, 30);
    });
}

// Form Handler
function initFormHandler() {
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                // Here you would normally send the data to a server
                // For demo purposes, we'll simulate a successful submission
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Show success message
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="close-btn"><i class="fas fa-times"></i></button>
    `;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero, .about, .skills');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Typing Effect
function initTypingEffect() {
    const typedTextElement = document.getElementById('typed-text');
    if (typedTextElement) {
        const text = "I'm Full Stack & AI Developer";
        let index = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        // Initialize with empty content
        typedTextElement.textContent = '';

        function typeWriter() {
            let currentText = '';

            if (!isDeleting) {
                // Typing forward
                currentText = text.substring(0, index);
                index++;

                if (index > text.length) {
                    // Pause at the end
                    isDeleting = true;
                    index = text.length;
                    typeSpeed = 2000; // Wait 2 seconds before deleting
                } else {
                    typeSpeed = 100; // Normal typing speed
                }
            } else {
                // Deleting backward
                index--;
                currentText = text.substring(0, index);

                if (index === 0) {
                    // Pause at the beginning
                    isDeleting = false;
                    typeSpeed = 500; // Wait before starting again
                } else {
                    typeSpeed = 50; // Faster deleting speed
                }
            }

            // Set the text content
            typedTextElement.textContent = currentText;

            setTimeout(typeWriter, typeSpeed);
        }

        // Start the typing effect after a small delay
        setTimeout(typeWriter, 500);
    }
}

// Count Up Animation for Stats
function initCountUpAnimation() {
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCountUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statsNumbers.forEach(stat => observer.observe(stat));
}

function animateCountUp(element) {
    const target = parseInt(element.innerText);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.innerText = target + (element.innerText.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.innerText = Math.floor(current) + (element.innerText.includes('+') ? '+' : '');
        }
    }, 16);
}

// Project Filter (if needed in future)
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('visible'), 10);
                } else {
                    card.classList.remove('visible');
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}

// Theme Toggle (for dark mode in future)
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// Performance optimization: Debounce scroll events
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

// Apply debounce to scroll-intensive functions
const optimizedScrollHandler = debounce(() => {
    highlightActiveLink();
    // Add other scroll-based functions here
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Cursor trail effect (optional visual enhancement)
function initCursorTrail() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
}

// Prevent context menu on images (for better UX)
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Press 'Escape' to close mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Press '/' to focus search (if search is added later)
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        // Focus search input if it exists
    }
});

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}


// Performance monitoring
window.addEventListener('load', () => {
    if ('performance' in window) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;

        // Only log if we have valid timing data
        if (loadTime > 0 && timing.loadEventEnd > 0) {
            console.log(`Page loaded in ${loadTime}ms`);
        }
    }
});