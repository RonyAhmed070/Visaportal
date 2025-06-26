// Form Validation and UI Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Background Animation
    initBackgroundAnimation();
    
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Add mobile class to body if on mobile device
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }

    // Initialize Background Animation
    function initBackgroundAnimation() {
        const canvas = document.getElementById('background-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        // Mouse position with easing
        let mouseX = width / 2;
        let mouseY = height / 2;
        let targetMouseX = width / 2;
        let targetMouseY = height / 2;
        let mouseRadius = 180;
        let isMouseMoving = false;
        let mouseTimer;
        
        // Track mouse position with easing for smoother interactions
        document.addEventListener('mousemove', function(e) {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
            isMouseMoving = true;
            
            // Reset mouse inactive timer
            clearTimeout(mouseTimer);
            mouseTimer = setTimeout(() => {
                isMouseMoving = false;
            }, 2000);
        });
        
        // Gradient animation parameters
        let gradientAngle = 0;
        const gradientColors = [
            { stop: 0, color: '#f8fafc' },
            { stop: 1, color: '#e3e9f7' }
        ];
        
        // Particle settings - optimized for performance and aesthetics
        const particleCount = isMobile ? 30 : 60;
        const particleBaseSize = isMobile ? 1 : 1.5;
        const particleColors = [
            { color: '#3fa7f4', size: 1.0 },    // Light blue - smallest
            { color: '#4b6cb7', size: 1.2 },    // Medium blue
            { color: '#22304a', size: 0.8 },    // Dark blue - medium
            { color: '#182848', size: 0.7 }     // Very dark blue - smallest
        ];
        const connectionDistance = isMobile ? 120 : 180;
        const connectionOpacity = 0.08;
        
        // Particles array
        let particles = [];
        
        // Create particles with more refined properties
        function createParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                const colorIndex = Math.floor(Math.random() * particleColors.length);
                const colorInfo = particleColors[colorIndex];
                
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: (Math.random() * particleBaseSize + 0.3) * colorInfo.size,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.3,
                    color: colorInfo.color,
                    alpha: 0.7 + Math.random() * 0.3, // Varying opacity
                    originalSpeedX: 0,
                    originalSpeedY: 0,
                    pulseSize: 0,
                    pulseDirection: Math.random() > 0.5 ? 1 : -1
                });
            }
        }
        
        // Draw animated gradient background
        function drawBackground() {
            gradientAngle += 0.001;
            
            // Create a gradient with slight movement
            const grd = ctx.createLinearGradient(
                0, 0, 
                width * Math.cos(gradientAngle), height * Math.sin(gradientAngle)
            );
            
            gradientColors.forEach(color => {
                grd.addColorStop(color.stop, color.color);
            });
            
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, width, height);
        }
        
        // Draw particles and connections with enhanced visual style
        function drawParticles() {
            // Clear with gradient background
            drawBackground();
            
            // Draw connections first (below particles)
            ctx.lineWidth = 0.5;
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < connectionDistance) {
                        // Calculate opacity based on distance - smoother transition
                        const opacity = connectionOpacity * Math.pow(1 - distance / connectionDistance, 1.5);
                        
                        // Create gradient line for more professional look
                        const gradient = ctx.createLinearGradient(
                            particles[i].x, particles[i].y,
                            particles[j].x, particles[j].y
                        );
                        
                        gradient.addColorStop(0, `rgba(34, 48, 74, ${opacity * particles[i].alpha})`);
                        gradient.addColorStop(1, `rgba(34, 48, 74, ${opacity * particles[j].alpha})`);
                        
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = gradient;
                        ctx.stroke();
                    }
                }
            }
            
            // Draw particles with enhanced styles
            particles.forEach(particle => {
                // Calculate pulse effect for size
                particle.pulseSize += 0.01 * particle.pulseDirection;
                if (Math.abs(particle.pulseSize) > 0.2) {
                    particle.pulseDirection *= -1;
                }
                
                const radius = particle.radius * (1 + particle.pulseSize * 0.1);
                
                // Create a radial gradient for each particle
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, radius * 2
                );
                
                const baseColor = particle.color;
                gradient.addColorStop(0, baseColor);
                gradient.addColorStop(0.6, baseColor.replace(')', `, ${particle.alpha})`).replace('rgb', 'rgba'));
                gradient.addColorStop(1, baseColor.replace(')', ', 0)').replace('rgb', 'rgba'));
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            });
        }
        
        // Update particle positions with smoother physics
        function updateParticles() {
            // Update mouse position with easing
            mouseX += (targetMouseX - mouseX) * 0.1;
            mouseY += (targetMouseY - mouseY) * 0.1;
            
            particles.forEach(particle => {
                // Store original speed if not set
                if (particle.originalSpeedX === 0) {
                    particle.originalSpeedX = particle.speedX;
                    particle.originalSpeedY = particle.speedY;
                }
                
                // Mouse interaction with smoother force
                if (isMouseMoving) {
                    const dx = mouseX - particle.x;
                    const dy = mouseY - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouseRadius) {
                        // More natural repulsion with quadratic falloff
                        const force = Math.pow((1 - distance / mouseRadius), 2) * 1.5;
                        const angle = Math.atan2(dy, dx);
                        
                        // Apply force in the opposite direction of mouse
                        particle.speedX -= Math.cos(angle) * force * 0.015;
                        particle.speedY -= Math.sin(angle) * force * 0.015;
                    } else {
                        // Gradually return to original speed when outside mouse influence
                        particle.speedX += (particle.originalSpeedX - particle.speedX) * 0.02;
                        particle.speedY += (particle.originalSpeedY - particle.speedY) * 0.02;
                    }
                } else {
                    // Return to original pattern when mouse is inactive
                    particle.speedX += (particle.originalSpeedX - particle.speedX) * 0.05;
                    particle.speedY += (particle.originalSpeedY - particle.speedY) * 0.05;
                }
                
                // Update positions
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Apply gentle friction for more natural movement
                particle.speedX *= 0.98;
                particle.speedY *= 0.98;
                
                // Bounce off edges with smoother transition
                if (particle.x <= 0 || particle.x >= width) {
                    particle.speedX *= -0.8; // Reduce energy on bounce
                    if (particle.x <= 0) particle.x = 1;
                    if (particle.x >= width) particle.x = width - 1;
                }
                
                if (particle.y <= 0 || particle.y >= height) {
                    particle.speedY *= -0.8; // Reduce energy on bounce
                    if (particle.y <= 0) particle.y = 1;
                    if (particle.y >= height) particle.y = height - 1;
                }
            });
        }
        
        // Animation loop with timing optimization
        let lastTime = 0;
        const fps = 60;
        const interval = 1000 / fps;
        
        function animate(timestamp) {
            if (!lastTime) lastTime = timestamp;
            const deltaTime = timestamp - lastTime;
            
            if (deltaTime > interval) {
                updateParticles();
                drawParticles();
                lastTime = timestamp - (deltaTime % interval);
            }
            
            requestAnimationFrame(animate);
        }
        
        // Handle window resize with debounce for better performance
        let resizeTimeout;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
                createParticles();
            }, 200);
        }
        
        window.addEventListener('resize', handleResize);
        
        // Handle visibility change to pause animation when tab is inactive
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // Pause intensive operations when not visible
            } else {
                // Resume when visible again
                lastTime = 0;
            }
        });
        
        // Initialize
        createParticles();
        requestAnimationFrame(animate);
    }

    // Initialize all forms with validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                
                // Animate invalid fields
                form.querySelectorAll(':invalid').forEach(field => {
                    field.classList.add('shake');
                    field.addEventListener('animationend', () => {
                        field.classList.remove('shake');
                    }, { once: true });
                });
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Initialize Intersection Observer for scroll animations
    // Only use animations if not prefers-reduced-motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    // Stop observing after animation
                    animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all scroll-animate elements
        document.querySelectorAll('.scroll-animate').forEach(element => {
            animationObserver.observe(element);
        });
        
        // Observe all animate-fade-in elements
        document.querySelectorAll('.animate-fade-in').forEach((element, index) => {
            // Add staggered delay based on index
            element.style.transitionDelay = `${index * 0.1}s`;
            animationObserver.observe(element);
        });
    } else {
        // If reduced motion is preferred, just show the elements
        document.querySelectorAll('.scroll-animate, .animate-fade-in').forEach(element => {
            element.classList.add('show');
        });
    }

    // Status Check Form Handling with improved animations
    const statusCheckForm = document.getElementById('statusCheckForm');
    if (statusCheckForm) {
        const applicationIdInput = document.getElementById('applicationId');
        const statusResult = document.getElementById('statusResult');
        
        // Add input validation
        applicationIdInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-z0-9-]/g, '');
        });

        // Helper function to animate status updates
        function updateStatus(type, icon, title, message) {
            const newAlert = document.createElement('div');
            newAlert.className = `alert alert-${type} animate-fade-in`;
            newAlert.innerHTML = `
                <h5><i class="fas fa-${icon} me-2"></i>${title}</h5>
                <p class="mb-0">${message}</p>
            `;

            // Fade out existing content
            if (statusResult.firstChild) {
                statusResult.firstChild.style.opacity = '0';
                statusResult.firstChild.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    statusResult.innerHTML = '';
                    statusResult.appendChild(newAlert);
                    // Force reflow
                    newAlert.offsetHeight;
                    requestAnimationFrame(() => {
                        newAlert.classList.add('show');
                    });
                }, 300);
            } else {
                statusResult.appendChild(newAlert);
                // Force reflow
                newAlert.offsetHeight;
                requestAnimationFrame(() => {
                    newAlert.classList.add('show');
                });
            }
        }

        statusCheckForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!applicationIdInput.value.trim()) {
                updateStatus('warning', 'exclamation-triangle', 'Invalid Application ID', 
                    'Please enter a valid application ID to check the status.');
                return;
            }

            // Show loading state
            updateStatus('info', 'spinner fa-spin', 'Checking Status',
                'Please wait while we retrieve your application status...');

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                const applicationId = applicationIdInput.value.trim();
                const statuses = ['Processing', 'Under Review', 'Approved', 'Rejected'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                
                const statusMessages = {
                    'Processing': 'Your application is being processed. Please check back later.',
                    'Under Review': 'Your application is currently under review by our team.',
                    'Approved': 'Your visa has been approved. You can download it from your dashboard.',
                    'Rejected': 'Your application has been rejected. Please contact support for more information.'
                };

                const statusIcons = {
                    'Processing': 'clock',
                    'Under Review': 'search',
                    'Approved': 'check-circle',
                    'Rejected': 'times-circle'
                };

                const statusTypes = {
                    'Processing': 'warning',
                    'Under Review': 'info',
                    'Approved': 'success',
                    'Rejected': 'danger'
                };

                updateStatus(
                    statusTypes[randomStatus],
                    statusIcons[randomStatus],
                    'Application Status',
                    `Your application (ID: ${applicationId}) is ${randomStatus}. ${statusMessages[randomStatus]}`
                );
            } catch (error) {
                console.error('Status check error:', error);
                updateStatus('danger', 'exclamation-circle', 'Error',
                    'An error occurred while checking the status. Please try again later.');
            }
        });
    }

    // Smooth scroll for anchor links - with better mobile support
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = isMobile ? 60 : 80; // Smaller offset on mobile
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
                });
            }
        });
    });

    // Improved Navbar scroll effect with debounce for better performance
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScroll = 0;
        let scrollTimeout;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScroll = window.pageYOffset;
                    
                    if (currentScroll > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    
                    // Only hide navbar on scroll down if not on mobile
                    // This prevents issues with mobile browsers' address bar
                    if (!isMobile) {
                        if (currentScroll > lastScroll && currentScroll > 80) {
                            navbar.style.transform = 'translateY(-100%)';
                        } else {
                            navbar.style.transform = 'translateY(0)';
                        }
                    }
                    
                    lastScroll = currentScroll;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true }); // Use passive listener for better scroll performance
    }

    // Enhanced Mobile menu animation
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
            
            navbarToggler.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                navbarCollapse.style.display = 'block';
                requestAnimationFrame(() => {
                    navbarCollapse.classList.add('show');
                });
            } else {
                navbarCollapse.classList.remove('show');
                setTimeout(() => {
                    if (!navbarCollapse.classList.contains('show')) {
                        navbarCollapse.style.display = 'none';
                    }
                }, 300);
            }
        });

        // Close menu when clicking outside - improved for touch devices
        document.addEventListener('click', (e) => {
            if (navbarCollapse.classList.contains('show') && 
                !navbarCollapse.contains(e.target) && 
                !navbarToggler.contains(e.target)) {
                navbarToggler.click();
            }
        });
        
        // Close dropdown when clicking a link on mobile
        if (isMobile) {
            const dropdownItems = document.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('click', () => {
                    if (navbarCollapse.classList.contains('show')) {
                        navbarToggler.click();
                    }
                });
            });
        }
    }

    // Add loading animation to buttons when clicked
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 1000);
            }
        });
    });

    // Initialize any tooltips - disable on mobile for better performance
    if (!isMobile) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                animation: !window.matchMedia('(prefers-reduced-motion: reduce)').matches
            });
        });
    }
    
    // Add touch support for cards on mobile
    if (isMobile) {
        const cards = document.querySelectorAll('.card, .feature-card');
        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });
            
            card.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
    }
    
    // Fix for 100vh issue on mobile browsers
    function setMobileHeight() {
        if (isMobile) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
    }
    
    // Set initial height and update on resize
    setMobileHeight();
    window.addEventListener('resize', setMobileHeight);

    // Initialize Premium Hero Stats Counter
    function initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        
        if (statNumbers.length === 0) return;
        
        const options = {
            threshold: 0.3
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const finalValue = parseInt(element.getAttribute('data-count'));
                    
                    // Determine animation duration based on value size
                    const duration = Math.min(Math.max(finalValue / 100, 1), 3) * 1000;
                    const startTime = performance.now();
                    
                    function updateCounter(currentTime) {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);
                        
                        // Use easeOutExpo for smooth counting effect
                        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                        const currentValue = Math.floor(easeProgress * finalValue);
                        
                        element.textContent = currentValue.toLocaleString();
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        }
                    }
                    
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(element);
                }
            });
        }, options);
        
        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }
    
    // Preloader functionality
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                document.body.classList.add('loaded');
                
                // Initialize animations after page load
                initStatsCounter();
                animateHeroElements();
            }, 500);
        });
    }
    
    // Animate hero elements
    function animateHeroElements() {
        // Add animation classes to elements with delay
        const heroElements = document.querySelectorAll('.hero-content > *');
        
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('active');
            }, 100 * (index + 1));
        });
    }
    
    // Initialize stats counter immediately if no preloader
    if (!document.querySelector('.preloader')) {
        initStatsCounter();
        animateHeroElements();
    }
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle 3D tilt effect for hero image
    const heroImageCard = document.querySelector('.hero-image-card');
    if (heroImageCard && !isMobile) {
        const heroImageWrapper = document.querySelector('.hero-image-wrapper');
        
        heroImageWrapper.addEventListener('mousemove', (e) => {
            const rect = heroImageWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
            const yPercent = (y / rect.height - 0.5) * 2; // -1 to 1
            
            heroImageCard.style.transform = `perspective(1200px) rotateY(${xPercent * -5}deg) rotateX(${yPercent * 5}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        heroImageWrapper.addEventListener('mouseleave', () => {
            heroImageCard.style.transform = 'perspective(1200px) rotateY(-5deg) rotateX(3deg)';
        });
    }

    // Custom Trip Type Pills logic
    function setupTripTypePills() {
        const pills = document.querySelectorAll('#tripTypePills .pill');
        const tripTypeInput = document.getElementById('tripTypeInput');
        const returnDateInput = document.getElementById('returnDate');
        pills.forEach(pill => {
            pill.addEventListener('click', function() {
                pills.forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                const value = this.getAttribute('data-value');
                tripTypeInput.value = value;
                // Enable/disable return date
                if (value === 'oneWay' || value === 'multiCity') {
                    returnDateInput.disabled = true;
                    returnDateInput.value = '';
                } else {
                    returnDateInput.disabled = false;
                }
            });
        });
        // Set initial state
        if (tripTypeInput && returnDateInput) {
            if (tripTypeInput.value === 'oneWay' || tripTypeInput.value === 'multiCity') {
                returnDateInput.disabled = true;
                returnDateInput.value = '';
            } else {
                returnDateInput.disabled = false;
            }
        }
    }
    document.addEventListener('DOMContentLoaded', function() {
        setupTripTypePills();
    });
});

// Booking Section Functionality for new Flight & Hotel forms only

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('booking')) {
        initBookingForms();
    }
});

function initBookingForms() {
    // --- FLIGHT FORM LOGIC ---
    const flightForm = document.getElementById('flightBookingForm');
    if (flightForm) {
        // Trip type pills
        const pills = flightForm.querySelectorAll('.pill');
        const tripTypeInput = document.getElementById('tripTypeInput');
        const returnDateInput = document.getElementById('returnDate');
        pills.forEach(pill => {
            pill.addEventListener('click', function() {
                pills.forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                tripTypeInput.value = this.getAttribute('data-value');
            });
        });
        // Swap icon logic
        const fromCity = document.getElementById('fromCity');
        const toCity = document.getElementById('toCity');
        const swapIcon = flightForm.querySelector('.swap-icon');
        if (swapIcon && fromCity && toCity) {
            swapIcon.addEventListener('click', function(e) {
                e.preventDefault();
                const temp = fromCity.value;
                fromCity.value = toCity.value;
                toCity.value = temp;
            });
        }
        // Form submit
        flightForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simple validation
            if (!fromCity.value.trim() || !toCity.value.trim() || !document.getElementById('departDate').value) {
                alert('Please fill in all required fields.');
                return;
            }
            showBookingConfirmation('flight');
        });
    }
    // --- HOTEL FORM LOGIC ---
    const hotelForm = document.getElementById('hotelBookingForm');
    if (hotelForm) {
        hotelForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showBookingConfirmation('hotel');
        });
    }
}

function showBookingConfirmation(type) {
    // Create a modal dynamically
    const modalId = 'bookingConfirmationModal';
    let modal = document.getElementById(modalId);
    
    // If modal doesn't exist, create it
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = modalId;
        modal.tabIndex = '-1';
        modal.setAttribute('aria-labelledby', `${modalId}Label`);
        modal.setAttribute('aria-hidden', 'true');
        
        // Set modal content based on booking type
        let title, message;
        
        switch(type) {
            case 'flight':
                title = 'Flight Booking Confirmation';
                message = 'Your flight search request has been submitted. Our team will contact you shortly with the best available options.';
                break;
            case 'hotel':
                title = 'Hotel Booking Confirmation';
                message = 'Your hotel search request has been submitted. Our team will contact you shortly with the best available options.';
                break;
            case 'package':
                title = 'Package Booking Confirmation';
                message = 'Your travel package request has been submitted. Our team will contact you shortly with the best available options.';
                break;
            case 'transfer':
                title = 'Transfer Booking Confirmation';
                message = 'Your transfer request has been submitted. Our team will contact you shortly with the best available options.';
                break;
            default:
                title = 'Booking Confirmation';
                message = 'Your request has been submitted. Our team will contact you shortly.';
        }
        
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="${modalId}Label">${title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-4">
                            <div class="confirmation-icon bg-primary bg-opacity-10 text-primary mx-auto mb-3">
                                <i class="fas fa-check-circle fa-3x"></i>
                            </div>
                            <h4 class="mb-3">Thank You!</h4>
                            <p>${message}</p>
                        </div>
                        <div class="d-flex justify-content-center">
                            <div class="booking-reference p-3 bg-light rounded-3 text-center">
                                <small class="text-muted d-block mb-1">Booking Reference</small>
                                <span class="fw-bold">${generateBookingReference()}</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Initialize and show the modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

// Generate a random booking reference
function generateBookingReference() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Add CSS for the confirmation modal
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .confirmation-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .booking-reference {
            min-width: 200px;
        }
    `;
    document.head.appendChild(style);
}); 