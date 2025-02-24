document.addEventListener('DOMContentLoaded', () => {
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Register User
    document.getElementById('register-form')?.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('regname').value;
        const email = document.getElementById('regemail').value;
        const password = document.getElementById('regpassword').value;

        // Check if email already exists
        if (users.some(user => user.email === email)) {
            alert("Email already registered!");
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));

        alert("Registration successful! Please login.");
        window.location.href = 'login.html';
    });

    // Login User
    document.getElementById('login-form')?.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginemail').value;
        const password = document.getElementById('loginpassword').value;

        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            alert("Login successful!");
            window.location.href = 'dashboard.html';
        } else {
            alert("Invalid credentials!");
        }
    });

    // Logout User
    window.logoutUser = function() {
        localStorage.removeItem('loggedInUser');
        alert("Logged out!");
        window.location.href = 'login.html';
    };

    // Protect Dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser) {
            alert("Please login first!");
            window.location.href = 'login.html';
        }
    }
    function showSuccessMessage(message) {
        const successDiv = document.createElement("div");
        successDiv.className = "success-message";
        successDiv.innerText = message;
        document.body.appendChild(successDiv);
    
        // Show the message
        setTimeout(() => {
            successDiv.style.top = "20px";
        }, 100);
    
        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.style.top = "-50px";
            setTimeout(() => successDiv.remove(), 500);
        }, 3000);
    }
    
    function showErrorMessage(message) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.innerText = message;
        document.body.appendChild(errorDiv);
    
        // Apply shake effect
        errorDiv.classList.add("shake");
    
        setTimeout(() => errorDiv.remove(), 3000);
    }
    

    
});
