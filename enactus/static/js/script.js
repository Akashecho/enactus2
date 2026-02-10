// =============================================
// COUNTING ANIMATION - STATS SECTION
// =============================================

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    const easeOutQuad = t => t * (2 - t);

    let frame = 0;
    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentCount = Math.round(target * progress);

        // Format large numbers with K suffix
        if (target >= 10000) {
            element.textContent = (currentCount / 1000).toFixed(1) + 'k' + suffix;
        } else {
            element.textContent = currentCount + suffix;
        }

        if (frame === totalFrames) {
            clearInterval(counter);
            // Final value formatting
            if (target >= 10000) {
                element.textContent = (target / 1000).toFixed(0) + 'k' + suffix;
            } else {
                element.textContent = target + suffix;
            }
        }
    }, frameDuration);
}

function initCountingAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number, .home-stat-number');
    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

// =============================================
// PAST PROJECTS INFINITE SCROLL
// =============================================

function initPastProjectsScroll() {
    const track = document.querySelector('.past-projects-track');
    if (!track) return;

    // Clone items for infinite scroll effect
    const items = track.innerHTML;
    track.innerHTML = items + items;
}

// =============================================
// SMOOTH SCROLL FOR ANCHORS
// =============================================

function initSmoothScroll() {
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
}

// =============================================
// PREMIUM SCROLL-HIDE NAVIGATION
// =============================================

function initScrollHideNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    const hideThreshold = 80; // Only hide after scrolling past this point

    function updateNavState() {
        const currentScrollY = window.scrollY;
        const scrollDiff = currentScrollY - lastScrollY;

        // Always show nav at top of page
        if (currentScrollY <= 20) {
            nav.classList.remove('nav-hidden');
            nav.classList.remove('nav-scrolled');
            lastScrollY = currentScrollY;
            ticking = false;
            return;
        }

        // Add scrolled class for enhanced shadow
        nav.classList.add('nav-scrolled');

        // Scrolling DOWN and past threshold - hide nav
        if (scrollDiff > 5 && currentScrollY > hideThreshold) {
            nav.classList.add('nav-hidden');
        }
        // Scrolling UP - show nav
        else if (scrollDiff < -5) {
            nav.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavState);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Show nav when hovering near top
    document.addEventListener('mousemove', (e) => {
        if (e.clientY < 80 && nav.classList.contains('nav-hidden')) {
            nav.classList.remove('nav-hidden');
        }
    });

    // Debug log to confirm init
    console.log('Scroll-hide nav initialized');
}

// =============================================
// CHARACTER ANIMATION FOR HERO TEXT
// =============================================

function initCharacterAnimation() {
    const chars = document.querySelectorAll('.split-text .char');
    chars.forEach((char, index) => {
        char.style.animationDelay = `${0.1 + (index * 0.05)}s`;
    });
}

// =============================================
// PARALLAX SCROLL EFFECT
// =============================================

function initParallaxEffect() {
    const hero = document.querySelector('.projects-hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = hero.querySelector('.projects-hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
        }
    });
}

// =============================================
// 3D TILT EFFECT FOR PORTRAIT CARDS
// =============================================

function initTiltEffect() {
    const cards = document.querySelectorAll('.portrait-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// =============================================
// GALLERY HORIZONTAL SCROLL
// =============================================

function scrollGallery(direction) {
    const wrapper = document.querySelector('.gallery-scroll-wrapper');
    if (!wrapper) return;

    const scrollAmount = 350;
    wrapper.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

function initGalleryDrag() {
    const wrapper = document.querySelector('.gallery-scroll-wrapper');
    if (!wrapper) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    wrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        wrapper.style.cursor = 'grabbing';
        startX = e.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
    });

    wrapper.addEventListener('mouseleave', () => {
        isDown = false;
        wrapper.style.cursor = 'grab';
    });

    wrapper.addEventListener('mouseup', () => {
        isDown = false;
        wrapper.style.cursor = 'grab';
    });

    wrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 2;
        wrapper.scrollLeft = scrollLeft - walk;
    });

    // Set initial cursor
    wrapper.style.cursor = 'grab';
}

// =============================================
// TEAM DATA - STRUCTURED BY TENURE & CATEGORY
// =============================================

const teamData = {
    "10.0": {
        council: [
            { name: "Arjun Sharma", role: "President", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500", linkedin: "#" },
            { name: "Priya Gupta", role: "Vice President", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500", linkedin: "#" },
            { name: "Rohit Kumar", role: "Secretary", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500", linkedin: "#" },
            { name: "Ananya Singh", role: "Treasurer", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500", linkedin: "#" },
            { name: "Vikram Patel", role: "Joint Secretary", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500", linkedin: "#" }
        ],
        department: [
            { name: "Sneha Reddy", role: "Tech Head", dept: "Technology", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500", linkedin: "#" },
            { name: "Karan Mehta", role: "Design Head", dept: "Design", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500", linkedin: "#" },
            { name: "Neha Agarwal", role: "Marketing Head", dept: "Marketing", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500", linkedin: "#" },
            { name: "Aditya Joshi", role: "Research Head", dept: "Research", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500", linkedin: "#" },
            { name: "Pooja Sharma", role: "Operations Head", dept: "Operations", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500", linkedin: "#" },
            { name: "Rahul Verma", role: "PR Head", dept: "Public Relations", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500", linkedin: "#" }
        ],
        project: [
            { name: "Divya Nair", role: "Project Utkarsh", dept: "Education", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500", linkedin: "#" },
            { name: "Amit Kumar", role: "Project Saksham", dept: "Women Empowerment", img: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=500", linkedin: "#" },
            { name: "Riya Patel", role: "Project Swachh", dept: "Environment", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500", linkedin: "#" },
            { name: "Saurabh Singh", role: "Project Aahar", dept: "Food Security", img: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=500", linkedin: "#" }
        ]
    }
};

// Legacy Data - Past Presidents & Key Leaders
const legacyData = [
    { tenure: "1.0", name: "Dr. Rajendra Prasad", designation: "Founder President", achievement: "Established Foundation" },
    { tenure: "2.0", name: "Anil Kumar Verma", designation: "President", achievement: "First National Recognition" },
    { tenure: "3.0", name: "Sunita Sharma", designation: "President", achievement: "Community Outreach Pioneer" },
    { tenure: "4.0", name: "Vikash Agarwal", designation: "President", achievement: "100+ Volunteers Milestone" },
    { tenure: "5.0", name: "Meera Kapoor", designation: "President", achievement: "International Partnership" },
    { tenure: "6.0", name: "Sanjay Mehta", designation: "President", achievement: "Digital Transformation" },
    { tenure: "7.0", name: "Vivek Sharma", designation: "President", achievement: "Campus Expansion" },
    { tenure: "8.0", name: "Deepak Singh", designation: "President", achievement: "Social Impact Award" },
    { tenure: "9.0", name: "Manish Gupta", designation: "President", achievement: "10,000 Lives Impacted" }
];

// =============================================
// RENDER FUNCTIONS - PORTRAIT CARDS
// =============================================

function renderPortraitCard(member, showDept = false) {
    const deptHtml = showDept && member.dept ? `<span class="portrait-dept">${member.dept}</span>` : '';

    return `
        <div class="portrait-card" data-aos="fade-up">
            <div class="portrait-image">
                <img src="${member.img}" alt="${member.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x500?text=${encodeURIComponent(member.name)}'">
                <div class="portrait-gradient"></div>
            </div>
            <div class="portrait-info">
                <h3 class="portrait-name">${member.name}</h3>
                <span class="portrait-role">${member.role}</span>
                ${deptHtml}
                <div class="portrait-socials">
                    <a href="${member.linkedin || '#'}" target="_blank" aria-label="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>
                    <a href="#" aria-label="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function renderMemberCard(member, showDept = false) {
    const deptHtml = showDept && member.dept ? `<p class="member-dept">${member.dept}</p>` : '';

    return `
        <div class="member-card" data-aos="fade-up">
            <div class="member-avatar">
                <img src="${member.img}" alt="${member.name}" loading="lazy" onerror="this.parentElement.innerHTML='<span>${member.name.split(' ').map(n => n[0]).join('')}</span>'; this.parentElement.classList.add('placeholder');">
            </div>
            <h3 class="member-name">${member.name}</h3>
            <p class="member-role">${member.role}</p>
            ${deptHtml}
            <div class="member-socials">
                <a href="${member.linkedin || '#'}" class="social-link" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </a>
            </div>
        </div>
    `;
}

function renderTeamSection(tenure, category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const members = teamData[tenure]?.[category] || [];

    if (members.length === 0) {
        container.innerHTML = `
            <div class="no-data-message" style="text-align: center; padding: 3rem; color: #7a8b88; grid-column: 1 / -1;">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 15h8M9 9h.01M15 9h.01"></path>
                </svg>
                <p>No team members found for this tenure.</p>
            </div>
        `;
        return;
    }

    const showDept = category !== 'council';
    // Use portrait cards for the new design
    container.innerHTML = members.map(m => renderPortraitCard(m, showDept)).join('');

    // Re-initialize AOS for new elements
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }

    // Initialize tilt effect for new cards
    setTimeout(() => initTiltEffect(), 100);
}

function renderLegacyTable() {
    const tbody = document.getElementById('legacyTableBody');
    if (!tbody) return;

    tbody.innerHTML = legacyData.map(leader => `
        <tr>
            <td><span class="tenure-badge">${leader.tenure}</span></td>
            <td>${leader.name}</td>
            <td>${leader.designation}</td>
            <td><span class="achievement-badge">${leader.achievement}</span></td>
        </tr>
    `).join('');
}

// =============================================
// FILTER & NAVIGATION FUNCTIONS
// =============================================

let currentTenure = "10.0";
let currentCategory = "council";

function filterByTenure() {
    const tenureSelect = document.getElementById('tenureFilter');
    if (!tenureSelect) return;

    currentTenure = tenureSelect.value;
    renderAllSections();
}

function switchCategory(category) {
    currentCategory = category;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });

    // Update sections
    document.querySelectorAll('.category-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(`${category}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function renderAllSections() {
    renderTeamSection(currentTenure, 'council', 'councilContainer');
    renderTeamSection(currentTenure, 'department', 'departmentContainer');
    renderTeamSection(currentTenure, 'project', 'projectContainer');
}

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // Premium Navigation - Scroll Hide
    initScrollHideNav();
    initHamburgerMenu();

    // Projects Page Initialization
    initCountingAnimation();
    initPastProjectsScroll();
    initCharacterAnimation();
    initParallaxEffect();
    initSmoothScroll();

    // Team Page Initialization
    if (document.getElementById('councilContainer')) {
        renderAllSections();
        renderLegacyTable();
    }

    // Gallery drag functionality
    initGalleryDrag();

    // Initialize tilt effect
    initTiltEffect();

    // Legacy Team Grid (Old Implementation - Keep for backward compatibility)
    if (document.getElementById('teamContainer')) {
        renderTeam(teamMembers);
    }
});

// =============================================
// LEGACY CODE - KEEP FOR BACKWARD COMPATIBILITY
// =============================================

// Dummy Data for Team Members (Old)
const teamMembers = [
    { name: "Sarah Jenkins", role: "President", year: "2024", dept: "executive", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500" },
    { name: "Aryan Mehta", role: "Tech Head", year: "2024", dept: "tech", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500" },
    { name: "John Doe", role: "Marketing Lead", year: "2023", dept: "marketing", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500" },
    { name: "Emily Chen", role: "Research Head", year: "2024", dept: "research", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500" },
    { name: "Mike Ross", role: "Ex-President", year: "2022", dept: "executive", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500" },
    { name: "Priya Singh", role: "UI Designer", year: "2024", dept: "tech", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500" }
];

function renderTeam(members) {
    const container = document.getElementById('teamContainer');
    if (!container) return;
    container.innerHTML = '';

    members.forEach(member => {
        const card = `
            <div class="member-card" data-aos="fade-in">
                <img src="${member.img}" alt="${member.name}" class="member-img">
                <h3 style="font-size: 1.5rem;">${member.name}</h3>
                <p style="color: var(--brand-yellow); font-weight: 600;">${member.role}</p>
                <p style="color: #888; font-size: 0.9rem;">${member.year} | ${member.dept.toUpperCase()}</p>
            </div>
        `;
        container.innerHTML += card;
    });
}

function filterTeam() {
    const year = document.getElementById('yearFilter')?.value;
    const dept = document.getElementById('deptFilter')?.value;

    if (!year || !dept) return;

    const filtered = teamMembers.filter(member => {
        const matchYear = year === "all" || member.year === year;
        const matchDept = dept === "all" || member.dept === dept;
        return matchYear && matchDept;
    });

    renderTeam(filtered);
}

// =============================================
// EVENT ACCORDION LOGIC
// =============================================

function toggleEvent(card) {
    // Check if the clicked card is already open
    const isOpen = card.classList.contains('active');

    // Close all cards first (Exclusive Accordion)
    document.querySelectorAll('.event-card').forEach(c => {
        c.classList.remove('active');
    });

    // If it wasn't open, open it now
    if (!isOpen) {
        card.classList.add('active');
    }
}

// Fade out flash messages after 4 seconds
setTimeout(() => {
    const flash = document.querySelector('.flash-messages');
    if (flash) {
        flash.style.transition = "opacity 1s ease";
        flash.style.opacity = 0;
        setTimeout(() => flash.remove(), 1000);
    }
}, 4000);

// =============================================
// HAMBURGER MENU LOGIC
// =============================================

function initHamburgerMenu() {
    const burger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    // Close on link click
    nav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            navLinks.forEach(link => link.style.animation = '');
        }
    });
}
