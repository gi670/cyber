// DOM elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Hamburger menu toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Smooth scrolling function
function smoothScrollTo(targetId) {
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Handle all navigation and button clicks
document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Handle navigation links
    if (target.classList.contains('nav-link') && target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href');
        smoothScrollTo(targetId);
        return;
    }
    
    // Handle "Join the Club" button
    if (target.classList.contains('btn--primary') && target.textContent.includes('Join')) {
        e.preventDefault();
        smoothScrollTo('#join');
        return;
    }
    
    // Handle "Learn More" button
    if (target.classList.contains('btn--outline') && target.textContent.includes('Learn')) {
        e.preventDefault();
        smoothScrollTo('#about');
        return;
    }
    
    // Handle any other anchor links starting with #
    const link = target.closest('a[href^="#"]');
    if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        smoothScrollTo(targetId);
    }
});

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

// Header background opacity on scroll
function updateHeaderBackground() {
    const header = document.querySelector('.header');
    const scrollY = window.scrollY;
    
    if (header) {
        if (scrollY > 50) {
            header.style.backgroundColor = 'rgba(10, 15, 28, 0.98)';
        } else {
            header.style.backgroundColor = 'rgba(10, 15, 28, 0.95)';
        }
    }
}

// Scroll event listeners
let ticking = false;

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateActiveNavLink();
            updateHeaderBackground();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll);

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add fade-in animation to cards and sections
function addFadeInAnimations() {
    const elementsToAnimate = document.querySelectorAll(`
        .team-card,
        .activity-card,
        .event-card,
        .resource-card,
        .about-content,
        .join-content,
        .hero-stats
    `);
    
    elementsToAnimate.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.style.transitionDelay = `${index * 0.1}s`;
        
        observer.observe(element);
    });
}

// Typing effect for hero title
function createTypingEffect() {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid #F76902';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                heroTitle.style.borderRight = 'none';
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
}

// Stats counter animation
function animateStats() {
    const stats = document.querySelectorAll('.stat h3');
    
    const animateCount = (element, target) => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (target === 15 ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.ceil(current) + (target === 15 ? '+' : '');
            }
        }, 30);
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = entry.target;
                const text = statElement.textContent;
                
                if (text.includes('+')) {
                    animateCount(statElement, 15);
                } else if (text === '5') {
                    animateCount(statElement, 5);
                } else if (text === '2025') {
                    animateCount(statElement, 2025);
                }
                
                statsObserver.unobserve(statElement);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Card hover effects enhancement
function enhanceCardHovers() {
    const cards = document.querySelectorAll('.team-card, .activity-card, .event-card, .resource-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addFadeInAnimations();
    createTypingEffect();
    animateStats();
    enhanceCardHovers();
    
    // Set initial active nav link
    updateActiveNavLink();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu if window is resized to desktop size
    if (window.innerWidth > 768 && hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Easter egg: Konami code for cybersecurity theme
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length) {
        let match = true;
        for (let i = 0; i < konamiSequence.length; i++) {
            if (konamiCode[i] !== konamiSequence[i]) {
                match = false;
                break;
            }
        }
        
        if (match) {
            // Show a fun cybersecurity message
            const message = document.createElement('div');
            message.innerHTML = '🔒 Konami Code Detected! Welcome, Elite Hacker! 🔒';
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #F76902, #00B4D8);
                color: white;
                padding: 20px 40px;
                border-radius: 10px;
                font-size: 18px;
                font-weight: bold;
                z-index: 9999;
                animation: pulse 1s infinite;
            `;
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                if (document.body.contains(message)) {
                    document.body.removeChild(message);
                }
            }, 3000);
            
            konamiCode = [];
        }
    }
});

// Add CSS animation for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.05); }
        100% { transform: translate(-50%, -50%) scale(1); }
    }
`;
document.head.appendChild(style);