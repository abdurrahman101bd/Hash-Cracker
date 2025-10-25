// 🔹 Theme & Mobile Menu Script
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('nav');

// Theme Toggle
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  mobileMenuBtn.classList.toggle('active');
  nav.classList.toggle('active');
});

// Close menu when clicking nav links
const navLinks = nav.querySelectorAll('a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (nav.classList.contains('active') && 
      !nav.contains(e.target) && 
      !mobileMenuBtn.contains(e.target)) {
    nav.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
  }
});

// Smooth scroll for anchor links
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

// Table of Contents Toggle
const tocToggle = document.getElementById('tocToggle');
const tocFloating = document.getElementById('tocFloating');
const tocClose = document.getElementById('tocClose');
const tocLinks = document.querySelectorAll('.toc-links a');

if (tocToggle) {
  tocToggle.addEventListener('click', () => {
    tocFloating.classList.add('active');
  });
}

if (tocClose) {
  tocClose.addEventListener('click', () => {
    tocFloating.classList.remove('active');
  });
}

// Close TOC when clicking outside
document.addEventListener('click', (e) => {
  if (tocFloating && tocFloating.classList.contains('active')) {
    if (!tocFloating.contains(e.target) && !tocToggle.contains(e.target)) {
      tocFloating.classList.remove('active');
    }
  }
});

// Smooth Scroll for TOC Links
tocLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Update active state
    tocLinks.forEach(a => a.classList.remove('active'));
    this.classList.add('active');
    
    // Smooth scroll to section
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      targetSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Close TOC on mobile after clicking
      if (window.innerWidth <= 768) {
        tocFloating.classList.remove('active');
      }
    }
  });
});

// Update active link on scroll
const sections = document.querySelectorAll('.doc-section');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollY >= sectionTop - 150) {
      current = section.getAttribute('id');
    }
  });
  
  tocLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// Back to Top Button
const scrollToTopBtn = document.querySelector('.scroll-to-top');

if (scrollToTopBtn) {
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  });
}

// Animate sections on scroll (Intersection Observer)
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all animated elements
const animatedElements = document.querySelectorAll('.feature-card, .algo-card, .download-card, .property-item, .type-card');

animatedElements.forEach(el => {
  sectionObserver.observe(el);
});


// Copy code from code-box on click
const codeBoxes = document.querySelectorAll('.code-box pre');

codeBoxes.forEach(codeBox => {
  codeBox.style.cursor = 'pointer';
  codeBox.title = 'Click to copy';
  
  codeBox.addEventListener('click', () => {
    const text = codeBox.textContent;
    
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
      // Show success message
      const message = document.createElement('div');
      message.textContent = '✅ Copied to clipboard!';
      message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 15px rgba(16,185,129,0.3);
      `;
      
      document.body.appendChild(message);
      
      setTimeout(() => {
        message.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => message.remove(), 300);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  });
});

// Add copy button to code boxes
codeBoxes.forEach(codeBox => {
  const parent = codeBox.parentElement;
  
  if (!parent.querySelector('.copy-code-btn')) {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-code-btn';
    copyBtn.innerHTML = '📋 Copy';
    copyBtn.style.cssText = `
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(246,233,107,0.2);
      border: 2px solid var(--yellow);
      color: var(--yellow);
      padding: 8px 15px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.3s;
      z-index: 10;
    `;
    
    parent.style.position = 'relative';
    parent.appendChild(copyBtn);
    
    copyBtn.addEventListener('mouseenter', () => {
      copyBtn.style.background = 'var(--yellow)';
      copyBtn.style.color = '#222';
    });
    
    copyBtn.addEventListener('mouseleave', () => {
      copyBtn.style.background = 'rgba(246,233,107,0.2)';
      copyBtn.style.color = 'var(--yellow)';
    });
    
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = codeBox.textContent;
      
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.innerHTML = '✅ Copied!';
        copyBtn.style.background = '#10b981';
        copyBtn.style.borderColor = '#10b981';
        copyBtn.style.color = 'white';
        
        setTimeout(() => {
          copyBtn.innerHTML = '📋 Copy';
          copyBtn.style.background = 'rgba(246,233,107,0.2)';
          copyBtn.style.borderColor = 'var(--yellow)';
          copyBtn.style.color = 'var(--yellow)';
        }, 2000);
      });
    });
  }
});

// Animate timeline items on scroll
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }, index * 150);
    }
  });
}, { threshold: 0.2 });

timelineItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-30px)';
  item.style.transition = 'all 0.6s ease';
  timelineObserver.observe(item);
});

// Add reading progress bar
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--yellow), var(--accent));
  width: 0%;
  z-index: 9999;
  transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrolled = window.scrollY;
  const progress = (scrolled / documentHeight) * 100;
  
  progressBar.style.width = progress + '%';
});

// Easter egg - Konami Code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiPattern.join(',')) {
    // Easter egg activated!
    document.body.style.animation = 'rainbow 2s infinite';
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
      document.body.style.animation = '';
      style.remove();
    }, 5000);
    
    console.log('🎉 Konami Code activated!');
  }
});
