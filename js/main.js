// Form Validation and UI Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all forms with validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Status Check Form Handling
    const statusCheckForm = document.getElementById('statusCheckForm');
    if (statusCheckForm) {
        const applicationIdInput = document.getElementById('applicationId');
        const statusResult = document.getElementById('statusResult');
        
        // Add input validation
        applicationIdInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-z0-9-]/g, '');
        });

        statusCheckForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!applicationIdInput.value.trim()) {
                statusResult.innerHTML = `
                    <div class="alert alert-warning animate-fade-in">
                        <h5><i class="fas fa-exclamation-triangle me-2"></i>Invalid Application ID</h5>
                        <p class="mb-0">Please enter a valid application ID to check the status.</p>
                    </div>
                `;
                return;
            }

            // Show loading state
            statusResult.innerHTML = `
                <div class="alert alert-info animate-fade-in">
                    <h5><i class="fas fa-spinner fa-spin me-2"></i>Checking Status</h5>
                    <p class="mb-0">Please wait while we retrieve your application status...</p>
                </div>
            `;

            // Simulate API call
            setTimeout(() => {
                const applicationId = applicationIdInput.value.trim();
                const statuses = ['Processing', 'Under Review', 'Approved', 'Rejected'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                const statusClass = randomStatus === 'Approved' ? 'success' : 
                                  randomStatus === 'Rejected' ? 'danger' : 'warning';
                
                statusResult.innerHTML = `
                    <div class="alert alert-${statusClass} animate-fade-in">
                        <h5><i class="fas fa-info-circle me-2"></i>Application Status</h5>
                        <p class="mb-0">Your application (ID: ${applicationId}) is currently <strong>${randomStatus}</strong></p>
                        ${randomStatus === 'Approved' ? '<p class="mt-2 mb-0"><i class="fas fa-check-circle me-2"></i>Your visa has been approved. You can download it from your dashboard.</p>' : ''}
                        ${randomStatus === 'Rejected' ? '<p class="mt-2 mb-0"><i class="fas fa-times-circle me-2"></i>Your application has been rejected. Please contact support for more information.</p>' : ''}
                    </div>
                `;
            }, 1500);
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                navbar.style.padding = '1rem 0';
                navbar.style.boxShadow = 'none';
                return;
            }
            
            if (currentScroll > lastScroll) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
                navbar.style.padding = '0.5rem 0';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
            
            lastScroll = currentScroll;
        });
    }

    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-fade-in');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial check for elements in view
    animateOnScroll();
    
    // Check for elements in view on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Mobile Menu Toggle with improved animation
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navbarToggler.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            navbarCollapse.classList.toggle('show');
            
            // Toggle aria-expanded
            const expanded = navbarToggler.getAttribute('aria-expanded') === 'true' || false;
            navbarToggler.setAttribute('aria-expanded', !expanded);
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const navbarToggler = document.querySelector('.navbar-toggler');
        
        if (navbarCollapse && navbarCollapse.classList.contains('show') && 
            !navbarCollapse.contains(e.target) && 
            !navbarToggler.contains(e.target)) {
            navbarCollapse.classList.remove('show');
            navbarToggler.setAttribute('aria-expanded', 'false');
        }
    });
}); 