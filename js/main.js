// Main JavaScript file for the homepage

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Search form handling
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `browse.html?q=${encodeURIComponent(query)}`;
            } else {
                window.location.href = 'browse.html';
            }
        });
    }
    
    // Load recent items
    loadRecentItems();
});

function loadRecentItems() {
    const container = document.getElementById('recent-items');
    if (!container) return;
    
    try {
        // Get recent items from localStorage
        const recentItems = window.itemStorage.getAllItems().slice(0, 3);
        
        if (recentItems.length > 0) {
            container.innerHTML = recentItems.map(item => createItemCard(item)).join('');
        } else {
            container.innerHTML = '<p class="text-center text-gray-500 col-span-full">No items reported yet. Be the first to report an item!</p>';
        }
        
        // Re-initialize icons for new content
        lucide.createIcons();
    } catch (error) {
        console.error('Error loading recent items:', error);
        container.innerHTML = '<p class="text-center text-red-500 col-span-full">Error loading items. Please refresh the page.</p>';
    }
}

function createItemCard(item) {
    const statusColor = item.status === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
    
    return `
        <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" onclick="window.location.href='item-detail.html?id=${item.id}'">
            <div class="aspect-w-16 aspect-h-9">
                <img src="${item.image || 'https://images.pexels.com/photos/1166643/pexels-photo-1166643.jpeg'}" alt="${item.title}" class="w-full h-48 object-cover rounded-t-lg">
            </div>
            <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${statusColor}">
                        ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                    <span class="text-sm text-gray-500">${formatDate(item.date)}</span>
                </div>
                <h3 class="font-semibold text-gray-900 mb-1">${item.title}</h3>
                <div class="flex items-center text-gray-600 text-sm mb-2">
                    <i data-lucide="map-pin" class="h-4 w-4 mr-1"></i>
                    <span>${item.location}</span>
                </div>
                <div class="flex items-center text-gray-600 text-sm">
                    <i data-lucide="tag" class="h-4 w-4 mr-1"></i>
                    <span>${item.category}</span>
                </div>
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}