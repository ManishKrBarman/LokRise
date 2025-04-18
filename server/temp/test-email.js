// Simple standalone test script for sending emails
import nodemailer from 'nodemailer';

// Gmail test account setup - using App Password
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use TLS
    auth: {
        user: "thecreons@gmail.com", // your Gmail address
        pass: "vcdt vgqu uitk iqjo", // your Gmail app password
    },
    debug: true // Enable verbose logging
});

async function testEmailSend() {
    console.log('Email test script started...');
    console.log('Attempting to verify transporter configuration...');

    try {
        // Verify the configuration
        const verify = await transporter.verify();
        console.log('Transporter verification result:', verify);

        if (!verify) {
            console.error('Transporter verification failed');
            return;
        }

        console.log('Attempting to send test email...');

        // Send test email
        const info = await transporter.sendMail({
            from: '"Lokrise Test" <thecreons@gmail.com>',
            to: "deveshkumar010904@gmail.com",
            subject: "Test Email from Lokrise App",
            text: "Hello, this is a test email from the Lokrise application. If you received this, the email functionality is working correctly!",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #9B7653;">Email Test Successful!</h2>
          <p>This is a test email from the Lokrise application.</p>
          <p>If you're receiving this email, it means your email configuration is working correctly!</p>
          <p>Details:</p>
          <ul>
            <li>Sent: ${new Date().toLocaleString()}</li>
            <li>From: Lokrise Test System</li>
          </ul>
          <div style="background-color: #f5f5f5; padding: 10px; border-left: 4px solid #9B7653; margin-top: 20px;">
            <p style="margin: 0;">This is an automated test message. No action is required.</p>
          </div>
        </div>
      `
        });

        console.log('Message sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        console.log('Full response:', info);

    } catch (error) {
        console.error('Error sending email:');
        console.error(error);

        // Print detailed error information
        if (error.code) {
            console.error('Error code:', error.code);
        }
        if (error.command) {
            console.error('Failed command:', error.command);
        }
        if (error.response) {
            console.error('Server response:', error.response);
        }
    }
}

// Run the test
testEmailSend()
    .then(() => console.log('Test completed'))
    .catch(err => console.error('Test failed with error:', err));