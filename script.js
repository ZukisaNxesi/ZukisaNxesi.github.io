// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Check for saved theme
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

    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
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

    // Download CV as PDF
    const downloadBtn = document.getElementById('downloadPdfBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create a printable version of the CV
            const printWindow = window.open('', '_blank');
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Zukisa Nxesi - CV</title>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                    <style>
                        body {
                            font-family: 'Inter', sans-serif;
                            padding: 2rem;
                            max-width: 800px;
                            margin: 0 auto;
                            line-height: 1.6;
                        }
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
                    <p>Bachelor of Science in Information Technology (BSc IT) – Graduand</p>
                    <p>North West University</p>
                    
                    <div class="contact">
                        <div>📞 071 664 4892</div>
                        <div>📧 zukisanxesi4@gmail.com</div>
                        <div>📍 13th Avenue, Rooisand, Kathu</div>
                    </div>
                    
                    <div class="section">
                        <h2>PROFESSIONAL PROFILE</h2>
                        <p>Upcoming Information Technology graduate with a strong academic foundation in software development, system analysis and design, databases, and networking. Motivated, adaptable, and eager to contribute technical skills in a professional environment while continuously expanding knowledge.</p>
                    </div>
                    
                    <div class="section">
                        <h2>EDUCATION</h2>
                        <h3>North-West University – Bachelor of Science in Information Technology (2023-2025)</h3>
                        <h3>Mvenyane Senior Secondary School – National Senior Certificate (2018-2022)</h3>
                    </div>
                    
                    <div class="section">
                        <h2>TECHNICAL SKILLS</h2>
                        <p><strong>Programming Languages:</strong> Java, C++, C#, Python, JavaScript, PERN Stack</p>
                        <p><strong>SQL Databases:</strong> MySQL, Database Design & Management</p>
                        <p><strong>Tools:</strong> Git, GitHub, Visual Studio, Code::Blocks, Notepad++</p>
                        <p><strong>Productivity Tools:</strong> Microsoft Excel, Word, PowerPoint, Outlook</p>
                        <p><strong>Core Concepts:</strong> OOP, Databases, Networking, System Design, AI Fundamentals</p>
                    </div>
                    
                    <div class="section">
                        <h2>PROJECTS</h2>
                        <ul>
                            <li>• Student Management System - Full-stack app with authentication, dark mode, PDF reporting</li>
                            <li>• Click-KOS - GitHub project: https://github.com/ZukisaNxesi/click-kos</li>
                            <li>• Developed software systems using Java, C++, and C#</li>
                            <li>• Designed and managed SQL databases with complex queries</li>
                            <li>• Built C# and Java applications using OOP principles</li>
                            <li>• Simulated computer networks using Cisco Packet Tracer</li>
                        </ul>
                    </div>
                    
                    <div class="section">
                        <h2>CAREER OBJECTIVE</h2>
                        <p>To obtain an entry-level position, internship, or graduate programme in Information Technology where I can apply my technical skills and gain practical industry experience.</p>
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
    
    // Contact Form Handling with Formspree
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data - with better error checking
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        // Check if elements exist
        if (!nameInput || !emailInput || !messageInput) {
            console.error('Form inputs not found!');
            showNotification('❌ Form error. Please refresh the page.', 'error');
            return;
        }
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        
        // Debug: Log the values
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Message:', message);
        
        // Validate form data
        if (!name || !email || !message) {
            showNotification('❌ Please fill in all fields', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('❌ Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Send to Formspree
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

            const result = await response.json();
            console.log('Formspree response:', result);

            if (response.ok) {
                // Show success message
                showNotification('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                throw new Error(result.error || 'Something went wrong');
            }
        } catch (error) {
            // Show error message
            console.error('Form error:', error);
            showNotification('❌ Failed to send message. Please email me directly.', 'error');
            
            // Show direct email option as fallback
            setTimeout(() => {
                if (confirm('Would you like to send an email directly instead?')) {
                    window.location.href = `mailto:zukisanxesi4@gmail.com?subject=Contact from ${name}&body=${encodeURIComponent(message)}%0A%0AFrom: ${email}`;
                }
            }, 1000);
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

    // Notification function
    function showNotification(message, type = 'success') {
        // Check if notification container exists, if not create it
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        // Add styles for notification if not already present
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
                
                .notification.success {
                    background: linear-gradient(135deg, #10b981, #059669);
                }
                
                .notification.error {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    // Add active class to nav links on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
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

    // Set initial styles for animation
    document.querySelectorAll('.project-item, .soft-skill, .course-category').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Trigger once on load
});