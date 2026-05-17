/* ═══════════════════════════════════════════════════
   ZUKISA NXESI – PORTFOLIO SCRIPT
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ────────────────────────────────
       THEME TOGGLE  (fixed)
    ──────────────────────────────── */
    const html      = document.documentElement;
    const themeBtn  = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    // Read saved preference; default to light
    const saved = localStorage.getItem('zn-theme') || 'light';
    applyTheme(saved);

    themeBtn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next    = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('zn-theme', next);
    });

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
        // Redraw canvas so particle colours match new theme
        if (typeof drawFrame === 'function') drawFrame();
    }


    /* ────────────────────────────────
       HAMBURGER MENU
    ──────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.querySelector('.nav-menu');

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


    /* ────────────────────────────────
       SMOOTH SCROLL
    ──────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    /* ────────────────────────────────
       ACTIVE NAV LINK ON SCROLL
    ──────────────────────────────── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => navObserver.observe(s));


    /* ────────────────────────────────
       TYPING ANIMATION
    ──────────────────────────────── */
    const phrases = [
        'Software Developer',
        'BSc IT Graduate',
        'Honours CS Student',
        
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;
    const typingEl = document.getElementById('typingText');

    function type() {
        if (!typingEl) return;
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
        setTimeout(type, deleting ? 50 : 95);
    }
    type();


    /* ────────────────────────────────
       SKILL BAR ANIMATION
    ──────────────────────────────── */
    const skillBars = document.querySelectorAll('.skill-bar-fill[data-pct]');

    const barObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.width = entry.target.dataset.pct + '%';
                }, 200);
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(b => barObserver.observe(b));


    /* ────────────────────────────────
       SCROLL REVEAL
    ──────────────────────────────── */
    const revealEls = document.querySelectorAll(
        '.project-card, .comp-card, .lang-card, .db-card, .edu-card, .ci-card, .skills-block, .ps-link, .ff-item'
    );

    revealEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 55);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));


    /* ────────────────────────────────
       CONTACT FORM  (Formspree – same
       endpoint as original, with inline
       status instead of notification)
    ──────────────────────────────── */
    const contactForm = document.getElementById('contactForm');
    const submitBtn   = document.getElementById('submitBtn');
    const formStatus  = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameVal    = document.getElementById('name').value.trim();
            const emailVal   = document.getElementById('email').value.trim();
            const messageVal = document.getElementById('message').value.trim();

            // Basic validation
            if (!nameVal || !emailVal || !messageVal) {
                showStatus('❌ Please fill in all fields.', 'error');
                return;
            }
            const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailReg.test(emailVal)) {
                showStatus('❌ Please enter a valid email address.', 'error');
                return;
            }

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
            hideStatus();

            try {
                const res = await fetch('https://formspree.io/f/xlgwkllk', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameVal,
                        email: emailVal,
                        message: messageVal,
                        _replyto: emailVal,
                        _subject: `Portfolio contact from ${nameVal}`
                    })
                });

                if (res.ok) {
                    showStatus('✅ Message sent! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || 'Send failed');
                }
            } catch (err) {
                console.error(err);
                showStatus('❌ Failed to send. Please email me directly at zukisanxesi4@gmail.com', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            }
        });
    }

    function showStatus(msg, type) {
        if (!formStatus) return;
        formStatus.textContent = msg;
        formStatus.className = 'form-status ' + type;
        formStatus.style.display = 'block';
        formStatus.style.visibility = 'visible';
        formStatus.style.opacity = '1';
        // Scroll it into view on mobile
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        // Auto-hide success after 7 seconds
        if (type === 'success') {
            setTimeout(hideStatus, 7000);
        }
    }
    function hideStatus() {
        if (!formStatus) return;
        formStatus.style.display = 'none';
    }


    /* ────────────────────────────────
       CANVAS BACKGROUND
       Dev-themed floating particles
    ──────────────────────────────── */
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const CODE_SNIPPETS = ['{ }', '</>', '();', '=>', '&&', '||', '++', '--', 'fn()', '[]', '#!', '0x', 'new', 'var', 'const', 'let'];

    let particles = [];
    let rafId;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function getColors() {
        const dark = html.getAttribute('data-theme') === 'dark';
        return {
            dot:  dark ? 'rgba(77,184,255,'  : 'rgba(26,108,240,',
            line: dark ? 'rgba(0,234,255,'   : 'rgba(26,108,240,',
        };
    }

    function makeParticle() {
        return {
            x:  Math.random() * canvas.width,
            y:  Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r:  Math.random() * 1.8 + 0.8,
            label: Math.random() > 0.68
                ? CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]
                : null,
            op: Math.random() * 0.4 + 0.15,
        };
    }

    function initParticles() {
        const n = Math.min(90, Math.floor(window.innerWidth / 16));
        particles = Array.from({ length: n }, makeParticle);
    }

    // Exposed so applyTheme can call it
    window.drawFrame = function drawFrame() {
        if (rafId) cancelAnimationFrame(rafId);
        const c = getColors();

        function frame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Lines between close particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx   = particles[i].x - particles[j].x;
                    const dy   = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.strokeStyle = c.line + (0.12 * (1 - dist / 110)) + ')';
                        ctx.lineWidth   = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Dots + code labels
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0)            p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0)            p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = c.dot + p.op + ')';
                ctx.fill();

                if (p.label) {
                    ctx.font      = '9px "Space Mono", monospace';
                    ctx.fillStyle = c.dot + (p.op * 0.75) + ')';
                    ctx.fillText(p.label, p.x + 5, p.y - 5);
                }
            });

            rafId = requestAnimationFrame(frame);
        }

        frame();
    };

    resize();
    initParticles();
    drawFrame();

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });

});
