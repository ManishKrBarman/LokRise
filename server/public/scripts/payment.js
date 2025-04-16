// client/public/scripts/payment.js
document.getElementById('paymentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const sellerId = document.getElementById('sellerId').value.trim();
    const amount = document.getElementById('amount').value.trim();

    if (!sellerId || !amount) {
        alert('Please fill all fields');
        return;
    }

    try {
        const res = await fetch('/payment/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sellerId, amount }),
        });

        const data = await res.json();

        if (data.success) {
            const qrImage = document.getElementById('qrImage');
            const paymentDetails = document.getElementById('paymentDetails');
            const sellerName = document.getElementById('sellerName');
            const paymentAmount = document.getElementById('paymentAmount');
            const upiLink = document.getElementById('upiLink');

            qrImage.src = data.qrCode;
            qrImage.style.display = 'block';

            sellerName.textContent = data.sellerName;
            paymentAmount.textContent = data.amount;
            upiLink.textContent = data.upiLink;
            upiLink.href = data.upiLink;

            paymentDetails.style.display = 'block';
        } else {
            alert(data.message || 'Failed to generate payment details');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing payment');
    }
});