// Admin page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    loadAdminData();
});

function loadAdminData() {
    try {
        // Get statistics from localStorage
        const stats = window.itemStorage.getStats();
        
        document.getElementById('total-lost').textContent = stats.totalLost;
        document.getElementById('total-found').textContent = stats.totalFound;
        document.getElementById('total-items').textContent = stats.totalItems;
        document.getElementById('this-week').textContent = stats.thisWeek;
        
        // Load all items for admin table
        const items = window.itemStorage.getAllItems();
        const tableBody = document.getElementById('admin-items-table');
        
        if (items.length > 0) {
            tableBody.innerHTML = items.map(item => createAdminTableRow(item)).join('');
        } else {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                        No items found. Items will appear here when users submit reports.
                    </td>
                </tr>
            `;
        }
        
        lucide.createIcons();
    } catch (error) {
        console.error('Error loading admin data:', error);
        showNotification('Error loading admin data', 'error');
    }
}

function createAdminTableRow(item) {
    const statusColor = item.status === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
    
    return `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <img src="${item.image || 'https://images.pexels.com/photos/1166643/pexels-photo-1166643.jpeg'}" 
                             alt="${item.title}" class="h-10 w-10 rounded-lg object-cover">
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${item.title}</div>
                        <div class="text-sm text-gray-500">${item.category}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${statusColor}">
                    ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${item.location}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formatDate(item.date)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${item.name}</div>
                <div class="text-sm text-gray-500">${item.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="viewItem(${item.id})" class="text-blue-600 hover:text-blue-900 mr-3">
                    View
                </button>
                <button onclick="deleteItem(${item.id})" class="text-red-600 hover:text-red-900">
                    Delete
                </button>
            </td>
        </tr>
    `;
}

function viewItem(id) {
    window.location.href = `item-detail.html?id=${id}`;
}

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            const success = window.itemStorage.deleteItem(id);
            
            if (success) {
                // Reload admin data to refresh the table
                loadAdminData();
                showNotification('Item deleted successfully', 'success');
            } else {
                showNotification('Failed to delete item', 'error');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            showNotification('Error deleting item', 'error');
        }
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';
    
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-x-full`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i data-lucide="${icon}" class="h-5 w-5 mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}