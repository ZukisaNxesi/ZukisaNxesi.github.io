document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Download CV as PDF
    const downloadBtn = document.getElementById('downloadPdfBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Zukisa Nxesi - CV</title>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }
                        h1 { color: #2563eb; }
                        h2 { color: #1e40af; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem; }
                        .contact { display: flex; gap: 1rem; flex-wrap: wrap; margin: 1rem 0; }
                        .section { margin: 2rem 0; }
                        ul { list-style: none; padding: 0; }
                        li { margin: 0.5rem 0; }
                    </style>
                </head>
                <body>
                    <h1>ZUKISA NXESI</h1>
                    <p>Bachelor of Science in Information Technology (BSc IT) – Graduate</p>
                    <p>North West University | University of Pretoria (Postgraduate)</p>
                    <div class="contact">
                        <div>📞 071 664 4892</div>
                        <div>📧 zukisanxesi4@gmail.com</div>
                        <div>📍 122 Cuckooshrike St, Rabie Ridge, Midrand 1688</div>
                    </div>
                    <div class="section">
                        <h2>PROFESSIONAL PROFILE</h2>
                        <p>Information Technology graduate with strong foundation in software development, databases, and networking. Currently pursuing advanced studies in AI, Data Mining, NLP, and Software Engineering at University of Pretoria.</p>
                    </div>
                    <div class="section">
                        <h2>EDUCATION</h2>
                        <h3>North-West University – BSc Information Technology (2023-2025)</h3>
                        <h3>University of Pretoria – Postgraduate in Computer Science (2026-Present)</h3>
                        <h3>Mvenyane Senior Secondary School – NSC (2018-2022)</h3>
                    </div>
                    <div class="section">
                        <h2>TECHNICAL SKILLS</h2>
                        <p><strong>Programming:</strong> Java, Python, C++, C#, JavaScript, CSS, PERN Stack</p>
                        <p><strong>Databases:</strong> MySQL, Database Design & Management</p>
                        <p><strong>AI/ML:</strong> Pandas, NumPy, NLTK, AI Fundamentals, Data Mining</p>
                        <p><strong>Tools:</strong> Git, GitHub, Visual Studio</p>
                    </div>
                    <div class="section">
                        <h2>PROJECTS</h2>
                        <ul>
                            <li>• Student Management System - Full-stack app with auth, dark mode, PDF reporting</li>
                            <li>• ZukiChat - Real-time chat app with React, Node.js, Socket.io</li>
                            <li>• Shopping List App - Full-stack with React, Supabase, Cloudinary</li>
                            <li>• Click-KOS - GitHub project</li>
                        </ul>
                    </div>
                    <div class="section">
                        <h2>CAREER OBJECTIVE</h2>
                        <p>To obtain an entry-level position, internship, or graduate programme in Information Technology or Computer Science where I can apply my technical skills, AI knowledge, and gain practical industry experience while contributing to innovative solutions.</p>
                    </div>
                    <p><em>References available upon request.</em></p>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        });
    }

    // Contact Form Handling with Formspree
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            if (!nameInput || !emailInput || !messageInput) {
                showNotification('❌ Form error. Please refresh the page.', 'error');
                return;
            }
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            
            if (!name || !email || !message) {
                showNotification('❌ Please fill in all fields', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('❌ Please enter a valid email address', 'error');
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('https://formspree.io/f/xlgwkllk', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message,
                        _replyto: email,
                        _subject: `New message from ${name} - Web CV`
                    })
                });

                if (response.ok) {
                    showNotification('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Something went wrong');
                }
            } catch (error) {
                showNotification('❌ Failed to send message. Please email me directly.', 'error');
                setTimeout(() => {
                    if (confirm('Would you like to send an email directly instead?')) {
                        window.location.href = `mailto:zukisanxesi4@gmail.com?subject=Contact from ${name}&body=${encodeURIComponent(message)}%0A%0AFrom: ${email}`;
                    }
                }, 1000);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Notification function
    function showNotification(message, type = 'success') {
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
            
            if (!document.querySelector('#notification-style')) {
                const style = document.createElement('style');
                style.id = 'notification-style';
                style.textContent = `
                    .notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 1rem 2rem;
                        border-radius: 5px;
                        color: white;
                        font-weight: 500;
                        z-index: 10000;
                        animation: slideIn 0.3s ease;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                        max-width: 350px;
                    }
                    .notification.success { background: linear-gradient(135deg, #10b981, #059669); }
                    .notification.error { background: linear-gradient(135deg, #ef4444, #dc2626); }
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    // Active nav link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.project-item, .skill-tags span, .soft-skill, .course-category');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    document.querySelectorAll('.project-item, .soft-skill, .course-category').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});
