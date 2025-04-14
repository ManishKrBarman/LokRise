document.addEventListener('DOMContentLoaded', function () {
    // Account type selection
    const accountTypes = document.querySelectorAll('.account-type');
    const accountTypeInput = document.getElementById('account-type');

    // Set buyer as default selected
    accountTypes[0].classList.add('selected');

    accountTypes.forEach(type => {
        type.addEventListener('click', function () {
            // Remove selected class from all
            accountTypes.forEach(t => t.classList.remove('selected'));

            // Add selected class to clicked one
            this.classList.add('selected');

            // Update hidden input
            accountTypeInput.value = this.dataset.type;
        });
    });

    // Form submission
    const form = document.getElementById('register-form');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const accountType = accountTypeInput.value;

        // Basic validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    accountType
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Redirecting to login...');
                window.location.href = '/login';
            } else {
                alert(data.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});