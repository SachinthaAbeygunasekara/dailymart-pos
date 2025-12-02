let uploadedImageData = null;

document.addEventListener('DOMContentLoaded', () => {
  loadUserProfile();
  initializeForm();
  initializeImageUpload();
});

function loadUserProfile() {
  const loggedUser = localStorage.getItem('loggedUser');
  if (loggedUser) {
    try {
      const user = JSON.parse(loggedUser);
      const userName = user.fullName || user.name || user.username || user;

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

function initializeImageUpload() {
  const fileInput = document.getElementById('productImageFile');
  const imageUrlInput = document.getElementById('productImage');
  const imagePreview = document.getElementById('imagePreview');
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      imageUrlInput.value = '';

      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please select an image file.',
          confirmButtonColor: '#447ef1'
        });
        fileInput.value = '';
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Please select an image smaller than 2MB.',
          confirmButtonColor: '#447ef1'
        });
        fileInput.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImageData = e.target.result;
        imagePreview.src = uploadedImageData;
        imagePreviewContainer.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      uploadedImageData = null;
      imagePreviewContainer.style.display = 'none';
    }
  });

  imageUrlInput.addEventListener('input', () => {
    if (imageUrlInput.value) {
      fileInput.value = '';
      uploadedImageData = null;
      imagePreviewContainer.style.display = 'none';
    }
  });
}

function initializeForm() {
  const form = document.getElementById('addProductForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const imageUrl = document.getElementById('productImage').value;

    if (!name || !category || isNaN(price) || isNaN(stock)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields correctly.',
        confirmButtonColor: '#447ef1'
      });
      return;
    }

    const storedProducts = localStorage.getItem('products');
    let nextId = 1;
    if (storedProducts) {
      const products = JSON.parse(storedProducts);
      if (products.length > 0) {
        const maxId = Math.max(...products.map(p => p.id));
        nextId = maxId + 1;
      }
    }

    const finalImage = uploadedImageData || imageUrl || null;

    const newProduct = {
      id: nextId,
      name: name,
      category: category,
      price: price,
      stock: stock,
      image: finalImage
    };

    saveProduct(newProduct);

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Product added successfully!',
      confirmButtonColor: '#447ef1',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      window.location.href = 'home.html';
    });
  });
}

function saveProduct(product) {
  let products = [];
  const storedProducts = localStorage.getItem('products');

  if (storedProducts) {
    products = JSON.parse(storedProducts);
  } else {
    products = [];
  }

  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));
}
