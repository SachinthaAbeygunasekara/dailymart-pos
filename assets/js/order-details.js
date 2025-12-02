document.addEventListener('DOMContentLoaded', () => {
  renderOrdersTable();
  loadUserProfile();
  setupEventListeners();
});

function loadUserProfile() {
  const loggedUser = localStorage.getItem('loggedUser');
  if (loggedUser) {
    try {
      let user;
      try {
        user = JSON.parse(loggedUser);
      } catch (e) {
        user = { fullName: loggedUser, username: loggedUser };
      }

      const userName = user.fullName || user.username || 'User';

      const userElement = document.getElementById('loggedInUser');
      if (userElement) {
        userElement.textContent = userName;
      }

      const avatarElement = document.querySelector('.user-avatar');
      if (avatarElement) {
        avatarElement.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=447ef1&color=fff&size=128`;
      }
    } catch (e) {
      console.error('Error loading user profile:', e);
    }
  }
}

function setupEventListeners() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    });
  }

  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof logout === 'function') {
        logout();
      } else {
        localStorage.removeItem('loggedUser');
        window.location.href = 'index.html';
      }
    });
  }
}

function renderOrdersTable() {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const container = document.getElementById('orderTable');
  if (!container) return;

  orders.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (orders.length === 0) {
    container.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="fas fa-shopping-bag fa-3x mb-3 opacity-50"></i>
                <p class="mb-0">No orders found.</p>
            </div>`;
    return;
  }

  container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th scope="col">Order ID</th>
                        <th scope="col">Date</th>
                        <th scope="col">Customer</th>
                        <th scope="col" class="text-center">Items</th>
                        <th scope="col" class="text-end">Total</th>
                        <th scope="col" class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(o => `
                        <tr>
                            <td class="fw-semibold text-primary">${o.id}</td>
                            <td>${o.date}</td>
                            <td>${o.customerName || 'Guest'}</td>
                            <td class="text-center">${o.items.length}</td>
                            <td class="text-end fw-bold">${o.total.toFixed(2)} LKR</td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-outline-primary" onclick='viewInvoice("${o.id}")' title="View Invoice">
                                    <i class="fas fa-file-invoice me-1"></i> View
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
}

function viewInvoice(orderId) {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = orders.find(o => o.id === orderId);

  if (order) {
    localStorage.setItem('currentInvoice', JSON.stringify(order));
    window.location.href = 'invoice.html';
  }
}
