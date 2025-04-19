const backendURL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://lokrise.netlify.app';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${backendURL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await res.json().catch(() => ({}));

        if (res.ok) {
            alert(result.message || 'Login successful!');
            window.location.href = '/dashboard';
        } else {
            alert(result.message || 'Login failed');
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred while logging in.');
    }
});
