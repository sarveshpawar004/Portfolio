// ==================================================
// MAIN JAVASCRIPT - Interactions & Animations
// ==================================================

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
});

// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

// Cursor effects on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursorFollower.style.transform = 'scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// ===== SCROLL PROGRESS BAR =====
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link on scroll
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== TYPING ANIMATION =====
const typedTextElement = document.getElementById('typed-text');
const textArray = [
    'Machine Learning',
    'Intelligent Systems',
    'Data Dashboards',
    'Automation',
    'Deep Learning',
    'Full Stack Development'
];
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextElement.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
    } else {
        setTimeout(erase, 2000);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextElement.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, 50);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) {
            textArrayIndex = 0;
        }
        setTimeout(type, 500);
    }
}

// Start typing animation after page load
setTimeout(type, 1000);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== INTERSECTION OBSERVER (Scroll Animations) =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';

            // Trigger counter animation if it's a stat card
            if (entry.target.classList.contains('stat-card')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Observe stat cards
document.querySelectorAll('.stat-card').forEach(card => {
    observer.observe(card);
});

// ===== ANIMATED COUNTERS =====
function animateCounter(card) {
    const numberElement = card.querySelector('.stat-number');
    const target = parseInt(numberElement.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            numberElement.textContent = Math.floor(current) + (target === 100 ? '%' : '+');
            requestAnimationFrame(updateCounter);
        } else {
            numberElement.textContent = target + (target === 100 ? '%' : '+');
        }
    };

    updateCounter();
}

// ===== 3D TILT EFFECT FOR SKILL CARDS =====
const skillCards = document.querySelectorAll('[data-tilt]');

skillCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== PROJECT MODAL =====
const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');

const projectDetails = {
    project1: {
        title: 'AI-Powered Smart Travel Planner',
        fullDescription: `
            <h2>AI-Powered Smart Travel Planner</h2>
            <img src="assets/images/travel-planner.png" alt="Travel Planner" style="width:100%; border-radius:12px; margin:20px 0;">
            <h3>Overview</h3>
            <p>A generative AI-based web application that creates personalized, comprehensive travel itineraries using the power of Google Gemini API. The system generates detailed day-by-day plans with destination recommendations, activities, and travel tips.</p>
            <h3>Key Features</h3>
            <ul>
                <li>🤖 <strong>AI-Powered Itineraries</strong>: Leverages Google Gemini for intelligent trip planning</li>
                <li>🖼️ <strong>Dynamic Imagery</strong>: Fetches real destination images via Unsplash API</li>
                <li>👤 <strong>Session-Based UX</strong>: Personalized experience with user preferences</li>
                <li>📱 <strong>Responsive Design</strong>: Beautiful UI across all devices</li>
            </ul>
            <h3>Tech Stack</h3>
            <p><strong>Backend:</strong> Python, Flask, Google Gemini API<br>
            <strong>Frontend:</strong> HTML5, CSS3, JavaScript (ES6+)<br>
            <strong>APIs:</strong> Google Gemini, Unsplash</p>
            <h3>Challenges & Solutions</h3>
            <p>Integrated real-time AI generation with user-friendly interfaces while handling API rate limits and prompt engineering for consistent output format.</p>
        `,
        github: '#',
        demo: '#'
    },
    project2: {
        title: 'Real Estate Price Prediction',
        fullDescription: `
            <h2>Real Estate Price Prediction</h2>
            <img src="assets/images/house-price-prediction.png" alt="Real Estate" style="width:100%; border-radius:12px; margin:20px 0;">
            <h3>Overview</h3>
            <p>An end-to-end machine learning web application that predicts house prices based on property features using Linear Regression. The system provides real-time price estimates with an intuitive, modern interface.</p>
            <h3>Key Features</h3>
            <ul>
                <li>🏠 <strong>ML Model</strong>: Linear Regression trained on property dataset</li>
                <li>📊 <strong>Feature Engineering</strong>: Optimized feature selection for accuracy</li>
                <li>🎨 <strong>Modern UI</strong>: Clean, responsive frontend</li>
                <li>⚡ <strong>Real-Time Predictions</strong>: Instant price estimates</li>
            </ul>
            <h3>Tech Stack</h3>
            <p><strong>ML:</strong> Scikit-Learn, Pandas, NumPy<br>
            <strong>Backend:</strong> Flask, Python<br>
            <strong>Frontend:</strong> HTML, CSS, JavaScript</p>
            <h3>Model Performance</h3>
            <p>Achieved strong predictive accuracy through careful feature engineering and model tuning. The system handles multiple property attributes including location, size, amenities, and more.</p>
        `,
        github: '#',
        demo: '#'
    },
    project3: {
        title: 'E-Commerce Recommendation System',
        fullDescription: `
            <h2>E-Commerce Recommendation Engine</h2>
            <img src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop" alt="E-Commerce" style="width:100%; border-radius:12px; margin:20px 0;">
            <h3>Overview</h3>
            <p>An intelligent recommendation engine that analyzes user behavior and preferences to suggest personalized product recommendations using collaborative filtering algorithms.</p>
            <h3>Key Features</h3>
            <ul>
                <li>🛒 <strong>Collaborative Filtering</strong>: User-based and item-based recommendations</li>
                <li>📈 <strong>Behavior Analysis</strong>: Tracks browsing and purchase patterns</li>
                <li>🎯 <strong>Personalization</strong>: Tailored product suggestions</li>
                <li>⚡ <strong>Real-Time</strong>: Dynamic recommendation updates</li>
            </ul>
            <h3>Tech Stack</h3>
            <p><strong>ML:</strong> Python, Collaborative Filtering, Matrix Factorization<br>
            <strong>Data Processing:</strong> Pandas, NumPy<br>
            <strong>Backend:</strong> Flask</p>
            <h3>Impact</h3>
            <p>Significantly improves user engagement and conversion rates by surfacing relevant products based on individual preferences and similar user behaviors.</p>
        `,
        github: '#',
        demo: '#'
    },
    project4: {
        title: 'Crop Prediction System',
        fullDescription: `
            <h2>Crop Prediction System</h2>
            <img src="assets/images/crop-prediction.png" alt="Crop Prediction" style="width:100%; border-radius:12px; margin:20px 0;">
            <h3>Overview</h3>
            <p>An ML-powered agricultural decision support system that predicts optimal crops based on soil parameters, climate conditions, and environmental factors to help farmers maximize yield.</p>
            <h3>Key Features</h3>
            <ul>
                <li>🌾 <strong>Smart Crop Recommendation</strong>: ML algorithms analyze soil and climate data</li>
                <li>📊 <strong>Multi-Parameter Analysis</strong>: NPK values, pH, rainfall, temperature, humidity</li>
                <li>🎯 <strong>High Accuracy</strong>: Trained on comprehensive agricultural datasets</li>
                <li>📱 <strong>User-Friendly Interface</strong>: Simple input form with instant predictions</li>
            </ul>
            <h3>Tech Stack</h3>
            <p><strong>ML:</strong> Python, Scikit-Learn, Pandas, NumPy<br>
            <strong>Backend:</strong> Flask<br>
            <strong>Frontend:</strong> HTML, CSS, JavaScript</p>
            <h3>Impact</h3>
            <p>Helps farmers make data-driven decisions about crop selection, potentially increasing agricultural productivity and reducing resource wastage through optimized crop choices.</p>
        `,
        github: '#',
        demo: '#'
    }
};

// Open modal
document.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const projectId = e.target.getAttribute('data-project');
        const project = projectDetails[projectId];

        if (project) {
            modalBody.innerHTML = project.fullDescription;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal
modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ===== CONTACT MODAL =====
const openContactModal = document.getElementById('open-contact-modal');
const closeContactModal = document.getElementById('close-contact-modal');
const contactModal = document.getElementById('contact-modal');

// Open contact modal
if (openContactModal) {
    openContactModal.addEventListener('click', () => {
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Close contact modal
if (closeContactModal) {
    closeContactModal.addEventListener('click', () => {
        contactModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

// Close modal on outside click
if (contactModal) {
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== FORM SUBMISSION =====
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Simple validation
        if (name && email && message) {
            // Send email using EmailJS (you'll need to set this up)
            // For now, simulating success
            alert(`Thank you, ${name}! Your message has been received. I'll get back to you soon at ${email}.`);
            contactForm.reset();
            contactModal.classList.remove('active');
            document.body.style.overflow = 'auto';

            // TODO: Replace with actual EmailJS integration
            // Step 1: Sign up at emailjs.com
            // Step 2: Add this script to index.html: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
            // Step 3: Initialize EmailJS and replace the alert above with:
            // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            //     from_name: name,
            //     from_email: email,
            //     message: message,
            //     to_email: 'Sarveshpawar004@gmail.com'
            // }).then(() => {
            //     alert(`Thank you, ${name}! Your message has been sent.`);
            //     contactForm.reset();
            //     contactModal.classList.remove('active');
            //     document.body.style.overflow = 'auto';
            // });
        } else {
            alert('Please fill in all fields.');
        }
    });
}

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    // Parallax for hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / 500);
    }
});

// ===== RIPPLE EFFECT FOR BUTTONS =====
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

console.log('🚀 Portfolio initialized successfully!');
