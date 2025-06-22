// Submit page JavaScript

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
    
    // Set today's date as default
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Image upload handling
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    imagePreview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Form submission
    const form = document.getElementById('submit-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});

async function handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Get form values
    const itemData = {
        status: formData.get('status'),
        title: formData.get('title'),
        category: formData.get('category'),
        description: formData.get('description'),
        location: formData.get('location'),
        date: formData.get('date'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || null
    };
    
    // Handle image
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
        // Convert image to base64 for localStorage
        const reader = new FileReader();
        reader.onload = function(e) {
            itemData.image = e.target.result;
            saveItem(itemData, form);
        };
        reader.readAsDataURL(imageFile);
    } else {
        // Use default image
        itemData.image = getDefaultImage(itemData.category);
        saveItem(itemData, form);
    }
}

function saveItem(itemData, form) {
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
        // Save to localStorage
        const newItem = window.itemStorage.addItem(itemData);
        
        console.log('Item submitted:', newItem);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        document.getElementById('image-preview').classList.add('hidden');
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        
        // Redirect to item detail page after a short delay
        setTimeout(() => {
            window.location.href = `item-detail.html?id=${newItem.id}`;
        }, 2000);
        
    } catch (error) {
        console.error('Error submitting item:', error);
        showErrorMessage('Failed to submit item. Please try again.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function getDefaultImage(category) {
    const defaultImages = {
        'electronics': 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
        'bags': 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg',
        'books': 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        'clothing': 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
        'jewelry': 'https://images.pexels.com/photos/1454428/pexels-photo-1454428.jpeg',
        'keys': 'https://images.pexels.com/photos/279810/pexels-photo-279810.jpeg',
        'other': 'https://images.pexels.com/photos/1166643/pexels-photo-1166643.jpeg'
    };
    
    return defaultImages[category.toLowerCase()] || defaultImages['other'];
}

function showSuccessMessage() {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-x-full';
    notification.innerHTML = `
        <div class="flex items-center">
            <i data-lucide="check-circle" class="h-5 w-5 mr-2"></i>
            <span>Item submitted successfully! Redirecting to item page...</span>
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

function showErrorMessage(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-x-full';
    notification.innerHTML = `
        <div class="flex items-center">
            <i data-lucide="alert-circle" class="h-5 w-5 mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}