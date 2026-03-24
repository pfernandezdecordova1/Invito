
// ========== STATE ==========
let parties = []; // Array of party objects
let nextId = 1;

// Data structure for a party:
// {
//   id: number,
//   name: string,
//   date: string (YYYY-MM-DD format),
//   time: string (HH:MM format),
//   location: string,
//   description: string
// }

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
const emptyState = document.getElementById('emptyState');

const celebrationModal = document.getElementById('celebrationModal');
const closeCelebrationBtn = document.getElementById('closeCelebrationBtn');

const eventDetailPage = document.getElementById('eventDetailPage');
const mainContent = document.getElementById('mainContent');
const backToGridBtn = document.getElementById('backToGridBtn');
const printBtn = document.getElementById('printBtn');
const shareBtn = document.getElementById('shareBtn');
const detailContent = document.getElementById('detailContent');

// ========== EVENT LISTENERS - PAGE NAVIGATION ==========
enterBtn.addEventListener('click', navigateToApp);

// ========== EVENT LISTENERS - MODAL CONTROL ==========
createPartyBtn.addEventListener('click', openForm);
closeFormBtn.addEventListener('click', closeForm);
cancelFormBtn.addEventListener('click', closeForm);
closeCelebrationBtn.addEventListener('click', closeCelebration);

// Close modal when clicking outside
formModal.addEventListener('click', (e) => {
    if (e.target === formModal) {
        closeForm();
    }
});

// Close celebration modal when clicking outside
celebrationModal.addEventListener('click', (e) => {
    if (e.target === celebrationModal) {
        closeCelebration();
    }
});

// ========== EVENT LISTENERS - EVENT DETAIL PAGE ==========
backToGridBtn.addEventListener('click', backToGrid);
printBtn.addEventListener('click', printInvitation);
shareBtn.addEventListener('click', shareInvitation);

// ========== EVENT LISTENERS - FORM SUBMISSION ==========
partyForm.addEventListener('submit', handleCreateParty);

// ========== FUNCTIONS - PAGE NAVIGATION ==========
function navigateToApp() {
    landingPage.classList.add('hidden');
    mainApp.classList.remove('hidden');
}

// ========== FUNCTIONS - MODAL CONTROL ==========
function openForm() {
    formModal.classList.remove('hidden');
    partyForm.reset();
}

function closeForm() {
    formModal.classList.add('hidden');
}

function openCelebration() {
    celebrationModal.classList.remove('hidden');
}

function closeCelebration() {
    celebrationModal.classList.add('hidden');
}

// ========== FUNCTIONS - EVENT DETAIL PAGE ==========
function showEventDetailPage(party) {
    mainContent.classList.add('hidden');
    eventDetailPage.classList.remove('hidden');

    // Generate formal document content
    const documentHTML = `
        <h2>${escapeHtml(party.name)}</h2>
        
        <div class="event-detail-item">
            <div class="detail-label">Date</div>
            <div class="detail-value">${formatDate(party.date)}</div>
        </div>

        <div class="event-detail-item">
            <div class="detail-label">Time</div>
            <div class="detail-value">${party.time}</div>
        </div>

        <div class="event-detail-item">
            <div class="detail-label">Venue</div>
            <div class="detail-value">${escapeHtml(party.location)}</div>
        </div>

        ${party.description ? `
            <div class="event-detail-item">
                <div class="detail-label">Event Details</div>
                <div class="detail-value">${escapeHtml(party.description)}</div>
            </div>
        ` : ''}

        <div style="margin-top: 50px; text-align: center; font-style: italic; color: #999;">
            <p>We look forward to celebrating with you</p>
        </div>
    `;

    detailContent.innerHTML = documentHTML;

    // Scroll to top
    window.scrollTo(0, 0);
}

function backToGrid() {
    eventDetailPage.classList.add('hidden');
    mainContent.classList.remove('hidden');
    renderParties();
}

function printInvitation() {
    window.print();
}

function shareInvitation() {
    const party = parties[parties.length - 1];
    if (!party) return;

    const text = `You're invited to ${party.name}!
📅 ${formatDate(party.date)} at ${party.time}
📍 ${party.location}
${party.description ? `\n📝 ${party.description}` : ''}

Manage your RSVP at: INVITO - Luxury Event Curation Platform`;

    navigator.clipboard.writeText(text).then(() => {
        alert('Invitation copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy. Please try again.');
    });
}

// ========== FUNCTIONS - CREATE PARTY ==========
function handleCreateParty(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('partyName').value;
    const date = document.getElementById('partyDate').value;
    const time = document.getElementById('partyTime').value;
    const location = document.getElementById('partyLocation').value;
    const description = document.getElementById('partyDescription').value;

    // Check if this is the first party
    const isFirstParty = parties.length === 0;

    // Create party object
    const newParty = {
        id: nextId++,
        name,
        date,
        time,
        location,
        description
    };

    // Add to state
    parties.push(newParty);

    // Close form and show detail page
    closeForm();
    showEventDetailPage(newParty);

    // Show celebration for first party
    if (isFirstParty) {
        setTimeout(() => {
            openCelebration();
        }, 500);
    }
}

// ========== FUNCTIONS - DELETE PARTY ==========
function deleteParty(id) {
    parties = parties.filter(party => party.id !== id);
    renderParties();
}

// ========== FUNCTIONS - RENDER ==========
function renderParties() {
    partiesGrid.innerHTML = '';

    if (parties.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    parties.forEach(party => {
        const partyCard = createPartyCard(party);
        partiesGrid.appendChild(partyCard);
    });
}

function createPartyCard(party) {
    const card = document.createElement('div');
    card.className = 'party-card';
    card.id = `party-${party.id}`;

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
            <div class="countdown">
                <div class="countdown-time" id="countdown-${party.id}">Calculating...</div>
                <div class="countdown-label">Until the party</div>
            </div>
            <div class="party-card-actions">
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
        alert('Party details copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy. Please try again.');
    });
}

// ========== INITIALIZATION ==========
renderParties();