document.addEventListener('DOMContentLoaded', () => {
  renderCustomersTable();
  loadUserProfile();
  setupEventListeners();
});

function loadUserProfile() {
  const loggedUser = localStorage.getItem('loggedUser');
  console.log('Loading user profile:', loggedUser);

  if (loggedUser) {
    try {
      let user;
      try {
        user = JSON.parse(loggedUser);
      } catch (e) {
        user = { fullName: loggedUser, username: loggedUser };
      }

      const userName = user.fullName || user.username || 'User';
      console.log('User name:', userName);

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

function renderCustomersTable() {
  const customers = JSON.parse(localStorage.getItem('customers') || '[]');
  const container = document.getElementById('customerTable');
  if (!container) return;

  if (customers.length === 0) {
    container.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="fas fa-users fa-3x mb-3 opacity-50"></i>
                <p class="mb-0">No customers found. Add your first customer!</p>
            </div>`;
    return;
  }

  container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover align-middle">
                <thead class="table-light">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Email</th>
                        <th scope="col" class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${customers.map(c => `
                        <tr>
                            <td class="fw-semibold">${c.name}</td>
                            <td>${c.phone || '<span class="text-muted">-</span>'}</td>
                            <td>${c.email || '<span class="text-muted">-</span>'}</td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-outline-primary me-1" onclick='editCustomer("${c.id}")' title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick='deleteCustomer("${c.id}")' title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
}

function openCustomerForm() {
  document.getElementById('custId').value = '';
  document.getElementById('custName').value = '';
  document.getElementById('custPhone').value = '';
  document.getElementById('custEmail').value = '';

  document.getElementById('customerModalTitle').textContent = 'Add Customer';

  const modal = new bootstrap.Modal(document.getElementById('customerModal'));
  modal.show();
}

function closeCustomerModal() {
  const modalEl = document.getElementById('customerModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) {
    modal.hide();
  }
}

function saveCustomer(e) {
  e.preventDefault();

  const id = document.getElementById('custId').value;
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const email = document.getElementById('custEmail').value.trim();

  if (!name) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Information',
      text: 'Customer name is required.',
      confirmButtonColor: '#447ef1'
    });
    return;
  }

  try {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');

    const isDuplicate = customers.some(c => {
      if (id && c.id === id) return false;
      const phoneMatch = phone && c.phone === phone;
      const emailMatch = email && c.email === email;

      return phoneMatch || emailMatch;
    });

    if (isDuplicate) {
      Swal.fire({
        icon: 'error',
        title: 'Duplicate Customer',
        text: 'A customer with this Phone Number or Email already exists.',
        confirmButtonColor: '#447ef1'
      });
      return;
    }

    if (id) {
      const index = customers.findIndex(c => c.id === id);
      if (index !== -1) {
        customers[index] = { ...customers[index], name, phone, email };
        localStorage.setItem('customers', JSON.stringify(customers));

        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Customer details have been updated.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } else {
      const newCustomer = {
        id: String(Date.now()),
        name,
        phone,
        email,
        createdAt: new Date().toISOString()
      };
      customers.push(newCustomer);
      localStorage.setItem('customers', JSON.stringify(customers));

      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: 'New customer has been added successfully.',
        timer: 1500,
        showConfirmButton: false
      });
    }

    closeCustomerModal();
    renderCustomersTable();

  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Something went wrong while saving.',
      confirmButtonColor: '#447ef1'
    });
  }
}

function editCustomer(id) {
  const customers = JSON.parse(localStorage.getItem('customers') || '[]');
  const c = customers.find(x => x.id == id);

  if (!c) return;

  document.getElementById('custId').value = c.id;
  document.getElementById('custName').value = c.name;
  document.getElementById('custPhone').value = c.phone || '';
  document.getElementById('custEmail').value = c.email || '';

  document.getElementById('customerModalTitle').textContent = 'Edit Customer';

  const modal = new bootstrap.Modal(document.getElementById('customerModal'));
  modal.show();
}

function deleteCustomer(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      let customers = JSON.parse(localStorage.getItem('customers') || '[]');
      customers = customers.filter(x => x.id != id);
      localStorage.setItem('customers', JSON.stringify(customers));

      renderCustomersTable();
      Swal.fire(
        'Deleted!',
        'Customer has been deleted.',
        'success'
      );
    }
  });
}
