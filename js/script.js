
let parties = JSON.parse(localStorage.getItem('invito_parties') || '[]');
let nextId = JSON.parse(localStorage.getItem('invito_nextId') || '1');
let members = JSON.parse(localStorage.getItem('invito_members') || '[]');

const landingPage = document.getElementById('landingPage');
const mainApp = document.getElementById('mainApp');
const enterBtn = document.getElementById('enterBtn');

const createPartyBtn = document.getElementById('createPartyBtn');
const formModal = document.getElementById('formModal');
const closeFormBtn = document.getElementById('closeFormBtn');
const cancelFormBtn = document.getElementById('cancelFormBtn');
const partyForm = document.getElementById('partyForm');
const partiesGrid = document.getElementById('partiesGrid');

const celebrationModal = document.getElementById('celebrationModal');
const closeCelebrationBtn = document.getElementById('closeCelebrationBtn');

const eventDetailPage = document.getElementById('eventDetailPage');
const mainContent = document.getElementById('mainContent');
const backToGridBtn = document.getElementById('backToGridBtn');
const printBtn = document.getElementById('printBtn');
const shareBtn = document.getElementById('shareBtn');

const invEventName = document.getElementById('invEventName');
const invDate = document.getElementById('invDate');
const invTime = document.getElementById('invTime');
const invLocation = document.getElementById('invLocation');
const invDescription = document.getElementById('invDescription');
const invDescRow = document.getElementById('invDescRow');

const navEvents = document.getElementById('navEvents');
const navGallery = document.getElementById('navGallery');
const navVenues = document.getElementById('navVenues');
const navTestimonials = document.getElementById('navTestimonials');
const navContact = document.getElementById('navContact');
const navMembership = document.getElementById('navMembership');

const membershipSection = document.getElementById('membershipSection');
const gallerySection = document.getElementById('gallerySection');
const venuesSection = document.getElementById('venuesSection');
const testimonialsSection = document.getElementById('testimonialsSection');
const contactSection = document.getElementById('contactSection');

const membershipForm = document.getElementById('membershipForm');
const membershipSuccess = document.getElementById('membershipSuccess');
const membersListSection = document.getElementById('membersListSection');
const membersList = document.getElementById('membersList');

const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');
const newsletterForm = document.getElementById('newsletterForm');

const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const noResults = document.getElementById('noResults');
const toastContainer = document.getElementById('toastContainer');
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas.getContext('2d');

const allSections = [mainContent, gallerySection, venuesSection, testimonialsSection, contactSection, membershipSection, eventDetailPage];
const allNavTabs = [navEvents, navGallery, navVenues, navTestimonials, navContact, navMembership];

function saveState() {
    localStorage.setItem('invito_parties', JSON.stringify(parties));
    localStorage.setItem('invito_nextId', JSON.stringify(nextId));
    localStorage.setItem('invito_members', JSON.stringify(members));
}

function showToast(message, type = 'default') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✓', danger: '✕', default: '★' };
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.default}</span><span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

let confettiPieces = [];
let confettiAnimating = false;

function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
resizeConfettiCanvas();
window.addEventListener('resize', resizeConfettiCanvas);

function launchConfetti() {
    confettiPieces = [];
    const colors = ['#d4af37', '#e6c13e', '#c9a961', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce'];
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: -20 - Math.random() * 200,
            w: 6 + Math.random() * 6,
            h: 4 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 4,
            vy: 2 + Math.random() * 4,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            opacity: 1
        });
    }
    if (!confettiAnimating) {
        confettiAnimating = true;
        animateConfetti();
    }
}

function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height + 20 && p.opacity > 0);

    confettiPieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rotation += p.rotSpeed;
        if (p.y > confettiCanvas.height * 0.8) p.opacity -= 0.02;

        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.globalAlpha = Math.max(0, p.opacity);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        confettiCtx.restore();
    });

    if (confettiPieces.length > 0) {
        requestAnimationFrame(animateConfetti);
    } else {
        confettiAnimating = false;
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}

function typeText(element, text, speed = 80) {
    return new Promise(resolve => {
        let i = 0;
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        element.textContent = '';
        element.appendChild(cursor);

        const interval = setInterval(() => {
            element.textContent = text.substring(0, i + 1);
            element.appendChild(cursor);
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                setTimeout(() => {
                    cursor.remove();
                    resolve();
                }, 400);
            }
        }, speed);
    });
}

async function runTypingAnimation() {
    const taglines = [
        { el: document.getElementById('tagline1'), text: 'Be Yourself' },
        { el: document.getElementById('tagline2'), text: 'Stop Stressing' },
        { el: document.getElementById('tagline3'), text: 'Start Celebrating' }
    ];
    for (const t of taglines) {
        await typeText(t.el, t.text, 70);
    }
}

function createParticles() {
    const hero = document.querySelector('.landing-hero');
    if (!hero) return;
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = 2 + Math.random() * 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.bottom = Math.random() * 30 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = 4 + Math.random() * 4 + 's';
        hero.appendChild(particle);
    }
}

function setupScrollReveal() {
    const aboutHeader = document.querySelector('.about-header');
    const aboutCols = document.querySelectorAll('.about-col');
    const aboutStats = document.querySelector('.about-stats');

    if (aboutHeader) aboutHeader.classList.add('reveal');
    if (aboutCols[0]) aboutCols[0].classList.add('reveal-left');
    if (aboutCols[1]) aboutCols[1].classList.add('reveal-right');
    if (aboutStats) aboutStats.classList.add('reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                if (entry.target.classList.contains('about-stats') || entry.target.closest('.about-stats')) {
                    animateStats();
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });
}

let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const text = stat.textContent.trim();
        const hasPlus = text.includes('+');
        const hasK = text.includes('K');
        const numericPart = parseFloat(text.replace(/[^0-9.]/g, ''));
        const target = hasK ? numericPart : numericPart;
        const duration = 2000;
        const startTime = performance.now();

        stat.classList.add('counting');

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * eased);

            let display = hasK ? current + 'K' : String(current);
            if (hasPlus) display += '+';
            stat.textContent = display;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                stat.textContent = text;
                stat.classList.remove('counting');
            }
        }

        requestAnimationFrame(update);
    });
}

function initTheme() {
    const saved = localStorage.getItem('invito_theme');
    if (saved === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.textContent = '🌙';
    }
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeToggle.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('invito_theme', isLight ? 'light' : 'dark');
});

let countdownInterval = null;

function startCountdowns() {
    if (countdownInterval) clearInterval(countdownInterval);
    updateCountdowns();
    countdownInterval = setInterval(updateCountdowns, 1000);
}

function updateCountdowns() {
    const now = new Date();
    parties.forEach(party => {
        const el = document.getElementById(`countdown-${party.id}`);
        if (!el) return;

        const eventDate = new Date(`${party.date}T${party.time}:00`);
        const diff = eventDate - now;

        if (diff <= 0) {
            el.textContent = '🎉 Event has started!';
            el.style.color = 'var(--accent-color)';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        parts.push(`${hours}h ${minutes}m ${seconds}s`);
        el.textContent = parts.join(' ');
    });
}

function getFilteredParties() {
    const query = searchInput.value.toLowerCase().trim();
    const sortBy = sortSelect.value;

    let filtered = parties.filter(p => {
        if (!query) return true;
        return p.name.toLowerCase().includes(query) ||
               p.location.toLowerCase().includes(query) ||
               p.date.includes(query) ||
               (p.description && p.description.toLowerCase().includes(query));
    });

    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'newest': return b.id - a.id;
            case 'oldest': return a.id - b.id;
            case 'upcoming': return new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time);
            case 'name': return a.name.localeCompare(b.name);
            default: return 0;
        }
    });

    return filtered;
}

searchInput.addEventListener('input', renderParties);
sortSelect.addEventListener('change', renderParties);

enterBtn.addEventListener('click', navigateToApp);

createPartyBtn.addEventListener('click', openForm);
closeFormBtn.addEventListener('click', closeForm);
cancelFormBtn.addEventListener('click', closeForm);
closeCelebrationBtn.addEventListener('click', closeCelebration);

formModal.addEventListener('click', (e) => {
    if (e.target === formModal) closeForm();
});

celebrationModal.addEventListener('click', (e) => {
    if (e.target === celebrationModal) closeCelebration();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!formModal.classList.contains('hidden')) closeForm();
        if (!celebrationModal.classList.contains('hidden')) closeCelebration();
    }
});

backToGridBtn.addEventListener('click', backToGrid);
printBtn.addEventListener('click', printInvitation);
shareBtn.addEventListener('click', shareInvitation);

partyForm.addEventListener('submit', handleCreateParty);
membershipForm.addEventListener('submit', handleMembershipSubmit);
contactForm.addEventListener('submit', handleContactSubmit);
newsletterForm.addEventListener('submit', handleNewsletterSubmit);

navEvents.addEventListener('click', () => switchTab('events'));
navGallery.addEventListener('click', () => switchTab('gallery'));
navVenues.addEventListener('click', () => switchTab('venues'));
navTestimonials.addEventListener('click', () => switchTab('testimonials'));
navContact.addEventListener('click', () => switchTab('contact'));
navMembership.addEventListener('click', () => switchTab('membership'));

document.getElementById('footEvents').addEventListener('click', (e) => { e.preventDefault(); switchTab('events'); });
document.getElementById('footGallery').addEventListener('click', (e) => { e.preventDefault(); switchTab('gallery'); });
document.getElementById('footVenues').addEventListener('click', (e) => { e.preventDefault(); switchTab('venues'); });
document.getElementById('footTestimonials').addEventListener('click', (e) => { e.preventDefault(); switchTab('testimonials'); });
document.getElementById('footMembership').addEventListener('click', (e) => { e.preventDefault(); switchTab('membership'); });
document.getElementById('footContact').addEventListener('click', (e) => { e.preventDefault(); switchTab('contact'); });

function navigateToApp() {
    landingPage.classList.add('fade-out');
    setTimeout(() => {
        landingPage.classList.add('hidden');
        mainApp.classList.remove('hidden');
        setupScrollReveal();
        startCountdowns();
    }, 500);
}

function openForm() {
    formModal.classList.remove('hidden');
    partyForm.reset();
    document.getElementById('partyName').focus();
}

function closeForm() {
    formModal.classList.add('hidden');
}

function openCelebration() {
    celebrationModal.classList.remove('hidden');
    launchConfetti();
}

function closeCelebration() {
    celebrationModal.classList.add('hidden');
}

const tabMap = {
    events:       { nav: navEvents,       section: mainContent,          showBanner: true,  showCreate: true },
    gallery:      { nav: navGallery,      section: gallerySection,       showBanner: false, showCreate: false },
    venues:       { nav: navVenues,       section: venuesSection,        showBanner: false, showCreate: false },
    testimonials: { nav: navTestimonials, section: testimonialsSection,  showBanner: false, showCreate: false },
    contact:      { nav: navContact,      section: contactSection,       showBanner: false, showCreate: false },
    membership:   { nav: navMembership,   section: membershipSection,    showBanner: false, showCreate: false }
};

function switchTab(tab) {
    allNavTabs.forEach(n => n.classList.remove('active'));
    allSections.forEach(s => s.classList.add('hidden'));

    const cfg = tabMap[tab];
    if (!cfg) return;

    cfg.nav.classList.add('active');
    cfg.section.classList.remove('hidden');

    const banner = document.querySelector('.hero-banner');
    if (cfg.showBanner) banner.classList.remove('hidden');
    else banner.classList.add('hidden');

    if (cfg.showCreate) createPartyBtn.classList.remove('hidden');
    else createPartyBtn.classList.add('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let currentDetailParty = null;

function showEventDetailPage(party) {
    currentDetailParty = party;
    allSections.forEach(s => s.classList.add('hidden'));
    document.querySelector('.hero-banner').classList.add('hidden');
    eventDetailPage.classList.remove('hidden');

    invEventName.textContent = party.name;
    invDate.textContent = formatDate(party.date);
    invTime.textContent = party.time;
    invLocation.textContent = party.location;

    if (party.description) {
        invDescRow.classList.remove('hidden');
        invDescription.textContent = party.description;
    } else {
        invDescRow.classList.add('hidden');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToGrid() {
    eventDetailPage.classList.add('hidden');
    mainContent.classList.remove('hidden');
    document.querySelector('.hero-banner').classList.remove('hidden');
    allNavTabs.forEach(n => n.classList.remove('active'));
    navEvents.classList.add('active');
    createPartyBtn.classList.remove('hidden');
    currentDetailParty = null;
    renderParties();
}

function printInvitation() {
    window.print();
}

function shareInvitation() {
    const party = currentDetailParty;
    if (!party) return;

    const text = `You're invited to ${party.name}!\n${formatDate(party.date)} at ${party.time}\n${party.location}${party.description ? `\n${party.description}` : ''}\n\nINVITO - Luxury Event Curation Platform`;

    navigator.clipboard.writeText(text).then(() => {
        shareBtn.textContent = '✓ Copied!';
        showToast('Invitation copied to clipboard', 'success');
        setTimeout(() => { shareBtn.textContent = 'Copy Invitation'; }, 2000);
    }).catch(() => {
        showToast('Failed to copy. Please try again.', 'danger');
    });
}

function handleCreateParty(e) {
    e.preventDefault();

    const name = document.getElementById('partyName').value.trim();
    const date = document.getElementById('partyDate').value;
    const time = document.getElementById('partyTime').value;
    const location = document.getElementById('partyLocation').value.trim();
    const description = document.getElementById('partyDescription').value.trim();
    const maxGuests = parseInt(document.getElementById('partyMaxGuests').value) || 0;

    const isFirstParty = parties.length === 0;

    const newParty = {
        id: nextId++,
        name,
        date,
        time,
        location,
        description,
        maxGuests,
        rsvpCount: 0,
        rsvped: false
    };

    parties.push(newParty);
    saveState();

    closeForm();
    showEventDetailPage(newParty);
    showToast(`"${name}" event created!`, 'success');

    if (isFirstParty) {
        setTimeout(() => openCelebration(), 500);
    }
}

function deleteParty(id) {
    const party = parties.find(p => p.id === id);
    parties = parties.filter(p => p.id !== id);
    saveState();
    renderParties();
    showToast(`"${party ? party.name : 'Event'}" deleted`, 'danger');
}

function viewInvitation(id) {
    const party = parties.find(p => p.id === id);
    if (party) showEventDetailPage(party);
}

function toggleRSVP(id) {
    const party = parties.find(p => p.id === id);
    if (!party) return;

    if (party.rsvped) {
        party.rsvpCount = Math.max(0, party.rsvpCount - 1);
        party.rsvped = false;
        showToast(`RSVP removed for "${party.name}"`, 'default');
    } else {
        if (party.maxGuests > 0 && party.rsvpCount >= party.maxGuests) {
            showToast('This event is at full capacity!', 'danger');
            return;
        }
        party.rsvpCount++;
        party.rsvped = true;
        showToast(`You're going to "${party.name}"! 🎉`, 'success');
    }

    saveState();
    renderParties();
}

function renderParties() {
    partiesGrid.innerHTML = '';
    const filtered = getFilteredParties();

    if (filtered.length === 0 && parties.length > 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
    }

    filtered.forEach(party => {
        const partyCard = createPartyCard(party);
        partiesGrid.appendChild(partyCard);
    });

    startCountdowns();
}

function createPartyCard(party) {
    const card = document.createElement('div');
    card.className = 'party-card';
    card.id = `party-${party.id}`;

    const maxLabel = party.maxGuests > 0 ? `/ ${party.maxGuests}` : '';
    const fillPercent = party.maxGuests > 0 ? Math.min(100, (party.rsvpCount / party.maxGuests) * 100) : 0;
    const rsvpBtnClass = party.rsvped ? 'btn-rsvp rsvped' : 'btn-rsvp';
    const rsvpBtnText = party.rsvped ? '✓ Going' : 'RSVP';

    card.innerHTML = `
        <div class="party-card-header">
            <div class="party-card-title">${escapeHtml(party.name)}</div>
            <div class="party-card-date-time">
                ${formatDate(party.date)} at ${party.time}
            </div>
        </div>
        <div class="party-card-body">
            <div class="party-detail">
                <span class="party-detail-label">📍 Location:</span>
                <span class="party-detail-value">${escapeHtml(party.location)}</span>
            </div>
            ${party.description ? `
                <div class="party-detail">
                    <span class="party-detail-label">📝 Details:</span>
                    <span class="party-detail-value">${escapeHtml(party.description)}</span>
                </div>
            ` : ''}
            <div class="rsvp-section">
                <div class="rsvp-info">
                    <span>${party.rsvpCount}</span> ${maxLabel} guests
                </div>
                ${party.maxGuests > 0 ? `<div class="rsvp-bar"><div class="rsvp-fill" style="width:${fillPercent}%"></div></div>` : ''}
                <button class="${rsvpBtnClass}" onclick="toggleRSVP(${party.id})">${rsvpBtnText}</button>
            </div>
            <div class="countdown">
                <div class="countdown-time" id="countdown-${party.id}">Calculating...</div>
                <div class="countdown-label">Until the party</div>
            </div>
            <div class="party-card-actions">
                <button class="btn btn-primary btn-small" onclick="viewInvitation(${party.id})">View Invitation</button>
                <button class="btn btn-primary btn-small" onclick="copyToClipboard(${party.id})">Copy Details</button>
                <button class="btn btn-danger btn-small" onclick="deleteParty(${party.id})">Delete</button>
            </div>
        </div>
    `;

    return card;
}

function formatDate(dateString) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function copyToClipboard(id) {
    const party = parties.find(p => p.id === id);
    if (!party) return;

    const text = `🎉 You're Invited to ${party.name}!
📅 ${formatDate(party.date)} at ${party.time}
📍 ${party.location}
${party.description ? `\n📝 ${party.description}` : ''}`;

    navigator.clipboard.writeText(text).then(() => {
        showToast('Party details copied!', 'success');
    }).catch(() => {
        showToast('Failed to copy. Please try again.', 'danger');
    });
}

function handleMembershipSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('memberName').value.trim();
    const email = document.getElementById('memberEmail').value.trim();
    const phone = document.getElementById('memberPhone').value.trim();
    const location = document.getElementById('memberLocation').value.trim();

    const newMember = { name, email, phone, location };
    members.push(newMember);
    saveState();

    membershipForm.classList.add('hidden');
    membershipSuccess.classList.remove('hidden');
    showToast(`Welcome to INVITO, ${name}!`, 'success');
    launchConfetti();

    renderMembers();

    setTimeout(() => {
        membershipForm.reset();
        membershipForm.classList.remove('hidden');
        membershipSuccess.classList.add('hidden');
    }, 4000);
}

function renderMembers() {
    if (members.length === 0) {
        membersListSection.classList.add('hidden');
        return;
    }

    membersListSection.classList.remove('hidden');
    membersList.innerHTML = '';

    members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'member-card';
        const initial = escapeHtml(member.name.charAt(0).toUpperCase());
        card.innerHTML = `
            <div class="member-initial">${initial}</div>
            <div class="member-info">
                <div class="member-name">${escapeHtml(member.name)}</div>
                <div class="member-location">${escapeHtml(member.location)}</div>
            </div>
        `;
        membersList.appendChild(card);
    });
}

function handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    contactForm.classList.add('hidden');
    contactSuccess.classList.remove('hidden');
    showToast(`Thanks ${name}, message sent!`, 'success');

    setTimeout(() => {
        contactForm.reset();
        contactForm.classList.remove('hidden');
        contactSuccess.classList.add('hidden');
    }, 4000);
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    showToast(`Subscribed! We'll send updates to ${email}`, 'success');
    newsletterForm.reset();
}

function setupGalleryFilters() {
    const filters = document.querySelectorAll('.gallery-filter');
    const items = document.querySelectorAll('.gallery-item');

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.filter;
            items.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.classList.remove('gallery-hidden');
                } else {
                    item.classList.add('gallery-hidden');
                }
            });
        });
    });
}

let carouselIndex = 0;

function setupTestimonialsCarousel() {
    const track = document.getElementById('testimonialTrack');
    const cards = track.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');

    let visibleCount = 1;
    if (window.innerWidth >= 1024) visibleCount = 3;
    else if (window.innerWidth >= 769) visibleCount = 2;

    const maxIndex = Math.max(0, cards.length - visibleCount);

    dotsContainer.innerHTML = '';
    for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    function goToSlide(idx) {
        carouselIndex = Math.max(0, Math.min(idx, maxIndex));
        const percent = carouselIndex * (100 / visibleCount);
        track.style.transform = `translateX(-${percent}%)`;
        dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === carouselIndex);
        });
    }

    prevBtn.addEventListener('click', () => goToSlide(carouselIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(carouselIndex + 1));

    window.addEventListener('resize', () => {
        let newVisible = 1;
        if (window.innerWidth >= 1024) newVisible = 3;
        else if (window.innerWidth >= 769) newVisible = 2;
        if (newVisible !== visibleCount) {
            visibleCount = newVisible;
            setupTestimonialsCarousel();
        }
    });
}

initTheme();
createParticles();
runTypingAnimation();
renderParties();
renderMembers();
setupGalleryFilters();
setupTestimonialsCarousel();