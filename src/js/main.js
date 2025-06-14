// This file contains the JavaScript code for the portfolio. It can handle interactivity, such as form submissions or animations.

document.addEventListener('DOMContentLoaded', () => {
    // Example: Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Example: Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle form submission logic here
            alert('Form submitted!');
        });
    }
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Mobile menu toggle functionality - Enhanced version
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        // Toggle mobile menu
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Hide mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
        
        // Hide mobile menu when window resizes to desktop size
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) { // md breakpoint in Tailwind
                mobileMenu.classList.add('hidden');
            }
        });
        
        // Hide mobile menu when link is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
    
    // Theme toggle functionality - Enhanced version
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleText = document.getElementById('theme-toggle-text');
    
    if (themeToggleBtn && themeToggleText) {
        // Function to update button text
        const updateButtonText = (isDark) => {
            themeToggleText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        };

        // Force initial state
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            updateButtonText(true);
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            updateButtonText(false);
        }

        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            if (isDark) {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
                localStorage.theme = 'light';
            } else {
                document.documentElement.classList.remove('light');
                document.documentElement.classList.add('dark');
                localStorage.theme = 'dark';
            }
            
            // Update button text with fade effect
            themeToggleText.style.opacity = '0';
            setTimeout(() => {
                updateButtonText(!isDark);
                themeToggleText.style.opacity = '1';
            }, 150);
        });
    }
    
    // Minimalist interactive background canvas - responsive to theme
    const canvas = document.getElementById('background-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 25; // Reduced from 100 for minimalist look
        
        // Set canvas to full window size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Minimalist particle class
        class MinimalParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5; // Much smaller particles
                this.speedX = (Math.random() - 0.5) * 0.5; // Slower movement
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.3 + 0.1; // Low opacity
                this.updateColor();
            }
            
            updateColor() {
                const isDarkMode = document.documentElement.classList.contains('dark');
                if (isDarkMode) {
                    this.color = `rgba(127, 255, 212, ${this.opacity})`; // Aqua glow for dark mode
                } else {
                    this.color = `rgba(0, 191, 166, ${this.opacity})`; // Teal for light mode
                }
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Bounce off edges gently
                if (this.x > canvas.width || this.x < 0) {
                    this.speedX = -this.speedX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.speedY = -this.speedY;
                }
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Initialize particles
        function init() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new MinimalParticle());
            }
        }
        
        // Update particle colors based on theme
        function updateParticleColors() {
            particles.forEach(particle => {
                particle.updateColor();
            });
        }
        
        // Minimal connection lines (only nearby particles)
        function drawMinimalConnections() {
            const maxDistance = 120; // Shorter connection distance
            const isDarkMode = document.documentElement.classList.contains('dark');
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.1; // Very subtle lines
                        ctx.beginPath();
                        if (isDarkMode) {
                            ctx.strokeStyle = `rgba(127, 255, 212, ${opacity})`; // Aqua glow
                        } else {
                            ctx.strokeStyle = `rgba(0, 191, 166, ${opacity})`; // Teal
                        }
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Create subtle gradient background
        function drawGradientBackground() {
            const isDarkMode = document.documentElement.classList.contains('dark');
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
            );
            
            if (isDarkMode) {
                gradient.addColorStop(0, 'rgba(13, 13, 13, 0.6)'); // Deep black center
                gradient.addColorStop(1, 'rgba(31, 31, 31, 0.2)'); // Dark gray edges
            } else {
                gradient.addColorStop(0, 'rgba(240, 248, 255, 0.4)'); // Light blue center
                gradient.addColorStop(1, 'rgba(240, 248, 255, 0.1)'); // Almost transparent edges
            }
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw subtle gradient background
            drawGradientBackground();
            
            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            
            // Draw minimal connections
            drawMinimalConnections();
            
            requestAnimationFrame(animate);
        }
        
        // Subtle mouse interaction
        let mouse = {
            x: null,
            y: null,
            radius: 100
        };
        
        window.addEventListener('mousemove', function(event) {
            mouse.x = event.x;
            mouse.y = event.y;
            
            // Gentle particle attraction to cursor
            for (let i = 0; i < particles.length; i++) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouse.radius - distance) / mouse.radius;
                    particles[i].x += Math.cos(angle) * force * 0.5; // Gentle movement
                    particles[i].y += Math.sin(angle) * force * 0.5;
                }
            }
        });
        
        // Reset mouse position when cursor leaves window
        window.addEventListener('mouseleave', function() {
            mouse.x = null;
            mouse.y = null;
        });
        
        // Listen for theme changes to update colors
        const themeObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    updateParticleColors();
                }
            });
        });
        
        themeObserver.observe(document.documentElement, { attributes: true });
        
        // Initialize and start animation
        init();
        updateParticleColors();
        animate();
    }
    
    // Scroll reveal functionality
    function initScrollReveal() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    // Optional: stop observing after reveal
                    // observer.unobserve(entry.target);
                } else {
                    // Optional: hide elements when they're out of view
                    // entry.target.classList.remove('reveal-visible');
                }
            });
        }, options);

        // Observe all elements with reveal-on-scroll class
        document.querySelectorAll('.reveal-on-scroll').forEach(element => {
            observer.observe(element);
        });
    }

    // Initialize scroll reveal
    initScrollReveal();
});