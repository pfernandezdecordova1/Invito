
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

// ========== STATE - MEMBERS ==========
let members = [];

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
membershipForm.addEventListener('submit', handleMembershipSubmit);

// ========== EVENT LISTENERS - NAVIGATION ==========
navEvents.addEventListener('click', () => switchTab('events'));
navMembership.addEventListener('click', () => switchTab('membership'));

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

    // Populate invitation card
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

    window.scrollTo(0, 0);
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
        shareBtn.textContent = 'Copied!';
        setTimeout(() => { shareBtn.textContent = 'Copy Invitation'; }, 2000);
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

function viewInvitation(id) {
    const party = parties.find(p => p.id === id);
    if (party) showEventDetailPage(party);
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
        alert('Party details copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy. Please try again.');
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

    // Show success, hide form
    membershipForm.classList.add('hidden');
    membershipSuccess.classList.remove('hidden');

    // Show members list
    renderMembers();

    // Reset form for next use after a delay
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
renderParties();