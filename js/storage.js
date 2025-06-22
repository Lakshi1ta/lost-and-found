// Local Storage Management for Lost & Found Items

class ItemStorage {
    constructor() {
        this.storageKey = 'lostFoundItems';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            // Initialize with sample data
            const sampleItems = [
                {
                    id: 1,
                    title: 'iPhone 14 Pro',
                    category: 'Electronics',
                    location: 'Library 3rd Floor',
                    status: 'found',
                    date: new Date().toISOString().split('T')[0],
                    description: 'Space Gray iPhone 14 Pro found in study area',
                    name: 'Sarah Johnson',
                    email: 'sarah.johnson@college.edu',
                    phone: '(555) 123-4567',
                    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: 'Black Backpack',
                    category: 'Bags',
                    location: 'Student Center',
                    status: 'lost',
                    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                    description: 'Nike black backpack with laptop inside',
                    name: 'Mike Chen',
                    email: 'mike.chen@college.edu',
                    phone: null,
                    image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg',
                    createdAt: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 3,
                    title: 'Chemistry Textbook',
                    category: 'Books',
                    location: 'Science Building',
                    status: 'found',
                    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
                    description: 'Chemistry 101 textbook with notes inside',
                    name: 'Emily Davis',
                    email: 'emily.davis@college.edu',
                    phone: '(555) 987-6543',
                    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
                    createdAt: new Date(Date.now() - 172800000).toISOString()
                }
            ];
            this.saveItems(sampleItems);
        }
    }

    getAllItems() {
        try {
            const items = localStorage.getItem(this.storageKey);
            return items ? JSON.parse(items) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    }

    getItemById(id) {
        const items = this.getAllItems();
        return items.find(item => item.id === parseInt(id));
    }

    addItem(itemData) {
        try {
            const items = this.getAllItems();
            const newItem = {
                ...itemData,
                id: Date.now(),
                createdAt: new Date().toISOString()
            };
            items.unshift(newItem); // Add to beginning of array
            this.saveItems(items);
            return newItem;
        } catch (error) {
            console.error('Error adding item:', error);
            throw error;
        }
    }

    updateItem(id, updates) {
        try {
            const items = this.getAllItems();
            const index = items.findIndex(item => item.id === parseInt(id));
            if (index !== -1) {
                items[index] = { ...items[index], ...updates };
                this.saveItems(items);
                return items[index];
            }
            return null;
        } catch (error) {
            console.error('Error updating item:', error);
            throw error;
        }
    }

    deleteItem(id) {
        try {
            const items = this.getAllItems();
            const filteredItems = items.filter(item => item.id !== parseInt(id));
            this.saveItems(filteredItems);
            return true;
        } catch (error) {
            console.error('Error deleting item:', error);
            return false;
        }
    }

    searchItems(query, filters = {}) {
        let items = this.getAllItems();
        
        // Search by query
        if (query && query.trim()) {
            const searchTerm = query.toLowerCase();
            items = items.filter(item =>
                item.title.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.location.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm)
            );
        }

        // Filter by status
        if (filters.status) {
            items = items.filter(item => item.status === filters.status);
        }

        // Filter by category
        if (filters.category) {
            items = items.filter(item => item.category.toLowerCase() === filters.category.toLowerCase());
        }

        // Sort by creation date (newest first)
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return items;
    }

    getStats() {
        const items = this.getAllItems();
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        return {
            totalLost: items.filter(item => item.status === 'lost').length,
            totalFound: items.filter(item => item.status === 'found').length,
            totalItems: items.length,
            thisWeek: items.filter(item => new Date(item.createdAt) >= oneWeekAgo).length
        };
    }

    saveItems(items) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(items));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            throw error;
        }
    }

    clearAllData() {
        localStorage.removeItem(this.storageKey);
        this.initializeStorage();
    }
}

// Create global instance
window.itemStorage = new ItemStorage();