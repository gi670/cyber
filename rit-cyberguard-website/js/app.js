// RIT CyberGuard Website JavaScript

// Sample data for dynamic content
const teamsData = [
    {
        name: "Red Team",
        description: "Offensive security specialists focusing on penetration testing, vulnerability assessment, and ethical hacking. Learn to think like an attacker to better defend systems.",
        meeting: "Fridays 3:00 PM"
    },
    {
        name: "Blue Team", 
        description: "Defensive cybersecurity experts specializing in incident response, threat hunting, and security monitoring. Master the art of detection and prevention.",
        meeting: "Thursdays 4:00 PM"
    },
    {
        name: "Forensics Team",
        description: "Digital forensics and incident analysis specialists. Learn to investigate cybercrimes, analyze malware, and recover digital evidence.",
        meeting: "Tuesdays 5:00 PM"
    },
    {
        name: "Research Team",
        description: "Academic research in emerging cybersecurity technologies, AI security, IoT vulnerabilities, and cutting-edge threat analysis.",
        meeting: "Mondays 2:00 PM"
    }
];

const activitiesData = [
    {
        name: "Capture The Flag (CTF)",
        description: "Weekly CTF challenges covering web exploitation, cryptography, reverse engineering, and more. Compete individually or in teams.",
        meeting: "WEEKLY"
    },
    {
        name: "Security Workshops",
        description: "Hands-on workshops on topics like network security, malware analysis, secure coding, and vulnerability assessment.",
        meeting: "BI-WEEKLY"
    },
    {
        name: "Industry Talks",
        description: "Guest lectures from cybersecurity professionals, alumni, and industry experts sharing real-world experiences.",
        meeting: "MONTHLY"
    },
    {
        name: "Certification Prep",
        description: "Study groups for popular cybersecurity certifications including CEH, Security+, CISSP, and more.",
        meeting: "ONGOING"
    },
    {
        name: "Hackathons",
        description: "Organize and participate in cybersecurity hackathons, both internal competitions and external events.",
        meeting: "QUARTERLY"
    },
    {
        name: "Community Outreach",
        description: "Cybersecurity awareness programs for local schools, businesses, and community organizations.",
        meeting: "MONTHLY"
    }
];

const eventsData = [
    {
        schedule: "August 20, 2025 - 6:00 PM",
        name: "Club Introduction & Welcome",
        description: "Welcome new members and introduce them to RIT CyberGuard. Learn about our mission, activities, and how to get involved.",
        location: "Computer Science Lab"
    },
    {
        schedule: "August 25, 2025 - 4:00 PM", 
        name: "Beginner's Guide to Cybersecurity",
        description: "Foundational workshop covering cybersecurity basics, career paths, and essential tools for newcomers.",
        location: "Seminar Hall A"
    },
    {
        schedule: "September 1, 2025 - 3:00 PM",
        name: "CTF Training Session",
        description: "Hands-on training for Capture The Flag competitions. Learn problem-solving techniques and tool usage.",
        location: "Computer Lab 2"
    },
    {
        schedule: "September 8, 2025 - 5:00 PM",
        name: "Industry Expert Talk",
        description: "Guest lecture by a leading cybersecurity professional discussing current threats and industry trends.",
        location: "Main Auditorium"
    }
];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Load dynamic content
    loadTeams();
    loadActivities(); 
    loadEvents();

    // Initialize navigation
    initializeNavigation();

    // Initialize mobile menu
    initializeMobileMenu();

    // Initialize scroll animations
    initializeScrollAnimations();
});

// Load Teams
function loadTeams() {
    const teamsGrid = document.getElementById('teams-grid');
    if (!teamsGrid) return;

    teamsGrid.innerHTML = '';
    teamsData.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.innerHTML = `
            <h3 class="team-name">${team.name}</h3>
            <p class="team-description">${team.description}</p>
            <div class="team-meeting">${team.meeting}</div>
        `;
        teamsGrid.appendChild(teamCard);
    });
}

// Load Activities
function loadActivities() {
    const activitiesGrid = document.getElementById('activities-grid');
    if (!activitiesGrid) return;

    activitiesGrid.innerHTML = '';
    activitiesData.forEach(activity => {
        const activityCard = document.createElement('div');
        activityCard.className = 'group-card';
        activityCard.innerHTML = `
            <h3 class="group-name">${activity.name}</h3>
            <p class="group-description">${activity.description}</p>
            <div class="group-meeting">${activity.meeting}</div>
        `;
        activitiesGrid.appendChild(activityCard);
    });
}

// Load Events
function loadEvents() {
    const eventsGrid = document.getElementById('events-grid');
    if (!eventsGrid) return;

    eventsGrid.innerHTML = '';
    eventsData.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <div class="event-schedule">${event.schedule}</div>
            <h3 class="event-name">${event.name}</h3>
            <p class="event-description">${event.description}</p>
            <div class="event-location">📍 ${event.location}</div>
            <button class="btn btn--primary event-register" onclick="registerForEvent('${event.name}')">Register</button>
        `;
        eventsGrid.appendChild(eventCard);
    });
}

// Initialize Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    // Add click handlers for smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }

            // Update active states
            updateActiveNavLink(this);

            // Close mobile menu if open
            const nav = document.querySelector('.nav');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            if (nav.classList.contains('mobile-active')) {
                nav.classList.remove('mobile-active');
                mobileToggle.classList.remove('active');
            }
        });
    });

    // Handle scroll-based active states
    window.addEventListener('scroll', updateActiveNavOnScroll);
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Update navigation based on scroll position
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Initialize Mobile Menu
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.querySelector('.nav');

    if (!mobileMenuToggle || !nav) return;

    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('mobile-active');
        this.classList.toggle('active');
    });
}

// Initialize Scroll Animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all cards and sections
    document.querySelectorAll('.team-card, .group-card, .event-card, .stat-item').forEach(el => {
        observer.observe(el);
    });
}

// Show Join Form
function showJoinForm() {
    const modal = document.getElementById('form-modal');
    const formContainer = document.getElementById('form-container');

    if (!modal || !formContainer) return;

    formContainer.innerHTML = `
        <h2>Join RIT CyberGuard</h2>
        <form id="join-form" onsubmit="submitJoinForm(event)">
            <div class="form-group">
                <label for="fullName">Full Name *</label>
                <input type="text" id="fullName" name="fullName" class="form-control" required>
            </div>

            <div class="form-group">
                <label for="email">Email Address *</label>
                <input type="email" id="email" name="email" class="form-control" required>
            </div>

            <div class="form-group">
                <label for="phone">Phone Number *</label>
                <input type="tel" id="phone" name="phone" class="form-control" required>
            </div>

            <div class="form-group">
                <label for="department">Department *</label>
                <select id="department" name="department" class="form-control" required>
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science & Engineering</option>
                    <option value="IT">Information Technology</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="EEE">Electrical & Electronics</option>
                    <option value="MECH">Mechanical Engineering</option>
                    <option value="CIVIL">Civil Engineering</option>
                    <option value="OTHER">Other</option>
                </select>
            </div>

            <div class="form-group">
                <label for="year">Year of Study *</label>
                <select id="year" name="year" class="form-control" required>
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                </select>
            </div>

            <div class="form-group">
                <label for="experience">Prior Cybersecurity Experience</label>
                <textarea id="experience" name="experience" class="form-control" placeholder="Tell us about any prior experience, courses, or interests in cybersecurity..."></textarea>
            </div>

            <div class="form-group">
                <label for="motivation">Why do you want to join RIT CyberGuard?</label>
                <textarea id="motivation" name="motivation" class="form-control" placeholder="Share your motivation and what you hope to achieve..."></textarea>
            </div>

            <button type="submit" class="btn btn--primary">Submit Application</button>
        </form>
    `;

    modal.style.display = 'flex';
}

// Show Contact Form
function showContactForm() {
    const modal = document.getElementById('form-modal');
    const formContainer = document.getElementById('form-container');

    if (!modal || !formContainer) return;

    formContainer.innerHTML = `
        <h2>Contact Us</h2>
        <form id="contact-form" onsubmit="submitContactForm(event)">
            <div class="form-group">
                <label for="contactName">Name *</label>
                <input type="text" id="contactName" name="contactName" class="form-control" required>
            </div>

            <div class="form-group">
                <label for="contactEmail">Email *</label>
                <input type="email" id="contactEmail" name="contactEmail" class="form-control" required>
            </div>

            <div class="form-group">
                <label for="subject">Subject *</label>
                <input type="text" id="subject" name="subject" class="form-control" required>
            </div>

            <div class="form-group">
                <label for="message">Message *</label>
                <textarea id="message" name="message" class="form-control" required placeholder="Your message here..."></textarea>
            </div>

            <button type="submit" class="btn btn--primary">Send Message</button>
        </form>
    `;

    modal.style.display = 'flex';
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('form-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Submit Join Form
function submitJoinForm(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    // Basic validation
    if (!data.fullName || !data.email || !data.phone || !data.department || !data.year) {
        alert('Please fill in all required fields.');
        return;
    }

    // Simulate form submission
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    setTimeout(() => {
        alert('Thank you for your interest in joining RIT CyberGuard! We will review your application and get back to you within 2-3 days via email.');
        closeModal();

        // In a real application, you would send this data to your server
        console.log('Join form submitted:', data);
    }, 1500);
}

// Submit Contact Form
function submitContactForm(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    // Basic validation
    if (!data.contactName || !data.contactEmail || !data.subject || !data.message) {
        alert('Please fill in all required fields.');
        return;
    }

    // Simulate form submission
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
        alert('Thank you for contacting us! We will respond to your message within 24 hours.');
        closeModal();

        // In a real application, you would send this data to your server
        console.log('Contact form submitted:', data);
    }, 1500);
}

// Register for Event
function registerForEvent(eventName) {
    const confirmMessage = `Would you like to register for "${eventName}"? You will be redirected to contact us for registration details.`;

    if (confirm(confirmMessage)) {
        showContactForm();

        // Pre-fill the subject
        setTimeout(() => {
            const subjectField = document.getElementById('subject');
            if (subjectField) {
                subjectField.value = `Event Registration: ${eventName}`;
            }
        }, 100);
    }
}

// Click outside modal to close
window.addEventListener('click', function(event) {
    const modal = document.getElementById('form-modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Escape key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Add scroll-to-top functionality
window.addEventListener('scroll', function() {
    // Show/hide scroll to top button (if you add one later)
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add class to header when scrolled
    const header = document.querySelector('.header');
    if (scrollTop > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Add typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 50) {
    if (!element) return;

    element.innerHTML = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Uncomment the line below if you want the typing effect
        // typeWriter(heroTitle, originalText);
    }
});

// Add smooth reveal animation for stats
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));

                if (!isNaN(numericValue)) {
                    animateCounter(target, 0, numericValue, finalValue, 2000);
                }

                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

// Counter animation function
function animateCounter(element, start, end, finalText, duration) {
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;

        if (current >= end) {
            element.textContent = finalText;
            clearInterval(timer);
        } else {
            const suffix = finalText.includes('+') ? '+' : '';
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Initialize stat animations
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(animateStats, 500); // Delay to ensure page is loaded
});