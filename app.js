// Login handling
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function handleLogin(event) {
    event.preventDefault();
    
    const role = document.getElementById('role').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username) {
        showError('Please enter username/ID');
        return;
    }
    
    if (role === 'admin') {
        if (username === 'admin' && password === '123') {
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'admin.html';
        } else {
            showError('Invalid admin credentials');
        }
    } else {
        // Student login - any ID works
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('studentID', username);
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'student.html';
    }
}

function showError(message) {
    let errorDiv = document.getElementById('errorMessage');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'errorMessage';
        errorDiv.className = 'error-message';
        const form = document.getElementById('loginForm');
        form.insertBefore(errorDiv, form.firstChild);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 3000);
}