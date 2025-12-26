/**
 * In Person Courses Page JavaScript
 * Connects to n8n webhook for place search
 */

// n8n Webhook URL - UPDATE THIS with your actual n8n webhook URL
const N8N_WEBHOOK_URL = 'https://YOUR_N8N_INSTANCE.app.n8n.cloud/webhook/search-places';

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    setupSearchForm();
});

function setupSearchForm() {
    const form = document.getElementById('searchForm');
    const searchBtn = document.getElementById('searchBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const keyword = document.getElementById('keyword').value.trim();
        const city = document.getElementById('city').value.trim();

        if (!keyword || !city) {
            showToast('Please fill in both fields', 'error');
            return;
        }

        await searchPlaces(keyword, city);
    });
}

async function searchPlaces(keyword, city) {
    const searchBtn = document.getElementById('searchBtn');
    const btnText = searchBtn.querySelector('.btn-text');
    const btnSpinner = searchBtn.querySelector('.btn-spinner');

    // Show loading state
    hideAllStates();
    document.getElementById('loadingState').classList.remove('hidden');
    searchBtn.disabled = true;
    btnText.textContent = 'Searching...';
    btnSpinner.classList.remove('hidden');

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ keyword, city })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const places = await response.json();

        hideAllStates();

        if (places && places.length > 0) {
            displayResults(places, keyword, city);
        } else {
            document.getElementById('emptyState').classList.remove('hidden');
        }

    } catch (error) {
        console.error('Search error:', error);
        hideAllStates();
        document.getElementById('errorState').classList.remove('hidden');
        document.getElementById('errorMessage').textContent =
            error.message.includes('Failed to fetch')
                ? 'Could not connect to search service. Please check your n8n webhook URL.'
                : error.message;
    } finally {
        // Reset button
        searchBtn.disabled = false;
        btnText.textContent = 'Search Places';
        btnSpinner.classList.add('hidden');
    }
}

function hideAllStates() {
    document.getElementById('initialState').classList.add('hidden');
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('resultsContainer').classList.add('hidden');
    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('errorState').classList.add('hidden');
}

function displayResults(places, keyword, city) {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsCount = document.getElementById('resultsCount');
    const placesGrid = document.getElementById('placesGrid');

    resultsTitle.textContent = `${keyword} in ${city}`;
    resultsCount.textContent = `${places.length} place${places.length !== 1 ? 's' : ''} found`;

    placesGrid.innerHTML = places.map(place => createPlaceCard(place)).join('');

    resultsContainer.classList.remove('hidden');
}

function createPlaceCard(place) {
    const thumbnailUrl = place.thumbnail || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400';
    const rating = place.rating ? `⭐ ${place.rating}` : '';
    const reviews = place.reviews ? `(${place.reviews} reviews)` : '';
    const type = place.type || 'Learning Center';

    // Create Google Maps link
    let mapsLink = '#';
    if (place.gps_coordinates) {
        const { latitude, longitude } = place.gps_coordinates;
        mapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    } else if (place.address) {
        mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`;
    }

    return `
        <div class="place-card">
            <img src="${thumbnailUrl}" alt="${escapeHtml(place.title)}" class="place-thumbnail" 
                 onerror="this.src='https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400'">
            <div class="place-content">
                <span class="place-type">${escapeHtml(type)}</span>
                <h3 class="place-title">${escapeHtml(place.title)}</h3>
                ${place.address ? `<p class="place-address">${escapeHtml(place.address)}</p>` : ''}
                <div class="place-meta">
                    ${rating ? `<span class="place-rating">${rating}</span>` : ''}
                    ${reviews ? `<span class="place-reviews">${reviews}</span>` : ''}
                </div>
                <div class="place-actions">
                    ${place.website ? `<a href="${place.website}" target="_blank" rel="noopener" class="place-btn place-btn-primary">🌐 Website</a>` : ''}
                    <a href="${mapsLink}" target="_blank" rel="noopener" class="place-btn place-btn-secondary">📍 Directions</a>
                    ${place.phone ? `<a href="tel:${place.phone}" class="place-btn place-btn-secondary">📞 Call</a>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Helper function if not defined in utils.js
if (typeof escapeHtml === 'undefined') {
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
}
