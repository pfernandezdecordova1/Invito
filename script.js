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
const createPartyBtn = document.getElementById('createPartyBtn');
const formModal = document.getElementById('formModal');
const closeFormBtn = document.getElementById('closeFormBtn');
const cancelFormBtn = document.getElementById('cancelFormBtn');
const partyForm = document.getElementById('partyForm');
const partiesGrid = document.getElementById('partiesGrid');
const emptyState = document.getElementById('emptyState');

// ========== EVENT LISTENERS - MODAL CONTROL ==========
createPartyBtn.addEventListener('click', openForm);
closeFormBtn.addEventListener('click', closeForm);
cancelFormBtn.addEventListener('click', closeForm);

// Close modal when clicking outside
formModal.addEventListener('click', (e) => {
    if (e.target === formModal) {
        closeForm();
    }
});

// ========== EVENT LISTENERS - FORM SUBMISSION ==========
partyForm.addEventListener('submit', handleCreateParty);

// ========== FUNCTIONS - MODAL CONTROL ==========
function openForm() {
    formModal.classList.remove('hidden');
    partyForm.reset();
}

function closeForm() {
    formModal.classList.add('hidden');
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

    // Update DOM
    renderParties();
    closeForm();
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
