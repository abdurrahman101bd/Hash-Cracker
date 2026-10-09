const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const moonIcon = document.querySelector('.moon-icon');
const sunIcon = document.querySelector('.sun-icon');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    moonIcon.style.display = 'block';
    sunIcon.style.display = 'none';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    
    if (body.classList.contains('light-mode')) {
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
    } else {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    }
});

// Auto Set Active Navigation Based on Current Page
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navItems.forEach(item => {
        item.classList.remove('active');
        
        const href = item.getAttribute('href');
        
        // Check if this nav item matches current page
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (href === 'index.html' && (currentPage === 'index.html' || currentPage === '')) ||
            (href === 'encrypt.html' && currentPage === 'encrypt.html') ||
            (href === 'docs.html' && currentPage === 'docs.html')) {
            item.classList.add('active');
        }
    });
});

// Navigation Click Handler
const navItems = document.querySelectorAll('.bottom-nav .nav-item');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');        
        if (href && href.startsWith('#')) {
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }                        
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        }        
    });
});

// Smooth Scroll for All Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#" or if it's a nav item
        if (href === '#' || this.closest('.bottom-nav')) return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Header height offset
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});
