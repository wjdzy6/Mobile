/**
 * PROG2005 A2 - Part 1: TypeScript Inventory System
 * Author: [Your Name]
 *
 * This script implements a browser-based inventory management system
 * without server-side interaction.
 */

// 1. Define the Data Model (Interface)
interface InventoryItem {
    id: number;
    name: string;
    category: "Electronics" | "Furniture" | "Clothing" | "Tools" | "Miscellaneous";
    quantity: number;
    price: number;
    supplier: string;
    stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
    popular: "Yes" | "No";
    comment: string;
}

// 2. Initialize Data Structure (In-Memory Array)
// Using hardcoded data for demonstration (meets requirement of "hardcoded or empty")
let inventory: InventoryItem[] = [
    {
        id: 1,
        name: "Smart TV",
        category: "Electronics",
        quantity: 50,
        price: 899.99,
        supplier: "Samsung",
        stockStatus: "In Stock",
        popular: "Yes",
        comment: "4K Resolution"
    },
    {
        id: 2,
        name: "Office Chair",
        category: "Furniture",
        quantity: 20,
        price: 299.50,
        supplier: "Herman Miller",
        stockStatus: "Low Stock",
        popular: "No",
        comment: "Ergonomic design"
    }
];

// 3. DOM Elements
const itemForm = document.getElementById('itemForm') as HTMLFormElement;
const resultsSection = document.getElementById('results') as HTMLElement;

// 4. Core Functions

/**
 * Displays a message in the results section.
 * @param text - The message text.
 * @param type - The type of message (success/error).
 */
function displayMessage(text: string, type: 'success' | 'error' = 'success'): void {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    resultsSection.appendChild(messageDiv);

    // Auto-remove success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }
}

/**
 * Validates if an ID already exists in the inventory.
 * @param id - The ID to check.
 * @returns True if ID is unique, false if duplicate.
 */
function isIdUnique(id: number): boolean {
    return !inventory.some(item => item.id === id);
}

/**
 * Adds a new item to the inventory.
 * @param item - The item object to add.
 * @returns Boolean indicating success.
 */
function addItem(item: InventoryItem): boolean {
    if (!isIdUnique(item.id)) {
        displayMessage(`Error: Item ID ${item.id} already exists. Please use a unique ID.`, 'error');
        return false;
    }
    inventory.push(item);
    displayMessage(`Success: ${item.name} has been added to the inventory.`);
    return true;
}

/**
 * Updates an existing item based on its NAME.
 * @param targetName - The name of the item to update.
 * @param updatedData - The new data for the item.
 * @returns Boolean indicating success.
 */
function updateItemByName(targetName: string, updatedData: InventoryItem): boolean {
    const index = inventory.findIndex(item => item.name.toLowerCase() === targetName.toLowerCase());

    if (index === -1) {
        displayMessage(`Error: Item named "${targetName}" not found for update.`, 'error');
        return false;
    }

    // Prevent changing the ID to a duplicate (unless it's the same item)
    if (updatedData.id !== inventory[index].id && !isIdUnique(updatedData.id)) {
        displayMessage(`Error: Cannot change ID to ${updatedData.id} as it already exists.`, 'error');
        return false;
    }

    inventory[index] = updatedData;
    displayMessage(`Success: ${targetName} has been updated.`);
    return true;
}

/**
 * Deletes an item from the inventory based on its NAME.
 * @param name - The name of the item to delete.
 * @returns Boolean indicating success.
 */
function deleteItemByName(name: string): boolean {
    // In a real app, you'd have a confirm dialog here.
    // Since we can't use alert, we simulate the logic in the UI call.
    const index = inventory.findIndex(item => item.name.toLowerCase() === name.toLowerCase());

    if (index === -1) {
        displayMessage(`Error: Item named "${name}" not found for deletion.`, 'error');
        return false;
    }

    const itemName = inventory[index].name;
    inventory.splice(index, 1);
    displayMessage(`Success: ${itemName} has been deleted from the inventory.`);
    return true;
}

/**
 * Searches for items by name (case insensitive).
 * @param searchTerm - The name to search for.
 * @returns Array of matching items.
 */
function searchItems(searchTerm: string): InventoryItem[] {
    return inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

/**
 * Filters and returns only popular items.
 * @returns Array of popular items.
 */
function getPopularItems(): InventoryItem[] {
    return inventory.filter(item => item.popular === "Yes");
}

/**
 * Renders an array of items as an HTML table in the results section.
 * @param items - The array of items to display.
 * @param title - The title for the table.
 */
function renderTable(items: InventoryItem[], title: string): void {
    resultsSection.innerHTML = ''; // Clear previous messages/tables

    if (items.length === 0) {
        displayMessage("No items match the current criteria.", 'error');
        return;
    }

    let tableHTML = `
        <h3>${title} (${items.length} items)</h3>
        <table>
            <thead>
                <tr>
                    <th>ID</th> <th>Name</th> <th>Category</th> <th>Qty</th>
                    <th>Price</th> <th>Supplier</th> <th>Status</th>
                    <th>Popular</th> <th>Comment</th>
                </tr>
            </thead>
            <tbody>
    `;

    items.forEach(item => {
        tableHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.supplier}</td>
                <td>${item.stockStatus}</td>
                <td>${item.popular}</td>
                <td>${item.comment || '-'}</td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    resultsSection.insertAdjacentHTML('beforeend', tableHTML);
}

// 5. Event Handlers (UI Interaction)

// Handle Form Submission (Add or Update)
itemForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const id = parseInt((document.getElementById('id') as HTMLInputElement).value);
    const name = (document.getElementById('name') as HTMLInputElement).value.trim();
    const category = (document.getElementById('category') as HTMLSelectElement).value as InventoryItem['category'];
    const quantity = parseInt((document.getElementById('quantity') as HTMLInputElement).value);
    const price = parseFloat((document.getElementById('price') as HTMLInputElement).value);
    const supplier = (document.getElementById('supplier') as HTMLInputElement).value.trim();
    const stockStatus = (document.getElementById('stockStatus') as HTMLSelectElement).value as InventoryItem['stockStatus'];
    const popular = (document.getElementById('popular') as HTMLSelectElement).value as InventoryItem['popular'];
    const comment = (document.getElementById('comment') as HTMLInputElement).value.trim();

    // Simple validation
    if (!name || isNaN(id) || isNaN(quantity) || isNaN(price)) {
        displayMessage("Error: Please fill in all required fields correctly.", 'error');
        return;
    }

    const newItem: InventoryItem = { id, name, category, quantity, price, supplier, stockStatus, popular, comment };

    // Check if the form is being used to update an existing item
    // We can simulate this by checking if the name already exists
    // (In a real GUI, there would be a dedicated "Edit" button)
    const existingIndex = inventory.findIndex(item => item.name.toLowerCase() === name.toLowerCase());

    if (existingIndex !== -1) {
        // Update logic
        updateItemByName(name, newItem);
    } else {
        // Add logic
        addItem(newItem);
    }

    // Reset form
    itemForm.reset();
});

// Search Function
function searchItem(): void {
    const searchTerm = (document.getElementById('searchInput') as HTMLInputElement).value.trim();
    if (!searchTerm) {
        displayMessage("Please enter a name to search.", 'error');
        return;
    }
    const results = searchItems(searchTerm);
    renderTable(results, `Search Results for "${searchTerm}"`);
}

// Display All Items
function displayAllItems(): void {
    renderTable(inventory, "All Inventory Items");
}

// Display Popular Items
function displayPopularItems(): void {
    const popularItems = getPopularItems();
    renderTable(popularItems, "Popular Items (Highlight)");
}

// Delete Function (Simulating confirmation without Alert)
function deleteItem(): void {
    const deleteNameInput = (document.getElementById('deleteName') as HTMLInputElement).value.trim();

    if (!deleteNameInput) {
        displayMessage("Please enter the Item Name you wish to delete.", 'error');
        return;
    }

    // In a real scenario, we would ask the user to click a button in the table row.
    // Since we are using a text input, we proceed directly but check existence first.
    const exists = inventory.some(item => item.name.toLowerCase() === deleteNameInput.toLowerCase());

    if (exists) {
        // Simulate user confirmation by just asking them to be sure in the input.
        // In a full GUI, a modal dialog would appear.
        deleteItemByName(deleteNameInput);
        // Re-render the table if it's visible
        if (resultsSection.innerHTML.includes(deleteNameInput)) {
            displayAllItems(); // Refresh the view
        }
    } else {
        displayMessage(`Item named "${deleteNameInput}" not found. Cannot delete.`, 'error');
    }
}