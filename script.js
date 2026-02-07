const initCanvas = () => {
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 60; // Number of particles
    const connectionDistance = 100;
    const mouseDistance = 150;

    // Resize handling
    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking
    const mouse = { x: undefined, y: undefined };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1; // Velocity X
            this.vy = (Math.random() - 0.5) * 1; // Velocity Y
            this.size = Math.random() * 3 + 1;
            // Valentine colors: Pinks, Reds, soft Purples
            const colors = ['#ff3366', '#ff99cc', '#a29bfe', '#fab1a0'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Mouse Interaction (Repulsion)
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouseDistance;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouseDistance) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Return to natural movement
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }

            // Natural Movement
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;

            this.draw();
        }
    }

    // Init Particles
    const initParticles = () => {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };
    initParticles();

    // Animation Loop
    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        // Draw connections (optional, for "constellation" effect)
        // Leaving out for cleaner "floating bubbles" look suited for Valentine's, 
        // but can add lines if preferred.

        particles.forEach(particle => particle.update());
        requestAnimationFrame(animate);
    };
    animate();
};

document.addEventListener('DOMContentLoaded', () => {
    initCanvas(); // Initialize Background

    const prefBtns = document.querySelectorAll('.pref-btn');
    const registrationSection = document.getElementById('registration-section');
    const selectedPrefDisplay = document.getElementById('selected-pref-display');
    const prefInput = document.getElementById('preference');
    const form = document.getElementById('signup-form');

    // Handle Preference Selection
    prefBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            prefBtns.forEach(b => b.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');

            // Get preference value
            const pref = btn.getAttribute('data-pref');

            // Update UI/State
            selectedPrefDisplay.textContent = pref === 'Any' ? "Surprise Me!" : `A ${pref}`;
            prefInput.value = pref;

            // Show Form with animation
            registrationSection.classList.remove('hidden');

            // Smooth scroll to form
            registrationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Handle Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;

        // Basic loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phoneNo: document.getElementById('phone').value,
            preference: prefInput.value
        };

        try {
            await sendData(formData);

            // Hide form and show success message
            form.style.display = 'none';
            form.parentElement.querySelector('p').style.display = 'none'; // Hide intro text
            form.parentElement.querySelector('h3').style.display = 'none'; // Hide title

            const successMsg = document.getElementById('success-message');
            successMsg.classList.remove('hidden');

            // Confetti effect (optional simplified version or just scrolling)
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

        } catch (error) {
            console.error(error);
            alert('Oops! Something went wrong. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
});
