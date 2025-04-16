// Email Verification Template
function verificationEmailTemplate(verificationCode) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - LokRise</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f6f8fc;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    
    .container {
      max-width: 600px;
      margin: auto;
      background-color: #fff;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 5px 25px rgba(0,0,0,0.08);
      animation: fadeIn 0.8s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .logo {
      text-align: center;
      font-size: 32px;
      font-weight: 700;
      color: #3b82f6;
      margin-bottom: 30px;
      letter-spacing: -0.5px;
    }
    
    .content {
      text-align: center;
      line-height: 1.6;
    }
    
    h2 {
      color: #1e293b;
      font-size: 26px;
      margin-bottom: 20px;
      animation: slideIn 0.6s ease-out 0.2s both;
    }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    p {
      color: #4b5563;
      font-size: 16px;
      margin-bottom: 16px;
    }
    
    .code-box {
      background: linear-gradient(145deg, #edf2ff 0%, #e0e7ff 100%);
      padding: 24px;
      border-radius: 12px;
      font-size: 34px;
      color: #3b82f6;
      letter-spacing: 10px;
      font-weight: 600;
      margin: 30px 0;
      border: 1px solid rgba(59, 130, 246, 0.2);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
      animation: pulse 2s infinite;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1); }
      50% { box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3); }
      100% { box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1); }
    }
    
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e5e7eb, transparent);
      margin: 30px 0;
    }
    
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      LokRise
    </div>
    <div class="content">
      <h2>Verify Your Email</h2>
      <p>Thanks for signing up! Please use the verification code below to complete your registration:</p>
      <div class="code-box">${verificationCode}</div>
      <p>This code will expire in <strong>30 minutes</strong>.</p>
      <p>If you didn't request this verification, you can safely ignore this email.</p>
      <p style="margin-top: 30px; font-weight: 500;">– The LokRise Team</p>
    </div>
    <div class="divider"></div>
    <div class="footer">
      &copy; 2025 LokRise • This is an automated message, please do not reply.<br>
      Sent with 💙 from the LokRise team
    </div>
  </div>
</body>
</html>`;
}

// Welcome Email Template
function welcomeEmailTemplate(email) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to LokRise!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f6f8fc;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    
    .container {
      max-width: 600px;
      margin: auto;
      background-color: #fff;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 5px 25px rgba(0,0,0,0.08);
      animation: fadeIn 0.8s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .logo {
      text-align: center;
      font-size: 32px;
      font-weight: 700;
      color: #3b82f6;
      margin-bottom: 30px;
      letter-spacing: -0.5px;
    }
    
    .content {
      text-align: center;
      line-height: 1.6;
    }
    
    h2 {
      color: #1e293b;
      font-size: 26px;
      margin-bottom: 15px;
      animation: slideIn 0.6s ease-out 0.2s both;
    }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    p {
      color: #4b5563;
      font-size: 16px;
      margin-bottom: 16px;
    }
    
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      text-decoration: none;
      padding: 14px 30px;
      border-radius: 8px;
      margin-top: 25px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      transition: all 0.3s ease;
      animation: float 2.5s infinite ease-in-out;
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
      100% { transform: translateY(0px); }
    }
    
    .button:hover {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
    }
    
    .features {
      text-align: left;
      margin-top: 40px;
      padding: 20px;
      background-color: #f9fafb;
      border-radius: 12px;
      border-left: 4px solid #3b82f6;
    }
    
    .feature-item {
      margin-bottom: 18px;
      padding-left: 5px;
      animation: featureIn 0.4s ease-out;
      animation-fill-mode: both;
    }
    
    .feature-item:nth-child(1) { animation-delay: 0.4s; }
    .feature-item:nth-child(2) { animation-delay: 0.6s; }
    .feature-item:nth-child(3) { animation-delay: 0.8s; }
    
    @keyframes featureIn {
      from { opacity: 0; transform: translateX(15px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    .feature-item h4 {
      color: #3b82f6;
      margin-bottom: 5px;
      font-weight: 600;
      font-size: 18px;
      display: flex;
      align-items: center;
    }
    
    .feature-item h4 span {
      background-color: #dbeafe;
      color: #1e40af;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      font-size: 14px;
    }
    
    .feature-item p {
      margin-left: 34px;
      font-size: 15px;
    }
    
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e5e7eb, transparent);
      margin: 30px 0;
    }
    
    .social-links {
      margin-top: 30px;
      text-align: center;
    }
    
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      text-decoration: none;
      color: #3b82f6;
      font-weight: 500;
      transition: transform 0.3s ease;
    }
    
    .social-links a:hover {
      transform: translateY(-3px);
    }
    
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.6;
    }
    
    .footer a {
      color: #3b82f6;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      LokRise
    </div>
    <div class="content">
      <h2>Welcome to LokRise! 🎉</h2>
      <p>Your email has been successfully verified. We're excited to have you on board!</p>
      <a class="button" href="https://lokrise.com/dashboard">Go to Dashboard</a>
    </div>
    
    <div class="features">
      <div class="feature-item">
        <h4><span>✓</span> Complete Your Profile</h4>
        <p>Personalize your experience and get discovered by others in the community.</p>
      </div>
      <div class="feature-item">
        <h4><span>✓</span> Explore the Platform</h4>
        <p>Access powerful tools and features that help you grow and connect.</p>
      </div>
      <div class="feature-item">
        <h4><span>✓</span> Connect With Others</h4>
        <p>Find and collaborate with like-minded individuals from around the world.</p>
      </div>
    </div>
    
    <div class="social-links">
      <a href="https://twitter.com/lokrise">Twitter</a> |
      <a href="https://facebook.com/lokrise">Facebook</a> |
      <a href="https://instagram.com/lokrise">Instagram</a>
    </div>
    
    <div class="divider"></div>
    
    <div class="footer">
      &copy; 2025 LokRise • <a href="https://lokrise.com/unsubscribe?email=${email}">Unsubscribe</a> • 
      <a href="https://lokrise.com/privacy">Privacy Policy</a><br>
      Need help? Contact us at <a href="mailto:support@lokrise.com">support@lokrise.com</a>
    </div>
  </div>
</body>
</html>`;
}

export { verificationEmailTemplate, welcomeEmailTemplate };