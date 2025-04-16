// Email Verification Template
function verificationEmailTemplate(verificationCode) {
    return
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - LokRise</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eee;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #4a5568;
    }
    .verification-box {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 25px;
      margin: 25px 0;
      text-align: center;
    }
    .verification-code {
      font-size: 32px;
      letter-spacing: 8px;
      color: #3182ce;
      font-weight: bold;
      padding: 15px 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #718096;
      padding-top: 30px;
      border-top: 1px solid #eee;
    }
    .button {
      display: inline-block;
      background-color: #4a5568;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: bold;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">LokRise</div>
    </div>
    
    <h2>Verify Your Email Address</h2>
    <p>Hello,</p>
    <p>Thank you for signing up with LokRise. To complete your registration, please use the verification code below:</p>
    
    <div class="verification-box">
      <p>Your verification code is:</p>
      <div class="verification-code">${verificationCode}</div>
      <p>This code will expire in 30 minutes.</p>
    </div>
    
    <p>If you did not create an account with LokRise, please ignore this email.</p>
    
    <p>Best regards,<br>The LokRise Team</p>
    
    <div class="footer">
      <p>&copy; 2025 LokRise. All rights reserved.</p>
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;
}

//Welcome Email Template (after verification)
function welcomeEmailTemplate(email) {
    return
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to LokRise!</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #eee;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #4a5568;
    }
    .welcome-message {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 25px;
      margin: 25px 0;
    }
    .feature-block {
      margin: 20px 0;
    }
    .feature-title {
      font-weight: bold;
      color: #3182ce;
      margin-bottom: 5px;
    }
    .button {
      display: inline-block;
      background-color: #4a5568;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: bold;
      margin-top: 15px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #718096;
      padding-top: 30px;
      border-top: 1px solid #eee;
    }
    .social-links {
      text-align: center;
      margin: 20px 0;
    }
    .social-icon {
      display: inline-block;
      margin: 0 10px;
      color: #4a5568;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">LokRise</div>
    </div>
    
    <div class="welcome-message">
      <h2>Welcome to LokRise!</h2>
      <p>Hello,</p>
      <p>Thank you for joining LokRise! Your email has been successfully verified, and your account is now active.</p>
    </div>
    
    <h3>Get Started With LokRise</h3>
    
    <div class="feature-block">
      <div class="feature-title">Complete Your Profile</div>
      <p>Add your information to personalize your experience and help others connect with you.</p>
    </div>
    
    <div class="feature-block">
      <div class="feature-title">Explore the Platform</div>
      <p>Discover all the features that LokRise has to offer to help you succeed.</p>
    </div>
    
    <div class="feature-block">
      <div class="feature-title">Connect With Others</div>
      <p>Build your network and collaborate with like-minded individuals.</p>
    </div>
    
    <center>
      <a href="https://lokrise.com/dashboard" class="button">Go to Dashboard</a>
    </center>
    
    <p style="margin-top: 30px;">We're excited to have you on board!</p>
    
    <p>Best regards,<br>The LokRise Team</p>
    
    <div class="social-links">
      <a href="https://twitter.com/lokrise" class="social-icon">Twitter</a>
      <a href="https://facebook.com/lokrise" class="social-icon">Facebook</a>
      <a href="https://instagram.com/lokrise" class="social-icon">Instagram</a>
    </div>
    
    <div class="footer">
      <p>&copy; 2025 LokRise. All rights reserved.</p>
      <p>If you have any questions, please contact our support team at support@lokrise.com</p>
      <p><a href="https://lokrise.com/unsubscribe?email=${email}">Unsubscribe</a> | <a href="https://lokrise.com/privacy">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>`;
}


export { verificationEmailTemplate, welcomeEmailTemplate };