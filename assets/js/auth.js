function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) { localStorage.setItem('users', JSON.stringify(users)); }

function signUp(fullName, username, email, password) {
    const users = getUsers();
    if (users.some(u => u.email === email || u.username === username)) return false;
    const user = { fullName, username, email, password };
    users.push(user);
    saveUsers(users);
    localStorage.setItem('loggedUser', JSON.stringify(user));
    Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'You can now login with your credentials',
    }).then(() => {
        window.location.href = 'login.html';
    });
    return true;
}

function login(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('loggedUser', JSON.stringify(user));
        window.location.href = 'home.html';
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('loggedUser');
    window.location.href = 'index.html';
}

function checkAuth() {
    const user = localStorage.getItem('loggedUser');
    if (!user) {
        window.location.href = 'login.html';
    } else {
        window.location.href = 'home.html';
    }
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('loggedUser') || 'null');
}

function handleSignUp() {
    const fullname = document.getElementById('txtFullName').value.trim();
    const username = document.getElementById('txtUsername').value.trim();
    const email = document.getElementById('txtEmail').value.trim();
    const password = document.getElementById('txtPassword').value.trim();
    const confirmPassword = document.getElementById('txtConfirmPassword').value.trim();

    const confPswErr = document.getElementById('confirm-password-error');
    const bgShape = document.querySelector('.bg-shape-signup');

    const passwordMatch = password === confirmPassword;
    if (passwordMatch) {
        const ok = signUp(fullname, username, email, password);
        if (!ok) {
            Swal.fire({
                icon: 'error',
                title: 'Username or Email Exists',
                text: 'This Username or Email is already taken!',
            });
        }

    } else {
        confPswErr.style.display = 'block';
        confPswErr.innerHTML = 'Password not matched';
        if (bgShape) {
            bgShape.style.top = "61%";
        }
    }

}

function handleLogin() {
    const username = document.getElementById('txtUsername').value.trim();
    const password = document.getElementById('txtPassword').value.trim();
    const ok = login(username, password);
    if (!ok) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Credintial',
            text: 'Invalid username or password!',
        });
    }
}