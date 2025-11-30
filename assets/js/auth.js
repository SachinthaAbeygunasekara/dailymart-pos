function handleSignUp() {
    //
}

function handleLogin() {
    //
}

function checkAuth() {
    const user = localStorage.getItem('loggedUser');
    if (!user) {
        window.location.replace('login.html');
    } else {
        window.location.replace('home.html');
    }
}