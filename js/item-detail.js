// Item detail page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    
    // Get item ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    
    if (itemId) {
        loadItemDetail(itemId);
    } else {
        showItemNotFound();
    }
});

function loadItemDetail(itemId) {
    const loadingEl = document.getElementById('item-loading');
    const detailEl = document.getElementById('item-detail');
    const notFoundEl = document.getElementById('item-not-found');
    
    try {
        // Get item from localStorage
        const item = window.itemStorage.getItemById(itemId);
        
        if (item) {
            displayItemDetail(item);
        } else {
            showItemNotFound();
        }
    } catch (error) {
        console.error('Error loading item:', error);
        showItemNotFound();
    }
    
    loadingEl.classList.add('hidden');
}

function displayItemDetail(item) {
    const detailEl = document.getElementById('item-detail');
    
    // Update item details
    document.getElementById('item-image').src = item.image || 'https://images.pexels.com/photos/1166643/pexels-photo-1166643.jpeg';
    document.getElementById('item-image').alt = item.title;
    
    const statusEl = document.getElementById('item-status');
    const statusColor = item.status === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
    statusEl.className = `px-3 py-1 rounded-full text-sm font-medium ${statusColor}`;
    statusEl.textContent = item.status.charAt(0).toUpperCase() + item.status.slice(1);
    
    document.getElementById('item-date').textContent = formatDate(item.date);
    document.getElementById('item-title').textContent = item.title;
    document.getElementById('item-location').textContent = item.location;
    document.getElementById('item-category').textContent = item.category;
    document.getElementById('item-description').textContent = item.description;
    
    // Update contact information
    document.getElementById('item-contact-name').textContent = item.name;
    document.getElementById('item-contact-email').textContent = item.email;
    
    if (item.phone) {
        document.getElementById('item-contact-phone').textContent = item.phone;
        document.getElementById('item-contact-phone-container').classList.remove('hidden');
    } else {
        document.getElementById('item-contact-phone-container').classList.add('hidden');
    }
    
    // Contact button
    const contactBtn = document.getElementById('contact-btn');
    contactBtn.addEventListener('click', () => {
        const subject = `Regarding: ${item.title}`;
        const body = `Hi ${item.name},%0D%0A%0D%0AI saw your ${item.status} item post for "${item.title}" and would like to get in touch.%0D%0A%0D%0AThanks!`;
        window.location.href = `mailto:${item.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
    
    detailEl.classList.remove('hidden');
    lucide.createIcons();
}

function showItemNotFound() {
    document.getElementById('item-loading').classList.add('hidden');
    document.getElementById('item-not-found').classList.remove('hidden');
    lucide.createIcons();
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