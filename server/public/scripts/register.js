// client/public/scripts/register.js
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const role = document.getElementById('role').value;
    const upiId = role === 'seller' ? document.getElementById('upiId').value : undefined;

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, phone, role, upiId }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please check your email for verification code.');
            // Redirect to verification page or show verification form
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during registration');
    }
});