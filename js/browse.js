// Browse page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || '';
    
    // Set search input value
    const searchInput = document.getElementById('search-input');
    if (searchInput && searchQuery) {
        searchInput.value = searchQuery;
    }
    
    // Load items
    loadItems();
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(loadItems, 300));
    }
    
    // Filter functionality
    const statusFilter = document.getElementById('status-filter');
    const categoryFilter = document.getElementById('category-filter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', loadItems);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', loadItems);
    }
});

function loadItems() {
    const loadingEl = document.getElementById('items-loading');
    const gridEl = document.getElementById('items-grid');
    const noItemsEl = document.getElementById('no-items');
    
    // Show loading
    loadingEl.classList.remove('hidden');
    gridEl.classList.add('hidden');
    noItemsEl.classList.add('hidden');
    
    try {
        // Get filter values
        const searchQuery = document.getElementById('search-input').value.trim();
        const statusFilter = document.getElementById('status-filter').value;
        const categoryFilter = document.getElementById('category-filter').value;
        
        // Search items using localStorage
        const items = window.itemStorage.searchItems(searchQuery, {
            status: statusFilter,
            category: categoryFilter
        });
        
        // Hide loading
        loadingEl.classList.add('hidden');
        
        if (items && items.length > 0) {
            gridEl.innerHTML = items.map(item => createItemCard(item)).join('');
            gridEl.classList.remove('hidden');
            lucide.createIcons();
        } else {
            noItemsEl.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error loading items:', error);
        loadingEl.classList.add('hidden');
        noItemsEl.classList.remove('hidden');
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}