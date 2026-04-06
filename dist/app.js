// InventoryItem interface (converted to JavaScript)

// Array to store inventory items
let inventory = [];

// DOM elements
const inventoryForm = document.getElementById('inventoryForm');
const addButton = document.getElementById('addButton');
const updateButton = document.getElementById('updateButton');
const cancelButton = document.getElementById('cancelButton');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const displayAllButton = document.getElementById('displayAllButton');
const displayPopularButton = document.getElementById('displayPopularButton');
const itemsContainer = document.getElementById('itemsContainer');
const message = document.getElementById('message');

// Current item being edited
let currentItem = null;

// Initialize the application
function init() {
    // Add event listeners
    inventoryForm.addEventListener('submit', handleAddItem);
    updateButton.addEventListener('click', handleUpdateItem);
    cancelButton.addEventListener('click', cancelEdit);
    searchButton.addEventListener('click', handleSearch);
    displayAllButton.addEventListener('click', displayAllItems);
    displayPopularButton.addEventListener('click', displayPopularItems);
    
    // Display all items initially
    displayAllItems();
}

// Handle form submission for adding items
function handleAddItem(e) {
    e.preventDefault();
    
    const itemId = document.getElementById('itemId').value;
    const itemName = document.getElementById('itemName').value;
    const category = document.getElementById('category').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    const supplier = document.getElementById('supplier').value;
    const stockStatus = document.getElementById('stockStatus').value;
    const popularItem = document.getElementById('popularItem').value;
    const comment = document.getElementById('comment').value;
    
    // Validate form data
    if (!itemId || !itemName || !category || isNaN(quantity) || isNaN(price) || !supplier || !stockStatus || !popularItem) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Check if item ID already exists
    if (inventory.some(item => item.itemId === itemId)) {
        showMessage('Item ID already exists. Please use a unique ID.', 'error');
        return;
    }
    
    // Create new item
    const newItem = {
        itemId,
        itemName,
        category,
        quantity,
        price,
        supplier,
        stockStatus,
        popularItem,
        comment
    };
    
    // Add item to inventory
    inventory.push(newItem);
    
    // Reset form
    inventoryForm.reset();
    
    // Display updated inventory
    displayAllItems();
    
    // Show success message
    showMessage('Item added successfully', 'success');
}

// Handle updating items
function handleUpdateItem() {
    if (!currentItem) return;
    
    const itemId = document.getElementById('itemId').value;
    const itemName = document.getElementById('itemName').value;
    const category = document.getElementById('category').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    const supplier = document.getElementById('supplier').value;
    const stockStatus = document.getElementById('stockStatus').value;
    const popularItem = document.getElementById('popularItem').value;
    const comment = document.getElementById('comment').value;
    
    // Validate form data
    if (!itemId || !itemName || !category || isNaN(quantity) || isNaN(price) || !supplier || !stockStatus || !popularItem) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Check if item ID is unique (except for the current item)
    if (inventory.some(item => item.itemId === itemId && item.itemId !== currentItem.itemId)) {
        showMessage('Item ID already exists. Please use a unique ID.', 'error');
        return;
    }
    
    // Update the item
    const index = inventory.findIndex(item => item.itemName === currentItem.itemName);
    if (index !== -1) {
        inventory[index] = {
            itemId,
            itemName,
            category,
            quantity,
            price,
            supplier,
            stockStatus,
            popularItem,
            comment
        };
    }
    
    // Reset form and edit mode
    cancelEdit();
    
    // Display updated inventory
    displayAllItems();
    
    // Show success message
    showMessage('Item updated successfully', 'success');
}

// Cancel edit mode
function cancelEdit() {
    currentItem = null;
    inventoryForm.reset();
    addButton.style.display = 'inline';
    updateButton.style.display = 'none';
    cancelButton.style.display = 'none';
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredItems = inventory.filter(item => item.itemName.toLowerCase().includes(searchTerm));
    displayItems(filteredItems);
}

// Display all items
function displayAllItems() {
    displayItems(inventory);
}

// Display only popular items
function displayPopularItems() {
    const popularItems = inventory.filter(item => item.popularItem === 'Yes');
    displayItems(popularItems);
}

// Display items in the container
function displayItems(items) {
    if (items.length === 0) {
        itemsContainer.innerHTML = '<p>No items found</p>';
        return;
    }
    
    itemsContainer.innerHTML = items.map(item => `
        <div class="item-card">
            <h3>${item.itemName}</h3>
            <div class="item-details">
                <p><strong>ID:</strong> ${item.itemId}</p>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Quantity:</strong> ${item.quantity}</p>
                <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
                <p><strong>Supplier:</strong> ${item.supplier}</p>
                <p><strong>Stock Status:</strong> ${item.stockStatus}</p>
                <p><strong>Popular:</strong> ${item.popularItem}</p>
                ${item.comment ? `<p><strong>Comment:</strong> ${item.comment}</p>` : ''}
            </div>
            <div class="item-actions">
                <button class="edit-button" onclick="editItem('${item.itemName}')">Edit</button>
                <button class="delete-button" onclick="deleteItem('${item.itemName}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Edit an item
function editItem(itemName) {
    const item = inventory.find(item => item.itemName === itemName);
    if (!item) return;
    
    currentItem = item;
    
    // Fill form with item data
    document.getElementById('itemId').value = item.itemId;
    document.getElementById('itemName').value = item.itemName;
    document.getElementById('category').value = item.category;
    document.getElementById('quantity').value = item.quantity.toString();
    document.getElementById('price').value = item.price.toString();
    document.getElementById('supplier').value = item.supplier;
    document.getElementById('stockStatus').value = item.stockStatus;
    document.getElementById('popularItem').value = item.popularItem;
    document.getElementById('comment').value = item.comment;
    
    // Switch to edit mode
    addButton.style.display = 'none';
    updateButton.style.display = 'inline';
    cancelButton.style.display = 'inline';
}

// Delete an item
function deleteItem(itemName) {
    if (confirm(`Are you sure you want to delete ${itemName}?`)) {
        inventory = inventory.filter(item => item.itemName !== itemName);
        displayAllItems();
        showMessage('Item deleted successfully', 'success');
    }
}

// Show message
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
    
    // Clear message after 3 seconds
    setTimeout(() => {
        message.textContent = '';
        message.className = '';
    }, 3000);
}

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
