const backendURL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://lokrise.netlify.app';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch(`${backendURL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await res.json().catch(() => ({}));
        alert(result.message || 'Registered!');
    } catch (err) {
        console.error(err);
        alert('Something went wrong!');
    }
});
