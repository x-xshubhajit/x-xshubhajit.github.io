// ===== Particle System =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -100, y: -100 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
            const force = (120 - dist) / 120;
            this.x += (dx / dist) * force * 2;
            this.y += (dy / dist) * force * 2;
        }
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();
window.addEventListener('resize', initParticles);

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const opacity = (1 - dist / 150) * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== Custom Cursor =====
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursorX = e.clientX;
    cursorY = e.clientY;
    dot.style.left = cursorX - 4 + 'px';
    dot.style.top = cursorY - 4 + 'px';
});

function animateCursor() {
    ringX += (cursorX - ringX) * 0.15;
    ringY += (cursorY - ringY) * 0.15;
    ring.style.left = ringX - 18 + 'px';
    ring.style.top = ringY - 18 + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effects on interactive elements
document.querySelectorAll('a, button, .skill-card, .info-card, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        dot.style.transform = 'scale(2.5)';
        ring.style.width = '50px';
        ring.style.height = '50px';
        ring.style.borderColor = 'rgba(123, 47, 247, 0.6)';
    });
    el.addEventListener('mouseleave', () => {
        dot.style.transform = 'scale(1)';
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.borderColor = 'rgba(0, 212, 255, 0.4)';
    });
});

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
const navAvatar = document.getElementById('navAvatar');
const profileContainer = document.querySelector('.profile-container');
const profileImage = document.querySelector('.profile-image');
const scrollIndicator = document.querySelector('.scroll-indicator');

// ===== Scroll Indicator: Show after 5s idle, hide on scroll =====
let idleTimer = null;
function startIdleTimer() {
    clearTimeout(idleTimer);
    scrollIndicator.classList.remove('show');
    // Only show if near top of page (hero section)
    if (window.scrollY < 100) {
        idleTimer = setTimeout(() => {
            if (window.scrollY < 100) {
                scrollIndicator.classList.add('show');
            }
        }, 5000);
    }
}
// Start initial idle timer on load
startIdleTimer();

// ===== Combined Scroll Handler =====
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar background
    navbar.classList.toggle('scrolled', scrollY > 50);

    // Hide scroll indicator on scroll, restart idle timer
    startIdleTimer();

    // ===== Profile Image Shrink Effect =====
    if (profileContainer) {
        const rect = profileContainer.getBoundingClientRect();
        const imgHeight = rect.height;
        // Start shrinking when 2/3 of the image has scrolled above the viewport top
        const triggerPoint = imgHeight * (2 / 3);
        // How much of the image is above the viewport
        const aboveViewport = -rect.top;

        if (aboveViewport > triggerPoint && rect.bottom > 0) {
            // Calculate shrink: from 1.0 down to 0.7
            const progress = Math.min((aboveViewport - triggerPoint) / (imgHeight - triggerPoint), 1);
            const scale = 1 - progress * 0.3;
            profileContainer.style.transform = `scale(${scale})`;
        } else if (aboveViewport <= triggerPoint) {
            profileContainer.style.transform = 'scale(1)';
        }

        // ===== Nav Avatar: Show when profile image leaves viewport =====
        // Show the avatar when the bottom of the profile image goes above the viewport
        const profileGone = rect.bottom < 0;
        navAvatar.classList.toggle('visible', profileGone);
    }
});

// ===== Mobile Menu Toggle =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 150;
        if (window.scrollY >= top) current = section.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.section === current);
    });
});

// ===== Typewriter Effect =====
const typewriterEl = document.getElementById('typewriter');
const phrases = ['Web Developer', 'CS Student', 'Quick Learner', 'Tech Enthusiast', 'AI Explorer'];
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
    const current = phrases[phraseIndex];
    typewriterEl.textContent = isDeleting
        ? current.substring(0, charIndex--)
        : current.substring(0, charIndex++);

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex > current.length) {
        delay = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
    }
    setTimeout(typeEffect, delay);
}
typeEffect();

// ===== Scroll Animations (Intersection Observer) =====
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ===== Counter Animation =====
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.dataset.target;
            let current = 0;
            const increment = target / 60;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    entry.target.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    entry.target.textContent = target;
                }
            };
            updateCounter();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ===== Skill Bar Animation =====
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.dataset.width;
            setTimeout(() => { entry.target.style.width = width + '%'; }, 300);
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ===== Contact Form =====
document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #28c840, #00d4ff)';
    setTimeout(() => {
        btn.innerHTML = origHTML;
        btn.style.background = '';
        e.target.reset();
    }, 3000);
});

// ===== Smooth Reveal on Load =====
window.addEventListener('load', () => {
    document.querySelectorAll('.hero .animate-on-scroll').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), 300 + i * 150);
    });
});

