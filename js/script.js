
// ========== STATE ==========
let parties = JSON.parse(localStorage.getItem('invito_parties') || '[]');
let nextId = JSON.parse(localStorage.getItem('invito_nextId') || '1');
let members = JSON.parse(localStorage.getItem('invito_members') || '[]');

// ========== DOM ELEMENTS ==========
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

// Invitation detail elements
const invEventName = document.getElementById('invEventName');
const invDate = document.getElementById('invDate');
const invTime = document.getElementById('invTime');
const invLocation = document.getElementById('invLocation');
const invDescription = document.getElementById('invDescription');
const invDescRow = document.getElementById('invDescRow');

// Navigation tabs
const navEvents = document.getElementById('navEvents');
const navMembership = document.getElementById('navMembership');

// Membership elements
const membershipSection = document.getElementById('membershipSection');
const membershipForm = document.getElementById('membershipForm');
const membershipSuccess = document.getElementById('membershipSuccess');
const membersListSection = document.getElementById('membersListSection');
const membersList = document.getElementById('membersList');

// New interactive elements
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const noResults = document.getElementById('noResults');
const toastContainer = document.getElementById('toastContainer');
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas.getContext('2d');

// ========== PERSISTENCE ==========
function saveState() {
    localStorage.setItem('invito_parties', JSON.stringify(parties));
    localStorage.setItem('invito_nextId', JSON.stringify(nextId));
    localStorage.setItem('invito_members', JSON.stringify(members));
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = 'default') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✓', danger: '✕', default: '★' };
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.default}</span><span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ========== CONFETTI SYSTEM ==========
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

// ========== TYPING ANIMATION ==========
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

// ========== PARTICLE BACKGROUND ==========
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

// ========== SCROLL REVEAL ==========
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
                // Trigger stat counting when stats come into view
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

// ========== ANIMATED STAT COUNTERS ==========
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
            const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
            const current = Math.floor(target * eased);

            let display = hasK ? current + 'K' : String(current);
            if (hasPlus) display += '+';
            stat.textContent = display;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                stat.textContent = text; // restore original
                stat.classList.remove('counting');
            }
        }

        requestAnimationFrame(update);
    });
}

// ========== DARK/LIGHT MODE ==========
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

// ========== LIVE COUNTDOWN TIMERS ==========
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

// ========== SEARCH & SORT ==========
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

// ========== EVENT LISTENERS - PAGE NAVIGATION ==========
enterBtn.addEventListener('click', navigateToApp);

// ========== EVENT LISTENERS - MODAL CONTROL ==========
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

// ========== EVENT LISTENERS - KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!formModal.classList.contains('hidden')) closeForm();
        if (!celebrationModal.classList.contains('hidden')) closeCelebration();
    }
});

// ========== EVENT LISTENERS - EVENT DETAIL PAGE ==========
backToGridBtn.addEventListener('click', backToGrid);
printBtn.addEventListener('click', printInvitation);
shareBtn.addEventListener('click', shareInvitation);

// ========== EVENT LISTENERS - FORM SUBMISSION ==========
partyForm.addEventListener('submit', handleCreateParty);
membershipForm.addEventListener('submit', handleMembershipSubmit);

// ========== EVENT LISTENERS - NAVIGATION ==========
navEvents.addEventListener('click', () => switchTab('events'));
navMembership.addEventListener('click', () => switchTab('membership'));

// ========== FUNCTIONS - PAGE NAVIGATION ==========
function navigateToApp() {
    landingPage.classList.add('fade-out');
    setTimeout(() => {
        landingPage.classList.add('hidden');
        mainApp.classList.remove('hidden');
        setupScrollReveal();
        startCountdowns();
    }, 500);
}

// ========== FUNCTIONS - MODAL CONTROL ==========
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

// ========== FUNCTIONS - NAVIGATION TABS ==========
function switchTab(tab) {
    if (tab === 'events') {
        navEvents.classList.add('active');
        navMembership.classList.remove('active');
        mainContent.classList.remove('hidden');
        membershipSection.classList.add('hidden');
        document.querySelector('.hero-banner').classList.remove('hidden');
        createPartyBtn.classList.remove('hidden');
    } else {
        navMembership.classList.add('active');
        navEvents.classList.remove('active');
        mainContent.classList.add('hidden');
        membershipSection.classList.remove('hidden');
        document.querySelector('.hero-banner').classList.add('hidden');
        createPartyBtn.classList.add('hidden');
    }
}

// ========== FUNCTIONS - EVENT DETAIL PAGE ==========
let currentDetailParty = null;

function showEventDetailPage(party) {
    currentDetailParty = party;
    mainContent.classList.add('hidden');
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

// ========== FUNCTIONS - CREATE PARTY ==========
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

// ========== FUNCTIONS - DELETE PARTY ==========
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

// ========== FUNCTIONS - RSVP ==========
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

// ========== FUNCTIONS - RENDER ==========
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

// ========== FUNCTIONS - UTILITIES ==========
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

// ========== FUNCTIONS - MEMBERSHIP ==========
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

// ========== INITIALIZATION ==========
initTheme();
createParticles();
runTypingAnimation();
renderParties();
renderMembers();