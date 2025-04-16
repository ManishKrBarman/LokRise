document.getElementById('role').addEventListener('change', () => {
    const role = document.getElementById('role').value;
    const upiField = document.getElementById('upiId');
    upiField.style.display = role === 'seller' ? 'block' : 'none';
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const role = document.getElementById('role').value;
    const upiId = role === 'seller' ? document.getElementById('upiId').value : undefined;

    try {
        const res = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone, role, upiId }),
        });

        const result = await res.json().catch(() => ({}));

        if (res.ok) {
            alert(result.message || 'Registration successful!');
            window.location.href = '/login';
        } else {
            alert(result.message || 'Registration failed');
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred while registering.');
    }
});
