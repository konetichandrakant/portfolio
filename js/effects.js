// Particle Background Effect for Hero Section
class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mousePosition = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;

        const hero = document.querySelector('.hero');
        if (hero) {
            hero.appendChild(this.canvas);
            this.resize();
            this.createParticles();
            this.animate();

            window.addEventListener('resize', () => this.resize());
            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                this.mousePosition.x = e.clientX - rect.left;
                this.mousePosition.y = e.clientY - rect.top;
            });
        }
    }

    resize() {
        const hero = document.querySelector('.hero');
        if (hero) {
            this.canvas.width = hero.offsetWidth;
            this.canvas.height = hero.offsetHeight;
        }
    }

    createParticles() {
        const particleCount = window.innerWidth > 768 ? 100 : 50;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            // Mouse interaction
            const dx = this.mousePosition.x - particle.x;
            const dy = this.mousePosition.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.x -= (dx / distance) * force * 2;
                particle.y -= (dy / distance) * force * 2;
            }

            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
            this.ctx.fill();
        });

        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const distance = Math.sqrt(
                    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
                );

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(102, 126, 234, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Text Glitch Effect
class GlitchEffect {
    constructor(element) {
        this.element = element;
        this.originalText = element.innerText;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.init();
    }

    init() {
        if (!this.element) return;

        this.element.addEventListener('mouseenter', () => this.glitch());
        this.element.addEventListener('click', () => this.glitch());
    }

    glitch() {
        const iterations = 10;
        let iteration = 0;

        const glitchInterval = setInterval(() => {
            this.element.innerText = this.randomizeText();
            iteration++;

            if (iteration >= iterations) {
                clearInterval(glitchInterval);
                this.element.innerText = this.originalText;
            }
        }, 50);
    }

    randomizeText() {
        return this.originalText
            .split('')
            .map(char => {
                if (Math.random() > 0.5) {
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                }
                return char;
            })
            .join('');
    }
}

// Magnetic Cursor Effect
class MagneticCursor {
    constructor(elements) {
        this.elements = elements;
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                element.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }
}

// Page Load Animation (disabled due to loading issues)
class PageLoadAnimation {
    constructor() {
        // Skip the loading animation to prevent page from being stuck
        this.skip();
    }

    skip() {
        // Immediately mark body as loaded and trigger entrance animations
        document.body.classList.add('loaded');

        // Add entrance animation classes to elements
        setTimeout(() => {
            const animatedElements = document.querySelectorAll('.section-animate, .animate-on-scroll');
            animatedElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animated');
                }, index * 50);
            });
        }, 100);
    }
}

// Parallax Mouse Move Effect
class ParallaxMouse {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            this.elements.forEach(element => {
                const speed = element.dataset.parallax || 5;
                const x = mouseX * speed;
                const y = mouseY * speed;

                element.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
}

// Floating Animation for Elements
class FloatingElements {
    constructor() {
        this.elements = document.querySelectorAll('.floating');
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        this.elements.forEach((element, index) => {
            const delay = index * 0.5;
            const duration = 3 + Math.random() * 2;

            element.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        });
    }
}

// Shine Effect on Hover
class ShineEffect {
    constructor() {
        this.init();
    }

    init() {
        const style = document.createElement('style');
        style.textContent = `
            .shine-effect {
                position: relative;
                overflow: hidden;
            }

            .shine-effect::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 255, 255, 0.1),
                    transparent
                );
                transition: left 0.5s;
            }

            .shine-effect:hover::before {
                left: 100%;
            }
        `;
        document.head.appendChild(style);

        document.querySelectorAll('.project-card, .skill-item').forEach(element => {
            element.classList.add('shine-effect');
        });
    }
}

// Typing Effect with Cursor
class AdvancedTypingEffect {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (!this.element || this.texts.length === 0) return;

        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.innerHTML = currentText.substring(0, this.charIndex - 1) + '<span class="cursor">|</span>';
            this.charIndex--;
        } else {
            this.element.innerHTML = currentText.substring(0, this.charIndex + 1) + '<span class="cursor">|</span>';
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Scroll Progress Bar
class ScrollProgress {
    constructor() {
        this.init();
    }

    init() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            z-index: 10000;
            transition: width 0.2s ease;
        `;

        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;

            progressBar.style.width = scrolled + '%';
        });
    }
}

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
    console.log('Effects initializing...');

    // Mark body as loaded immediately
    document.body.classList.add('loaded');

    // Initialize effects with a small delay to ensure page is visible
    setTimeout(() => {
        // Initialize particle background
        new ParticleBackground();

        // Initialize glitch effect for hero title
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            new GlitchEffect(heroTitle);
        }

        // Initialize magnetic cursor for buttons and cards
        const magneticElements = document.querySelectorAll('.btn, .project-card, .skill-category');
        new MagneticCursor(magneticElements);

        // Initialize floating elements
        new FloatingElements();

        // Initialize shine effect
        new ShineEffect();

        // Initialize scroll progress
        new ScrollProgress();

        // Trigger entrance animations
        const animatedElements = document.querySelectorAll('.section-animate, .animate-on-scroll');
        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animated');
            }, index * 50);
        });

        console.log('Effects initialized successfully');
    }, 100);
});

// Add CSS for cursor and animations
const additionalStyles = `
    .cursor {
        display: inline-block;
        animation: blink 1s infinite;
        font-weight: 300;
        margin-left: 2px;
    }

    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }

    .page-loader .loader-content {
        text-align: center;
    }

    .loader-logo {
        margin-bottom: 2rem;
    }

    .loader-text {
        font-size: 3rem;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: pulse 2s infinite;
    }

    .loader-bar {
        width: 200px;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
    }

    .loader-progress {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 2px;
        transition: width 0.3s ease;
    }

    body.loaded .section-animate {
        animation: fadeInUp 0.8s ease forwards;
    }

    body.loaded .hero .content > * {
        animation: fadeInUp 0.8s ease forwards;
    }

    body.loaded .hero .content > *:nth-child(1) { animation-delay: 0.1s; }
    body.loaded .hero .content > *:nth-child(2) { animation-delay: 0.2s; }
    body.loaded .hero .content > *:nth-child(3) { animation-delay: 0.3s; }
    body.loaded .hero .content > *:nth-child(4) { animation-delay: 0.4s; }

    .floating {
        animation: float 3s ease-in-out infinite;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);