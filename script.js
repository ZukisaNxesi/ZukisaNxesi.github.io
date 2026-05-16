/* ═══════════════════════════════════════════════════
   ZUKISA NXESI – PORTFOLIO SCRIPT
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── THEME TOGGLE ── */
    const root = document.documentElement;
    const themeBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const savedTheme = localStorage.getItem('zn-theme') || 'light';
    root.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeBtn.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        localStorage.setItem('zn-theme', next);
        updateThemeIcon(next);
        drawCanvas(); // Redraw canvas with correct colours
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    /* ── HAMBURGER MENU ── */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        hamburger.classList.toggle('open');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburger.classList.remove('open');
        });
    });

    /* ── SMOOTH SCROLL ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ── ACTIVE NAV ON SCROLL ── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    const observerNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => observerNav.observe(s));

    /* ── TYPING ANIMATION ── */
    const phrases = [
        'Software Developer',
        'BSc IT Graduate',
        'AI & NLP Enthusiast',
        'Full-Stack Builder',
        'Problem Solver',
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;
    const typingEl = document.getElementById('typingText');

    function type() {
        const phrase = phrases[phraseIdx];
        if (!deleting) {
            typingEl.textContent = phrase.slice(0, ++charIdx);
            if (charIdx === phrase.length) {
                deleting = true;
                setTimeout(type, 1800);
                return;
            }
        } else {
            typingEl.textContent = phrase.slice(0, --charIdx);
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
            }
        }
        setTimeout(type, deleting ? 55 : 100);
    }
    type();

    /* ── ANIMATED COUNTER (quick stats) ── */
    const counters = document.querySelectorAll('.qs-num[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                let current = 0;
                const step = Math.ceil(target / 30);
                const interval = setInterval(() => {
                    current = Math.min(current + step, target);
                    el.textContent = current + (target >= 5 ? '+' : '');
                    if (current >= target) clearInterval(interval);
                }, 40);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    /* ── SKILL BAR ANIMATION ── */
    const skillBars = document.querySelectorAll('.skill-bar-fill[data-pct]');

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                setTimeout(() => {
                    bar.style.width = bar.dataset.pct + '%';
                }, 200);
                barObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(b => barObserver.observe(b));

    /* ── SCROLL REVEAL ── */
    const revealEls = document.querySelectorAll(
        '.project-card, .soft-card, .comp-card, .lang-card, .db-card, .edu-card, .qs-item, .ci-card, .skills-block'
    );

    revealEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 60);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ── CONTACT FORM ── */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showNotification('❌ Please fill in all fields', 'error');
                return;
            }

            const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailReg.test(email)) {
                showNotification('❌ Please enter a valid email address', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

            try {
                const res = await fetch('https://formspree.io/f/xlgwkllk', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ name, email, message, _replyto: email, _subject: `Portfolio contact from ${name}` })
                });

                if (res.ok) {
                    showNotification('✅ Message sent! I'll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Send failed');
                }
            } catch {
                showNotification('❌ Failed to send. Please email me directly.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            }
        });
    }

    function showNotification(msg, type) {
        let n = document.querySelector('.notification');
        if (!n) { n = document.createElement('div'); n.className = 'notification'; document.body.appendChild(n); }
        n.textContent = msg;
        n.className = `notification ${type}`;
        clearTimeout(n._timeout);
        n._timeout = setTimeout(() => { n.style.display = 'none'; }, 5000);
        n.style.display = 'block';
    }

    /* ── CANVAS BACKGROUND (dev-themed particles) ── */
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const CODE_SNIPPETS = ['{ }', '</>', '();', '=>', '&&', '||', '==', '!=', '++', '--', 'fn()', '[]', '#!', '0x', '*/'];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function getColors() {
        const dark = root.getAttribute('data-theme') === 'dark';
        return {
            particle: dark ? 'rgba(77,184,255,' : 'rgba(26,108,240,',
            line: dark ? 'rgba(0,234,255,' : 'rgba(26,108,240,',
        };
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2 + 1,
            label: Math.random() > 0.7 ? CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)] : null,
            opacity: Math.random() * 0.5 + 0.2,
        };
    }

    function initParticles() {
        const count = Math.min(80, Math.floor(window.innerWidth / 18));
        particles = Array.from({ length: count }, createParticle);
    }

    function drawCanvas() {
        if (animId) cancelAnimationFrame(animId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const c = getColors();

        function frame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Connect close particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = c.line + (0.15 * (1 - dist / 120)) + ')';
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = c.particle + p.opacity + ')';
                ctx.fill();

                if (p.label) {
                    ctx.font = '10px "Space Mono", monospace';
                    ctx.fillStyle = c.particle + (p.opacity * 0.8) + ')';
                    ctx.fillText(p.label, p.x + 5, p.y - 5);
                }
            });

            animId = requestAnimationFrame(frame);
        }

        frame();
    }

    resize();
    initParticles();
    drawCanvas();

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });

});
