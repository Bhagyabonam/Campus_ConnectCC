// Global Variables
let currentUser = null;
let events = JSON.parse(localStorage.getItem('events')) || [];
// Drafts are stored per coordinator (not in global events)
let drafts = JSON.parse(localStorage.getItem('drafts')) || {};
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
let currentSlideIndex = 0;
// Coordinator Home filters
let coordinatorHomeStatus = 'active'; // active = upcoming + ongoing
let coordinatorHomeCategory = '';

// Demo Events Data
const demoEvents = [
    {
        id: 1,
        title: "Tech Workshop: Web Development",
        category: "workshop",
        date: "2024-12-15",
        time: "14:00",
        location: "Computer Lab 101",
        description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners!",
        bannerUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        formLink: "https://forms.google.com/example1",
        coordinator: "coordinator@college.edu",
        clubName: "Tech Club",
        status: "approved",
        createdAt: "2024-12-01T10:00:00Z",
            rejectionReason: null,
    },
    {
        id: 2,
        title: "Cultural Festival 2024",
        category: "cultural",
        date: "2024-12-20",
        time: "18:00",
        location: "Main Auditorium",
        description: "Celebrate diversity through music, dance, and art from around the world.",
        bannerUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        formLink: "https://forms.google.com/example2",
        coordinator: "coordinator@college.edu",
        clubName: "Cultural Club",
        status: "pending",
        createdAt: "2024-12-05T14:30:00Z",
            rejectionReason: null,
    },
    {
        id: 3,
        title: "Career Fair 2025",
        category: "academic",
        date: "2025-01-10",
        time: "10:00",
        location: "Student Center",
        description: "Connect with top employers and explore career opportunities in various fields.",
        bannerUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        formLink: "https://forms.google.com/example3",
        coordinator: "coordinator@college.edu",
        clubName: "Career Development Club",
        status: "approved",
        createdAt: "2024-12-03T09:15:00Z",
        rejectionReason: null
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Fallback: if student dashboard exists but initialization didn't attach handlers yet,
// ensure student-specific init runs and the correct section is shown.
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.dashboard-page') && window.location.pathname.split('/').pop() === 'student-dashboard.html') {
        // initialize student-specific view if not already initialized
        try {
            initializeStudentDashboard();
        } catch (e) {
            // ignore if already initialized
        }
    }
});

function initializeApp() {
    // Initialize slideshow for home page
    if (document.querySelector('.slideshow-container')) {
        initializeSlideshow();
        initializeEventListeners();
        showSlide(0);
    }

    // Initialize login page
    if (document.getElementById('loginForm')) {
        initializeLoginPage();
    }

    // Initialize dashboards
    if (document.querySelector('.dashboard-page')) {
        initializeDashboard();
    }

    // Load demo data if no events exist
    if (events.length === 0) {
        events = demoEvents;
        saveEvents();
    }

    // Load public events on home page
    if (document.getElementById('publicEventsGrid')) {
        loadPublicEvents();
    }
}

// ==================== SLIDESHOW FUNCTIONALITY ====================

function initializeSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;

    if (totalSlides > 0) {
        setInterval(nextSlide, 3000);
    }
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }

    currentSlideIndex = index;
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    showSlide(currentSlideIndex);
}

function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    showSlide(index - 1);
}

// ==================== LOGIN FUNCTIONALITY ====================

function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);
}

function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(loginForm);
    const role = formData.get('role');
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Basic validation
    if (!role || !email || !password) {
        showLoginMessage('Please fill in all fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showLoginMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Password validation
    if (password !== 'Campus123') {
        showLoginMessage('Incorrect password. Please try again.', 'error');
        return;
    }
    
    // Role-based email validation
    const validEmails = {
        'student': 'student@college.edu',
        'student-coordinator': 'coordinator@college.edu',
        'faculty-coordinator': 'faculty@college.edu'
    };
    
    if (email !== validEmails[role]) {
        showLoginMessage(`Please use the correct email for ${role.replace('-', ' ')} role.`, 'error');
        return;
    }
    
    // Success login
    currentUser = { role, email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showLoginMessage(`Welcome ${role.replace('-', ' ')}! Redirecting...`, 'success');
    
    // Redirect to appropriate dashboard
    setTimeout(() => {
        switch(role) {
            case 'student':
                window.location.href = 'student-dashboard.html';
                break;
            case 'student-coordinator':
                window.location.href = 'student-coordinator-dashboard.html';
                break;
            case 'faculty-coordinator':
                window.location.href = 'faculty-dashboard.html';
                break;
        }
    }, 2000);
}

function showLoginMessage(message, type) {
    const loginMessage = document.getElementById('loginMessage');
    loginMessage.textContent = message;
    loginMessage.className = `login-message ${type}`;
    
    setTimeout(() => {
        loginMessage.textContent = '';
        loginMessage.className = 'login-message';
    }, 5000);
}

// Demo modal functions
function showDemoInfo() {
    document.getElementById('demoModal').style.display = 'block';
}

function closeDemoInfo() {
    document.getElementById('demoModal').style.display = 'none';
}

// ==================== DASHBOARD FUNCTIONALITY ====================

function initializeDashboard() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(savedUser);
    updateUserInterface();
    
    // Initialize based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'student-dashboard.html':
            initializeStudentDashboard();
            break;
        case 'student-coordinator-dashboard.html':
            initializeCoordinatorDashboard();
            break;
        case 'faculty-dashboard.html':
            initializeFacultyDashboard();
            break;
    }
}

function updateUserInterface() {
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = currentUser.role.replace('-', ' ');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ==================== STUDENT DASHBOARD ====================

function initializeStudentDashboard() {
    loadStudentEvents();
    updateStudentStats();
    
    // Add event listeners
    const searchInput = document.getElementById('searchEvents');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    if (searchInput) searchInput.addEventListener('input', filterEvents);
    if (categoryFilter) categoryFilter.addEventListener('change', filterEvents);
    if (dateFilter) dateFilter.addEventListener('change', filterEvents);

    // Student nav handlers for wishlist/history
    const navWishlist = document.getElementById('navWishlist');
    const navHistory = document.getElementById('navHistory');
    if (navWishlist) navWishlist.addEventListener('click', e => { e.preventDefault(); showStudentSection('wishlist'); });
    if (navHistory) navHistory.addEventListener('click', e => { e.preventDefault(); showStudentSection('history'); });

    // Respect URL hash on load (so direct links or manual hash changes work)
    const hash = window.location.hash.replace('#', '');
    if (hash === 'wishlist' || hash === 'history' || hash === 'events') {
        showStudentSection(hash === '' ? 'events' : hash);
    } else {
        // default view
        showStudentSection('events');
    }
}

function loadStudentEvents() {
    const approvedEvents = events.filter(event => event.status === 'approved');
    displayStudentEvents(approvedEvents, 'eventsContainer');
    updateStudentStats();
}

function updateStudentStats() {
    const approvedEvents = events.filter(event => event.status === 'approved');
    const userRegistrations = registrations.filter(reg => reg.userEmail === currentUser.email);
    const userWishlist = wishlist.filter(item => item.userEmail === currentUser.email);
    
    const totalEventsElement = document.getElementById('totalEvents');
    const registeredEventsElement = document.getElementById('registeredEvents');
    const wishlistEventsElement = document.getElementById('wishlistEvents');
    
    if (totalEventsElement) totalEventsElement.textContent = approvedEvents.length;
    if (registeredEventsElement) registeredEventsElement.textContent = userRegistrations.length;
    if (wishlistEventsElement) wishlistEventsElement.textContent = userWishlist.length;
}

function filterEvents() {
    const searchTerm = document.getElementById('searchEvents')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const dateFilter = document.getElementById('dateFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    
    let filteredEvents = events.filter(event => event.status === 'approved');
    
    // Search filter
    if (searchTerm) {
        filteredEvents = filteredEvents.filter(event => 
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.clubName.toLowerCase().includes(searchTerm)
        );
    }
    
    // Category filter
    if (categoryFilter) {
        filteredEvents = filteredEvents.filter(event => event.category === categoryFilter);
    }
    
    // Date filter
    if (dateFilter) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            switch(dateFilter) {
                case 'today':
                    return eventDate.toDateString() === today.toDateString();
                case 'week':
                    return eventDate >= today && eventDate <= nextWeek;
                case 'month':
                    return eventDate >= today && eventDate <= nextMonth;
                case 'upcoming':
                    return eventDate > today;
                case 'ongoing':
                    return eventDate.toDateString() === today.toDateString();
                case 'completed':
                    return eventDate < today;
                default:
                    return true;
            }
        });
    }
    
    // Status filter (for student view - upcoming, ongoing, completed)
    if (statusFilter) {
        const today = new Date();
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            switch(statusFilter) {
                case 'upcoming':
                    return eventDate > today;
                case 'ongoing':
                    return eventDate.toDateString() === today.toDateString();
                case 'completed':
                    return eventDate < today;
                default:
                    return true;
            }
        });
    }
    
    displayStudentEvents(filteredEvents, 'eventsContainer');
}

function displayStudentEvents(events, containerId) {
    const container = document.getElementById(containerId);
    const noEvents = document.getElementById('noEvents');
    
    if (events.length === 0) {
        if (container) container.style.display = 'none';
        if (noEvents) noEvents.style.display = 'block';
        return;
    }
    
    if (container) container.style.display = 'grid';
    if (noEvents) noEvents.style.display = 'none';
    
    if (container) {
        container.innerHTML = events.map(event => {
            const isWishlisted = wishlist.some(item => 
                item.eventId === event.id && item.userEmail === currentUser.email
            );
            const isRegistered = registrations.some(reg => 
                reg.eventId === event.id && reg.userEmail === currentUser.email
            );
            // Check if this is the coordinator home completed section
            let showCompletedInsteadOfRegister = false;
            if (containerId === 'coordinatorHomeContainer') {
                const eventDate = new Date(event.date);
                const today = new Date();
                if (eventDate < today && !isRegistered) {
                    showCompletedInsteadOfRegister = true;
                }
            }
            return `
                <div class="event-card">
                    <img src="${event.bannerUrl || 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" alt="${event.title}">
                    <div class="event-card-content">
                        <div class="event-header">
                            <h3>${event.title}</h3>
                            <button onclick="event.stopPropagation(); toggleWishlist(${event.id})" class="wishlist-btn ${isWishlisted ? 'wishlisted' : ''}">
                                <span>${isWishlisted ? '❤️' : '🤍'}</span>
                            </button>
                        </div>
                        <p><strong>Club:</strong> ${event.clubName}</p>
                        <p>${event.description.substring(0, 100)}...</p>
                        <div class="event-meta" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                            <span class="event-date">${formatDate(event.date)}</span>
                            <span class="event-category">${event.category}</span>
                        </div>
                        <div class="event-actions" style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 10px;">
                            <div>
                                ${isRegistered
                                    ? '<span class="registered-badge">Registered</span>'
                                    : showCompletedInsteadOfRegister
                                        ? '<span class="registered-badge">Completed</span>'
                                        : `<button onclick="event.stopPropagation(); registerForEvent(${event.id})" class="btn-primary">Register</button>`}
                            </div>
                            <button onclick="event.stopPropagation(); openEventModal(${event.id})" class="btn-secondary">View Details</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function toggleWishlist(eventId) {
    const existingIndex = wishlist.findIndex(item => 
        item.eventId === eventId && item.userEmail === currentUser.email
    );
    
    if (existingIndex !== -1) {
        wishlist.splice(existingIndex, 1);
        showNotification('Removed from wishlist', 'success');
    } else {
        wishlist.push({
            eventId: eventId,
            userEmail: currentUser.email,
            addedAt: new Date().toISOString()
        });
        showNotification('Added to wishlist', 'success');
    }
    
    saveWishlist();
    updateStudentStats();
    
    // Refresh the current view appropriately
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'student-dashboard.html') {
        // If student is viewing wishlist, refresh that; otherwise refresh events
        const wishlistSection = document.getElementById('wishlist');
        if (wishlistSection && wishlistSection.style.display === 'block') {
            loadWishlistForStudent();
        } else {
            loadStudentEvents();
        }
    } else if (currentPage === 'student-coordinator-dashboard.html') {
        renderCoordinatorHome();
        loadWishlistForCoordinator();
    }
}

function registerForEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    // Check if already registered
    const isRegistered = registrations.some(reg => 
        reg.eventId === eventId && reg.userEmail === currentUser.email
    );
    
    if (isRegistered) {
        showNotification('You are already registered for this event', 'error');
        return;
    }
    
    // Add registration
    registrations.push({
        eventId: eventId,
        userEmail: currentUser.email,
        registeredAt: new Date().toISOString(),
        eventTitle: event.title
    });
    
    saveRegistrations();
    updateStudentStats();
    showNotification('Successfully registered for event!', 'success');
    
    // Open registration form in new tab
    window.open(event.formLink, '_blank');

    // Refresh history for coordinator if on that page
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'student-coordinator-dashboard.html') {
        loadHistoryForCoordinator();
    } else if (currentPage === 'student-dashboard.html') {
        // Refresh student history or events view
        const historySection = document.getElementById('history');
        if (historySection && historySection.style.display === 'block') {
            loadHistoryForStudent();
        } else {
            loadStudentEvents();
        }
    }
}

// Student section navigation and loaders
function showStudentSection(sectionId) {
    // The wishlist and history sections are children inside the main #events section.
    // Toggle the inner containers rather than hiding the parent section.
    const eventsContainer = document.getElementById('eventsContainer');
    const wishlistSection = document.getElementById('wishlist');
    const historySection = document.getElementById('history');

    if (!eventsContainer || !wishlistSection || !historySection) return;

    if (sectionId === 'events') {
        eventsContainer.style.display = 'grid';
        wishlistSection.style.display = 'none';
        historySection.style.display = 'none';
        // Show main events header and filter tabs
        const eventsHeaderBlock = document.getElementById('eventsHeaderBlock');
        if (eventsHeaderBlock) eventsHeaderBlock.style.display = '';
        const wishlistTitle = document.getElementById('wishlistTitle');
        if (wishlistTitle) wishlistTitle.style.display = 'none';
        const historyTitle = document.getElementById('historyTitle');
        if (historyTitle) historyTitle.style.display = 'none';
        loadStudentEvents();
    } else if (sectionId === 'wishlist') {
        eventsContainer.style.display = 'none';
        wishlistSection.style.display = 'block';
        historySection.style.display = 'none';
        // Hide main events header and filter tabs, show wishlist heading
        const eventsHeaderBlock = document.getElementById('eventsHeaderBlock');
        if (eventsHeaderBlock) eventsHeaderBlock.style.display = 'none';
        const wishlistTitle = document.getElementById('wishlistTitle');
        if (wishlistTitle) wishlistTitle.style.display = '';
        const historyTitle = document.getElementById('historyTitle');
        if (historyTitle) historyTitle.style.display = 'none';
        loadWishlistForStudent();
    } else if (sectionId === 'history') {
        eventsContainer.style.display = 'none';
        wishlistSection.style.display = 'none';
        historySection.style.display = 'block';
        // Hide main events header and filter tabs, show history heading
        const eventsHeaderBlock = document.getElementById('eventsHeaderBlock');
        if (eventsHeaderBlock) eventsHeaderBlock.style.display = 'none';
        const wishlistTitle = document.getElementById('wishlistTitle');
        if (wishlistTitle) wishlistTitle.style.display = 'none';
        const historyTitle = document.getElementById('historyTitle');
        if (historyTitle) historyTitle.style.display = '';
        loadHistoryForStudent();
    }

    // Highlight nav links for wishlist/history (home uses separate link)
    const navWishlistLink = document.getElementById('navWishlist');
    const navHistoryLink = document.getElementById('navHistory');
    if (navWishlistLink) navWishlistLink.classList.toggle('active', sectionId === 'wishlist');
    if (navHistoryLink) navHistoryLink.classList.toggle('active', sectionId === 'history');
}

function loadWishlistForStudent() {
    const container = document.getElementById('wishlistContainer');
    const noWishlist = document.getElementById('noWishlist');
    if (!container) return;

    // Show liked events regardless of their approval status (user asked for liked events from all events)
    const wishIds = wishlist.filter(w => w.userEmail === currentUser.email).map(w => w.eventId);
    const items = events.filter(e => wishIds.includes(e.id));

    if (items.length === 0) {
        container.style.display = 'none';
        if (noWishlist) noWishlist.style.display = 'block';
        return;
    }
    container.style.display = 'grid';
    if (noWishlist) noWishlist.style.display = 'none';
    displayStudentEvents(items, 'wishlistContainer');
}

function loadHistoryForStudent() {
    const container = document.getElementById('historyContainer');
    const noHistory = document.getElementById('noHistory');
    if (!container) return;

    // Only show registered events that have completed (event date in the past)
    const today = new Date();
    const myRegs = registrations.filter(r => r.userEmail === currentUser.email);
    const items = myRegs.map(r => {
        const evt = events.find(e => e.id === r.eventId);
        return evt ? { ...evt, _registeredAt: r.registeredAt } : null;
    }).filter(Boolean).filter(evt => {
        const d = new Date(evt.date);
        return d < today; // completed events only
    });

    if (items.length === 0) {
        container.style.display = 'none';
        if (noHistory) noHistory.style.display = 'block';
        return;
    }
    container.style.display = 'grid';
    if (noHistory) noHistory.style.display = 'none';

    container.innerHTML = items.map(event => `
        <div class="event-card">
            <img src="${event.bannerUrl || 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" alt="${event.title}">
            <div class="event-card-content">
                <div class="event-header"><h3>${event.title}</h3></div>
                <p><strong>Club:</strong> ${event.clubName}</p>
                <p>${event.description.substring(0, 100)}...</p>
                <div class="event-meta">
                    <span class="event-date">Participated: ${new Date(event._registeredAt).toLocaleDateString()}</span>
                    <span class="event-category">${event.category}</span>
                </div>
                <div class="event-actions">
                    <button onclick="event.stopPropagation(); openEventModal(${event.id})" class="btn-secondary">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

function openEventModal(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const isRegistered = registrations.some(reg => 
        reg.eventId === eventId && reg.userEmail === currentUser.email
    );
    
    const modal = document.getElementById('eventModal');
    const content = document.getElementById('eventModalContent');
    
    content.innerHTML = `
        <div class="event-modal-body">
            <img src="${event.bannerUrl || 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" alt="${event.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">
            <h3>${event.title}</h3>
            <div class="event-details">
                <p><strong>Club:</strong> ${event.clubName}</p>
                <p><strong>Date:</strong> ${formatDate(event.date)} at ${event.time}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Category:</strong> ${event.category}</p>
                <p><strong>Description:</strong> ${event.description}</p>
            </div>
            <div class="event-actions">
                ${isRegistered ? 
                    '<span class="registered-badge">Already Registered</span>' :
                    `<button onclick="registerForEvent(${event.id})" class="btn-primary">Register for Event</button>`
                }
                <button onclick="toggleWishlist(${event.id})" class="btn-secondary">
                    ${wishlist.some(item => item.eventId === event.id && item.userEmail === currentUser.email) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
}

function closeRegistrationModal() {
    document.getElementById('registrationModal').style.display = 'none';
}

// ==================== COORDINATOR DASHBOARD ====================

function initializeCoordinatorDashboard() {
    loadCoordinatorEvents();
    updateCoordinatorStats();

    // Navigation between sections
    const navHome = document.getElementById('navHome');
    const navMyEvents = document.getElementById('navMyEvents');
    const navCreate = document.getElementById('navCreate');
    const navWishlist = document.getElementById('navWishlist');
    const navHistory = document.getElementById('navHistory');

    if (navHome) navHome.addEventListener('click', e => { e.preventDefault(); showCoordinatorSection('home'); });
    if (navMyEvents) navMyEvents.addEventListener('click', e => { e.preventDefault(); showCoordinatorSection('my-events'); });
    if (navCreate) navCreate.addEventListener('click', e => { e.preventDefault(); showCoordinatorSection('create'); });
    if (navWishlist) navWishlist.addEventListener('click', e => { e.preventDefault(); showCoordinatorSection('wishlist'); });
    if (navHistory) navHistory.addEventListener('click', e => { e.preventDefault(); showCoordinatorSection('history'); });

    // Event form listeners
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventSubmit);
    }
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', saveDraftFromForm);
    }

    // Render coordinator home + wishlist/history
    renderCoordinatorHome();
    loadWishlistForCoordinator();
    loadHistoryForCoordinator();
    showCoordinatorSection('home');
}

function loadCoordinatorEvents() {
    const clubName = getCoordinatorClubName();
    // Get submitted events (not drafts) for this coordinator
    const myEvents = events.filter(event => event.clubName === clubName && event.coordinator === currentUser.email);
    // Get drafts for this coordinator
    const myDrafts = (drafts[currentUser.email] || []);
    displayCoordinatorEvents([...myEvents, ...myDrafts]);
    updateCoordinatorStats();
}

function updateCoordinatorStats() {
    const clubName = getCoordinatorClubName();
    const myEvents = events.filter(event => event.clubName === clubName && event.coordinator === currentUser.email);
    const myDrafts = (drafts[currentUser.email] || []);
    const pending = myEvents.filter(event => event.status === 'pending').length;
    const approved = myEvents.filter(event => event.status === 'approved').length;
    const denied = myEvents.filter(event => event.status === 'denied').length;
    const totalMyEventsElement = document.getElementById('totalMyEvents');
    const pendingEventsElement = document.getElementById('pendingEvents');
    const approvedEventsElement = document.getElementById('approvedEvents');
    const deniedEventsElement = document.getElementById('deniedEvents');
    if (totalMyEventsElement) totalMyEventsElement.textContent = myEvents.length + myDrafts.length;
    if (pendingEventsElement) pendingEventsElement.textContent = pending;
    if (approvedEventsElement) approvedEventsElement.textContent = approved;
    if (deniedEventsElement) deniedEventsElement.textContent = denied;
}

function filterMyEvents(status) {
    const clubName = getCoordinatorClubName();
    const myEvents = events.filter(event => event.clubName === clubName && event.coordinator === currentUser.email);
    const myDrafts = (drafts[currentUser.email] || []);
    let filteredEvents = [...myEvents, ...myDrafts];
    if (status !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.status === status);
    }
    displayCoordinatorEvents(filteredEvents);
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    // Find the button for the current status and add 'active'
    const tabButtons = document.querySelectorAll('.filter-tab');
    tabButtons.forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === (status === 'all' ? 'all' : status.charAt(0).toUpperCase() + status.slice(1))) {
            btn.classList.add('active');
        }
    });
}

function displayCoordinatorEvents(events) {
    const container = document.getElementById('myEventsContainer');
    const noEvents = document.getElementById('noMyEvents');
    
    if (events.length === 0) {
        if (container) container.style.display = 'none';
        if (noEvents) noEvents.style.display = 'block';
        return;
    }
    
    if (container) container.style.display = 'grid';
    if (noEvents) noEvents.style.display = 'none';
    
    if (container) {
        container.innerHTML = events.map(event => {
            let editBtn = '';
            let deleteBtn = '';
            if (event.status === 'draft') {
                editBtn = `<button onclick="editDraftEvent(${event.id})" class="btn-secondary">Edit</button>`;
                deleteBtn = `<button onclick="deleteEvent(${event.id})" class="btn-danger">Delete</button>`;
            } else {
                // Hide delete for approved & completed events
                const eventDate = new Date(event.date);
                const today = new Date();
                if (!(event.status === 'approved' && eventDate < today)) {
                    deleteBtn = `<button onclick="deleteEvent(${event.id})" class="btn-danger">Delete</button>`;
                }
            }
            return `
                <div class="event-card">
                    <img src="${event.bannerUrl || 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" alt="${event.title}">
                    <div class="event-card-content">
                        <h3>${event.title}</h3>
                        <p><strong>Club:</strong> ${event.clubName}</p>
                        <p>${event.description.substring(0, 100)}...</p>
                        <div class="event-meta">
                            <span class="event-date">${formatDate(event.date)}</span>
                            <span class="event-status ${event.status}">${event.status}</span>
                        </div>
                        ${event.rejectionReason ? `<p class="rejection-reason"><strong>Rejection Reason:</strong> ${event.rejectionReason}</p>` : ''}
                        <div class="event-actions">
                            ${editBtn}
                            ${deleteBtn}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}
// Edit a draft event (only for drafts)
function editDraftEvent(eventId) {
    const draftList = drafts[currentUser.email] || [];
    const event = draftList.find(e => e.id === eventId);
    if (!event) return;
    // Reset and open the form
    const form = document.getElementById('eventForm');
    form.reset();
    document.getElementById('eventFormTitle').textContent = 'Edit Draft Event';
    document.getElementById('submitBtnText').textContent = 'Submit for Approval';
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventCategory').value = event.category;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventTime').value = event.time;
    document.getElementById('eventLocation').value = event.location;
    document.getElementById('eventDescription').value = event.description;
    document.getElementById('eventBanner').value = event.bannerUrl || '';
    document.getElementById('eventFormLink').value = event.formLink;
    document.getElementById('eventClubName').value = event.clubName;
    form.dataset.eventId = eventId;
    document.getElementById('eventFormModal').style.display = 'block';
}

function openCreateEventModal() {
    document.getElementById('eventFormTitle').textContent = 'Create New Event';
    document.getElementById('submitBtnText').textContent = 'Submit for Approval';
    document.getElementById('eventForm').reset();
    document.getElementById('eventForm').removeAttribute('data-event-id');
    // Club name: editable and empty
    const clubInput = document.getElementById('eventClubName');
    if (clubInput) {
        clubInput.value = '';
        clubInput.readOnly = false;
    }
    document.getElementById('eventFormModal').style.display = 'block';
}

function closeEventFormModal() {
    document.getElementById('eventFormModal').style.display = 'none';
}

function handleEventSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const eventId = event.target.dataset.eventId;
    
    // When coordinator submits, event is 'pending'. If editing a draft, remove from drafts and add to global events.
    // This event will show in 'My Events' and faculty dashboard.
    // When faculty approves, status becomes 'approved' and event is visible to students for registration.
    const eventData = {
        id: eventId ? parseInt(eventId) : Date.now(),
        title: formData.get('title'),
        category: formData.get('category'),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
        description: formData.get('description'),
        bannerUrl: formData.get('bannerUrl'),
        formLink: formData.get('formLink'),
        clubName: formData.get('clubName'),
        coordinator: currentUser.email,
        status: 'pending',
        createdAt: eventId ? (drafts[currentUser.email]?.find(e => e.id === parseInt(eventId))?.createdAt || events.find(e => e.id === parseInt(eventId))?.createdAt || new Date().toISOString()) : new Date().toISOString(),
        rejectionReason: null
    };
    // If editing a draft, remove from drafts
    if (eventId && drafts[currentUser.email]) {
        drafts[currentUser.email] = drafts[currentUser.email].filter(e => e.id !== parseInt(eventId));
        localStorage.setItem('drafts', JSON.stringify(drafts));
    }
    if (eventId) {
        // Update existing event in global events
        const index = events.findIndex(e => e.id === parseInt(eventId));
        if (index !== -1) {
            events[index] = eventData;
        } else {
            events.push(eventData);
        }
    } else {
        // Create new event in global events
        events.push(eventData);
    }
    saveEvents();
    closeEventFormModal();
    loadCoordinatorEvents();
    renderCoordinatorHome();
    showNotification(eventId ? 'Event updated successfully!' : 'Event created successfully! Waiting for faculty approval.', 'success');
}

function editEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    document.getElementById('eventFormTitle').textContent = 'Edit Event';
    document.getElementById('submitBtnText').textContent = 'Update Event';
    
    // Populate form
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventCategory').value = event.category;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventTime').value = event.time;
    document.getElementById('eventLocation').value = event.location;
    document.getElementById('eventDescription').value = event.description;
    document.getElementById('eventBanner').value = event.bannerUrl || '';
    document.getElementById('eventFormLink').value = event.formLink;
    document.getElementById('eventClubName').value = event.clubName;
    
    // Store event ID for update
    document.getElementById('eventForm').dataset.eventId = eventId;
    
    document.getElementById('eventFormModal').style.display = 'block';
}

function deleteEvent(eventId) {
    document.getElementById('deleteModal').style.display = 'block';
    document.getElementById('deleteModal').dataset.eventId = eventId;
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

function confirmDeleteEvent() {
    const eventId = parseInt(document.getElementById('deleteModal').dataset.eventId);
    events = events.filter(event => event.id !== eventId);
    saveEvents();
    
    closeDeleteModal();
    loadCoordinatorEvents();
    showNotification('Event deleted successfully!', 'success');
}

// ===== Coordinator Home (Explore) =====
function showCoordinatorSection(sectionId) {
    const sections = ['home', 'my-events', 'create', 'wishlist', 'history'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === sectionId) ? 'block' : 'none';
    });

    // Highlight nav
    const navIds = {
        'home': 'navHome',
        'my-events': 'navMyEvents',
        'create': 'navCreate',
        'wishlist': 'navWishlist',
        'history': 'navHistory'
    };
    Object.values(navIds).forEach(nid => {
        const link = document.getElementById(nid);
        if (link) link.classList.remove('active');
    });
    const activeLink = document.getElementById(navIds[sectionId]);
    if (activeLink) activeLink.classList.add('active');

    if (sectionId === 'wishlist') loadWishlistForCoordinator();
    if (sectionId === 'history') loadHistoryForCoordinator();
    if (sectionId === 'home') renderCoordinatorHome();
}

function setCoordinatorHomeStatus(status) {
    coordinatorHomeStatus = status;
    // update active tab visuals
    const buttons = document.querySelectorAll('#statusTabs .filter-tab');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderCoordinatorHome();
}

function setCoordinatorHomeCategory(category) {
    coordinatorHomeCategory = category;
    const buttons = document.querySelectorAll('#categoryTabs .filter-tab');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderCoordinatorHome();
}

function renderCoordinatorHome() {
    const container = document.getElementById('coordinatorHomeContainer');
    const noEvents = document.getElementById('noHomeEvents');
    if (!container) return;

    const today = new Date();
    let visibleEvents = events.filter(e => e.status === 'approved');

    visibleEvents = visibleEvents.filter(e => {
        const d = new Date(e.date);
        switch (coordinatorHomeStatus) {
            case 'upcoming':
                return d > today;
            case 'ongoing':
                return d.toDateString() === today.toDateString();
            case 'completed':
                return d < today;
            case 'active':
            default:
                return d >= new Date(today.toDateString());
        }
    });

    if (coordinatorHomeCategory) {
        visibleEvents = visibleEvents.filter(e => e.category === coordinatorHomeCategory);
    }

    if (visibleEvents.length === 0) {
        container.style.display = 'none';
        if (noEvents) noEvents.style.display = 'block';
        return;
    }

    container.style.display = 'grid';
    if (noEvents) noEvents.style.display = 'none';
    // Reuse student card renderer to include wishlist hearts
    displayStudentEvents(visibleEvents, 'coordinatorHomeContainer');
}

// ===== Drafts =====
function saveDraftFromForm() {
    const form = document.getElementById('eventForm');
    if (!form) return;
    const formData = new FormData(form);
    const eventId = form.dataset.eventId;
    const draftData = {
        id: eventId ? parseInt(eventId) : Date.now(),
        title: formData.get('title'),
        category: formData.get('category'),
        date: formData.get('date'),
        time: formData.get('time'),
        location: formData.get('location'),
        description: formData.get('description'),
        bannerUrl: formData.get('bannerUrl'),
        formLink: formData.get('formLink'),
        clubName: formData.get('clubName'),
        coordinator: currentUser.email,
        status: 'draft',
        createdAt: eventId ? (drafts[currentUser.email]?.find(e => e.id === parseInt(eventId))?.createdAt || new Date().toISOString()) : new Date().toISOString(),
        rejectionReason: null
    };
    // Save draft per coordinator
    if (!drafts[currentUser.email]) drafts[currentUser.email] = [];
    const idx = drafts[currentUser.email].findIndex(e => e.id === draftData.id);
    if (idx !== -1) {
        drafts[currentUser.email][idx] = draftData;
    } else {
        drafts[currentUser.email].push(draftData);
    }
    localStorage.setItem('drafts', JSON.stringify(drafts));
    closeEventFormModal();
    loadCoordinatorEvents();
    showNotification('Draft saved locally. You can submit it later for approval.', 'success');
}

function getCoordinatorClubName() {
    // Basic mapping; extend as needed
    if (!currentUser) return '';
    const map = {
        'coordinator@college.edu': 'Tech Club'
    };
    return map[currentUser.email] || 'Tech Club';
}

// ===== Wishlist & History for Coordinator =====
function loadWishlistForCoordinator() {
    const container = document.getElementById('wishlistContainer');
    const noWishlist = document.getElementById('noWishlist');
    if (!container) return;

    const wishIds = wishlist.filter(w => w.userEmail === currentUser.email).map(w => w.eventId);
    const items = events.filter(e => wishIds.includes(e.id) && e.status === 'approved');

    if (items.length === 0) {
        container.style.display = 'none';
        if (noWishlist) noWishlist.style.display = 'block';
        return;
    }
    container.style.display = 'grid';
    if (noWishlist) noWishlist.style.display = 'none';
    displayStudentEvents(items, 'wishlistContainer');
}

function loadHistoryForCoordinator() {
    const container = document.getElementById('historyContainer');
    const noHistory = document.getElementById('noHistory');
    if (!container) return;

    const myRegs = registrations.filter(r => r.userEmail === currentUser.email);
    const items = myRegs.map(r => {
        const evt = events.find(e => e.id === r.eventId);
        return evt ? { ...evt, _registeredAt: r.registeredAt } : null;
    }).filter(Boolean);

    if (items.length === 0) {
        container.style.display = 'none';
        if (noHistory) noHistory.style.display = 'block';
        return;
    }
    container.style.display = 'grid';
    if (noHistory) noHistory.style.display = 'none';

    container.innerHTML = items.map(event => `
        <div class="event-card" onclick="openEventModal(${event.id})">
            <img src="${event.bannerUrl || 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" alt="${event.title}">
            <div class="event-card-content">
                <div class="event-header">
                    <h3>${event.title}</h3>
                </div>
                <p><strong>Club:</strong> ${event.clubName}</p>
                <p>${event.description.substring(0, 100)}...</p>
                <div class="event-meta">
                    <span class="event-date">Participated: ${new Date(event._registeredAt).toLocaleDateString()}</span>
                    <span class="event-category">${event.category}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== FACULTY DASHBOARD ====================

function initializeFacultyDashboard() {
    loadFacultyRequests();
    updateFacultyStats();
    
    // Add event listeners
    const searchInput = document.getElementById('searchRequests');
    if (searchInput) {
        searchInput.addEventListener('input', searchRequests);
    }
}

function loadFacultyRequests() {
    // Only show submitted events (not drafts)
    const submittedEvents = events.filter(e => e.status !== 'draft');
    displayFacultyRequests(submittedEvents);
    updateFacultyStats();
}

function updateFacultyStats() {
    const pending = events.filter(event => event.status === 'pending').length;
    const approved = events.filter(event => event.status === 'approved').length;
    const denied = events.filter(event => event.status === 'denied').length;
    
    const pendingRequestsElement = document.getElementById('pendingRequests');
    const approvedRequestsElement = document.getElementById('approvedRequests');
    const deniedRequestsElement = document.getElementById('deniedRequests');
    
    if (pendingRequestsElement) pendingRequestsElement.textContent = pending;
    if (approvedRequestsElement) approvedRequestsElement.textContent = approved;
    if (deniedRequestsElement) deniedRequestsElement.textContent = denied;
}

function filterRequests(status) {
    let filteredEvents = events;
    
    if (status !== 'all') {
        filteredEvents = events.filter(event => event.status === status);
    }
    
    displayFacultyRequests(filteredEvents);
    updateSectionTitle(status);
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
}

function updateSectionTitle(status) {
    const titles = {
        'pending': 'Pending Requests',
        'approved': 'Approved Events',
        'denied': 'Denied Events',
        'all': 'All Events'
    };
    const sectionTitleElement = document.getElementById('sectionTitle');
    if (sectionTitleElement) {
        sectionTitleElement.textContent = titles[status] || 'Events';
    }
}

function searchRequests() {
    const searchTerm = document.getElementById('searchRequests').value.toLowerCase();
    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.coordinator.toLowerCase().includes(searchTerm) ||
        event.clubName.toLowerCase().includes(searchTerm)
    );
    
    displayFacultyRequests(filteredEvents);
}

function displayFacultyRequests(events) {
    const container = document.getElementById('requestsContainer');
    const noRequests = document.getElementById('noRequests');
    
    if (events.length === 0) {
        if (container) container.style.display = 'none';
        if (noRequests) noRequests.style.display = 'block';
        const noRequestsMessageElement = document.getElementById('noRequestsMessage');
        if (noRequestsMessageElement) {
            noRequestsMessageElement.textContent = 'No events found matching your criteria.';
        }
        return;
    }
    
    if (container) container.style.display = 'grid';
    if (noRequests) noRequests.style.display = 'none';
    
    if (container) {
        container.innerHTML = events.map(event => `
            <div class="request-card">
                <div class="request-card-header">
                    <h3>${event.title}</h3>
                    <span class="event-status ${event.status}">${event.status}</span>
                </div>
                <div class="request-card-content">
                    <p><strong>Club:</strong> ${event.clubName}</p>
                    <p><strong>Category:</strong> ${event.category}</p>
                    <p><strong>Date:</strong> ${formatDate(event.date)} at ${event.time}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p><strong>Coordinator:</strong> ${event.coordinator}</p>
                    <p>${event.description.substring(0, 150)}...</p>
                    ${event.rejectionReason ? `<p class="rejection-reason"><strong>Rejection Reason:</strong> ${event.rejectionReason}</p>` : ''}
                </div>
                <div class="request-card-actions">
                    <button onclick="viewRequestDetails(${event.id})" class="btn-secondary">View Details</button>
                    ${event.status === 'pending' ? `
                        <button onclick="approveEvent(${event.id})" class="btn-success">Approve</button>
                        <button onclick="denyEvent(${event.id})" class="btn-danger">Deny</button>
                    ` : event.status === 'approved' ? `
                        <button onclick="cancelEvent(${event.id})" class="btn-danger">Cancel Event</button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
}

function viewRequestDetails(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const modal = document.getElementById('requestModal');
    const content = document.getElementById('requestModalContent');
    const actions = document.getElementById('requestModalActions');
    
    content.innerHTML = `
        <div class="request-details">
            <img src="${event.bannerUrl || 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" alt="${event.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">
            <h3>${event.title}</h3>
            <div class="event-details">
                <p><strong>Club:</strong> ${event.clubName}</p>
                <p><strong>Category:</strong> ${event.category}</p>
                <p><strong>Date:</strong> ${formatDate(event.date)} at ${event.time}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Coordinator:</strong> ${event.coordinator}</p>
                <p><strong>Status:</strong> <span class="event-status ${event.status}">${event.status}</span></p>
                <p><strong>Description:</strong> ${event.description}</p>
                <p><strong>Registration Form:</strong> <a href="${event.formLink}" target="_blank">${event.formLink}</a></p>
                ${event.rejectionReason ? `<p><strong>Rejection Reason:</strong> ${event.rejectionReason}</p>` : ''}
            </div>
        </div>
    `;
    
    if (event.status === 'pending') {
        actions.innerHTML = `
            <button onclick="approveEvent(${event.id})" class="btn-success">Approve Event</button>
            <button onclick="denyEvent(${event.id})" class="btn-danger">Deny Event</button>
        `;
    } else if (event.status === 'approved') {
        actions.innerHTML = `
            <button onclick="cancelEvent(${event.id})" class="btn-danger">Cancel Event</button>
        `;
    } else {
        actions.innerHTML = '';
    }
    
    modal.style.display = 'block';
}

function closeRequestModal() {
    document.getElementById('requestModal').style.display = 'none';
}

function approveEvent(eventId) {
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
        events[eventIndex].status = 'approved';
        events[eventIndex].rejectionReason = null;
        saveEvents();
        loadFacultyRequests();
        // Update coordinator and student dashboards if open
        if (window.location.pathname.split('/').pop() === 'student-coordinator-dashboard.html') {
            loadCoordinatorEvents();
        }
        if (window.location.pathname.split('/').pop() === 'student-dashboard.html') {
            loadStudentEvents();
        }
        showNotification('Event approved successfully!', 'success');
        closeRequestModal();
    }
}

function denyEvent(eventId) {
    const rejectionReason = prompt('Please provide a reason for rejection:');
    if (rejectionReason === null) return; // User cancelled
    
    if (rejectionReason.trim() === '') {
        showNotification('Please provide a rejection reason', 'error');
        return;
    }
    
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
        events[eventIndex].status = 'denied';
        events[eventIndex].rejectionReason = rejectionReason.trim();
        saveEvents();
        loadFacultyRequests();
        showNotification('Event denied successfully!', 'success');
        closeRequestModal();
    }
}

function cancelEvent(eventId) {
    if (!confirm('Are you sure you want to cancel this approved event?')) return;
    
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
        events[eventIndex].status = 'cancelled';
        saveEvents();
        loadFacultyRequests();
        showNotification('Event cancelled successfully!', 'success');
        closeRequestModal();
    }
}


// ==================== UTILITY FUNCTIONS ====================

function displayEvents(events, containerId) {
    const container = document.getElementById(containerId);
    const noEvents = document.getElementById('noEvents');
    
    if (events.length === 0) {
        if (container) container.style.display = 'none';
        if (noEvents) noEvents.style.display = 'block';
        return;
    }
    
    if (container) container.style.display = 'grid';
    if (noEvents) noEvents.style.display = 'none';
    
    if (container) {
        container.innerHTML = events.map(event => `
            <div class="event-card" onclick="openEventModal(${event.id})">
                <img src="${event.bannerUrl || 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" alt="${event.title}">
                <div class="event-card-content">
                    <h3>${event.title}</h3>
                    <p>${event.description.substring(0, 100)}...</p>
                    <div class="event-meta">
                        <span class="event-date">${formatDate(event.date)}</span>
                        <span class="event-category">${event.category}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function loadPublicEvents() {
    const approvedEvents = events.filter(event => event.status === 'approved').slice(0, 3);
    displayEvents(approvedEvents, 'publicEventsGrid');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function saveRegistrations() {
    localStorage.setItem('registrations', JSON.stringify(registrations));
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ==================== EVENT LISTENERS ====================

function initializeEventListeners() {
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleHamburger);
    }
    
    // Close hamburger when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeHamburger);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = [
            'eventModal', 'eventFormModal', 'eventDetailsModal', 
            'requestModal', 'decisionModal', 'bulkModal', 
            'deleteModal', 'registrationModal', 'demoModal'
        ];
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            prevSlide();
        } else if (event.key === 'ArrowRight') {
            nextSlide();
        } else if (event.key === 'Escape') {
            // Close all modals
            document.querySelectorAll('[id$="Modal"]').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

function toggleHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
}

function closeHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// ==================== ADDITIONAL STUDENT FUNCTIONS ====================

function filterEventsByStatus(status) {
    const today = new Date();
    let filteredEvents = events.filter(event => event.status === 'approved');
    
    switch(status) {
        case 'upcoming':
            filteredEvents = filteredEvents.filter(event => new Date(event.date) > today);
            break;
        case 'ongoing':
            filteredEvents = filteredEvents.filter(event => new Date(event.date).toDateString() === today.toDateString());
            break;
        case 'completed':
            filteredEvents = filteredEvents.filter(event => new Date(event.date) < today);
            break;
    }
    
    const sectionTitleElement = document.getElementById('sectionTitle');
    if (sectionTitleElement) {
        sectionTitleElement.textContent = status.charAt(0).toUpperCase() + status.slice(1) + ' Events';
    }
    displayStudentEvents(filteredEvents, 'eventsContainer');
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
}

function showWishlistedEvents() {
    const wishlistedEventIds = wishlist
        .filter(item => item.userEmail === currentUser.email)
        .map(item => item.eventId);
    
    const wishlistedEvents = events.filter(event => 
        wishlistedEventIds.includes(event.id) && event.status === 'approved'
    );
    
    const sectionTitleElement = document.getElementById('sectionTitle');
    const noEventsMessageElement = document.getElementById('noEventsMessage');
    
    if (sectionTitleElement) sectionTitleElement.textContent = 'Wishlisted Events';
    if (noEventsMessageElement) noEventsMessageElement.textContent = 'You haven\'t added any events to your wishlist yet.';
    displayStudentEvents(wishlistedEvents, 'eventsContainer');
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
}

function showRegisteredEvents() {
    const registeredEventIds = registrations
        .filter(reg => reg.userEmail === currentUser.email)
        .map(reg => reg.eventId);
    
    const registeredEvents = events.filter(event => 
        registeredEventIds.includes(event.id) && event.status === 'approved'
    );
    
    const sectionTitleElement = document.getElementById('sectionTitle');
    const noEventsMessageElement = document.getElementById('noEventsMessage');
    
    if (sectionTitleElement) sectionTitleElement.textContent = 'Registered Events';
    if (noEventsMessageElement) noEventsMessageElement.textContent = 'You haven\'t registered for any events yet.';
    displayStudentEvents(registeredEvents, 'eventsContainer');
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
}

function showEventHistory() {
    const registeredEventIds = registrations
        .filter(reg => reg.userEmail === currentUser.email)
        .map(reg => reg.eventId);
    
    const participatedEvents = events.filter(event => 
        registeredEventIds.includes(event.id)
    );
    
    const sectionTitleElement = document.getElementById('sectionTitle');
    const noEventsMessageElement = document.getElementById('noEventsMessage');
    
    if (sectionTitleElement) sectionTitleElement.textContent = 'Event History';
    if (noEventsMessageElement) noEventsMessageElement.textContent = 'You haven\'t participated in any events yet.';
    displayStudentEvents(participatedEvents, 'eventsContainer');
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
}

// ==================== FACULTY FUNCTIONS ====================

function closeRejectionModal() {
    document.getElementById('rejectionModal').style.display = 'none';
    document.getElementById('rejectionReason').value = '';
}

function confirmRejection() {
    const rejectionReason = document.getElementById('rejectionReason').value.trim();
    if (!rejectionReason) {
        showNotification('Please provide a rejection reason', 'error');
        return;
    }
    
    const eventId = parseInt(document.getElementById('rejectionModal').dataset.eventId);
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex !== -1) {
        events[eventIndex].status = 'denied';
        events[eventIndex].rejectionReason = rejectionReason;
        saveEvents();
        loadFacultyRequests();
        showNotification('Event denied successfully!', 'success');
        closeRejectionModal();
    }
}

function denyEvent(eventId) {
    document.getElementById('rejectionModal').dataset.eventId = eventId;
    document.getElementById('rejectionModal').style.display = 'block';
}

function cancelEvent(eventId) {
    if (!confirm('Are you sure you want to cancel this approved event?')) return;
    
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
        events[eventIndex].status = 'cancelled';
        saveEvents();
        loadFacultyRequests();
        showNotification('Event cancelled successfully!', 'success');
        closeRequestModal();
    }
}