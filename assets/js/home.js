let products = [];
const storedProducts = localStorage.getItem('products');

if (storedProducts) {
    products = JSON.parse(storedProducts);
} else {
    products = [
        { id: 1, name: "Fresh Organic Milk", category: "Dairy", price: 500, stock: 50, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80" },
        { id: 2, name: "Whole Wheat Bread", category: "Bakery", price: 450, stock: 100, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80" },
        { id: 3, name: "Fresh Apples", category: "Fruits", price: 150, stock: 75, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80" },
        { id: 4, name: "Chicken Breast", category: "Meat", price: 1200, stock: 30, image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80" },
        { id: 5, name: "Orange Juice", category: "Beverages", price: 300, stock: 60, image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80" },
        { id: 6, name: "Greek Yogurt", category: "Dairy", price: 100, stock: 45, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80" },
        { id: 7, name: "Fresh Tomatoes", category: "Vegetables", price: 200, stock: 80, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80" },
        { id: 8, name: "Cheddar Cheese", category: "Dairy", price: 2100, stock: 40, image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80" },
        { id: 9, name: "Brown Eggs", category: "Dairy", price: 70, stock: 70, image: "https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?auto=format&fit=crop&w=400&q=80" },
        { id: 10, name: "Bananas", category: "Fruits", price: 350, stock: 120, image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=400&q=80" },
        { id: 11, name: "Fresh Steak", category: "Meat", price: 2200, stock: 35, image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=400&q=80" },
        { id: 12, name: "Fresh Lemonade", category: "Beverages", price: 300, stock: 60, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80" }
    ];
    localStorage.setItem('products', JSON.stringify(products));
}

let cart = [];
let filteredProducts = [...products];
let selectedCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(filteredProducts);
    updateCart();
    initializeEventListeners();
    addNotificationStyles();
    loadUserProfile();
});

function loadUserProfile() {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
        try {
            const user = JSON.parse(loggedUser);
            const userName = user.fullName;

            const userElement = document.getElementById('loggedInUser');
            if (userElement) {
                userElement.textContent = userName;
            }

            const avatarElement = document.querySelector('.user-avatar');
            if (avatarElement) {
                avatarElement.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=447ef1&color=fff&size=128`;
            }
        } catch (e) {
            const userName = loggedUser;
            const userElement = document.getElementById('loggedInUser');
            if (userElement) {
                userElement.textContent = userName;
            }

            const avatarElement = document.querySelector('.user-avatar');
            if (avatarElement) {
                avatarElement.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=447ef1&color=fff&size=128`;
            }
        }
    }
}

function renderProducts(productList) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = productList.map(product => `
        <div class="col-6 col-md-4 col-xl-3">
            <div class="product-card bg-white overflow-hidden h-100">
                <img src="${product.image ? product.image : './assets/images/no-image-available.jpg'}" alt="${product.name}" class="product-image">
                <div class="product-body">
                    <div class="product-category text-uppercase fw-semibold">${product.category}</div>
                    <h5 class="product-name fw-semibold">${product.name}</h5>
                    <div class="product-price h5 fw-bold my-2">${product.price.toFixed(2)} LKR</div>
                    <div class="product-stock mb-3">
                        <i class="fas fa-box"></i> ${product.stock} in stock
                    </div>
                    <button class="btn btn-add-cart w-100 border-0 text-white fw-semibold" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (product.stock > 0) {
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        product.stock--;
        updateCart();
        renderProducts(filteredProducts);
        showNotification(`${product.name} added to cart!`);
    } else {
        showNotification(`${product.name} is out of stock!`);
    }
}

function updateQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);

    if (cartItem) {
        if (change === 1 && product.stock > 0) {
            cartItem.quantity++;
            product.stock--;
        } else if (change === -1) {
            cartItem.quantity--;
            product.stock++;
        }

        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
            renderProducts(filteredProducts);
        }
    }
}

function removeFromCart(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        const product = products.find(p => p.id === productId);
        product.stock += cartItem.quantity;
        cart = cart.filter(item => item.id !== productId);
        updateCart();
        renderProducts(filteredProducts);
        showNotification('Item removed from cart');
    }
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotalAmount = document.getElementById('cartTotalAmount');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartTotalAmount.textContent = `${totalAmount.toFixed(2)} LKR`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        document.querySelector('.cart-summary').style.display = 'none';
        document.getElementById('checkoutBtn').disabled = true;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item d-flex gap-1 p-3">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name fw-semibold text-black">${item.name}</div>
                    <div class="cart-item-price fw-bold mt-1">${item.price.toFixed(2)} LKR</div>
                    <div class="d-flex align-items-center gap-2 mt-2">
                        <button class="qty-btn text-white d-flex align-items-center justify-content-center fw-bold" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="qty-display fw-semibold">${item.quantity}</span>
                        <button class="qty-btn text-white d-flex align-items-center justify-content-center fw-bold" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-btn text-white d-flex align-items-center justify-content-center ms-auto" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        document.querySelector('.cart-summary').style.display = 'block';
        document.getElementById('checkoutBtn').disabled = false;
    }
}

function filterProducts() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();

    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery) ||
            product.category.toLowerCase().includes(searchQuery);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    renderProducts(filteredProducts);
}

function initializeEventListeners() {
    document.getElementById('searchInput').addEventListener('input', filterProducts);

    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedCategory = this.dataset.category;
            filterProducts();
        });
    });

    const sidebarCategoryLinks = document.querySelectorAll('.nav-category-link');
    sidebarCategoryLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            selectedCategory = this.dataset.category;

            categoryBtns.forEach(btn => {
                if (btn.dataset.category === selectedCategory) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            filterProducts();

            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    });

    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const page = this.dataset.page;
            if (page !== 'dashboard') alert(`Navigating to ${page} page...`);
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    });

    document.getElementById('btnLogout').addEventListener('click', () => {
        logout();
    });

    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length > 0) {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alert(`Checkout successful!\n\nTotal Amount: $${total.toFixed(2)}\nItems: ${cart.length}`);
            cart = [];
            updateCart();
        }
    });

    document.getElementById('cartBadge').addEventListener('click', () => {
        const cartSection = document.getElementById('cartSection');
        cartSection.classList.toggle('mobile-show');
        if (cartSection.classList.contains('mobile-show')) {
            cartSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `<i class="fas fa-check-circle me-2"></i>${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}
