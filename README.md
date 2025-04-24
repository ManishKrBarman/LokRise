# LokRise

![LokRise Logo](client/src/assets/logo.svg)

## Project Overview

LokRise is a comprehensive platform designed to connect rural artisans, farmers, and micro-entrepreneurs directly with a global market, while preserving and promoting India's cultural heritage and craftsmanship. The platform combines e-commerce, education, and community features to create a holistic ecosystem that empowers rural creators.

## Tech Stack

### Frontend
- **Client Application**: React 18 with Vite
- **Admin Dashboard**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: React-Icons (FI - Feather Icons set)
- **State Management**: React Context API
- **Routing**: React Router v6
- **Animation**: Framer Motion

### Backend
- **Server**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Configurable SMTP service
- **API Architecture**: RESTful API

### Payment Processing (DEMONSTRATION)
- UPI
- Cards
- Cash on Delivery
- Barter System

## Project Structure

```
/
├── admin/                  # Admin dashboard application
├── client/                 # Main client application
├── mock-data/              # Sample CSV data for database seeding
├── server/                 # Backend server application
└── netlify.toml            # Netlify deployment configuration
```

### Client Application Structure
```
client/
├── public/                 # Static assets
│   └── team/               # Team member images
├── src/
│   ├── assets/             # Application assets
│   ├── components/         # Reusable UI components
│   ├── context/            # React Context providers
│   ├── pages/              # Application pages/routes
│   ├── services/           # API service wrappers
│   └── styles/             # Global styles
├── index.html              # HTML entry point
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite bundler configuration
```

### Admin Dashboard Structure
```
admin/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Admin-specific assets
│   ├── components/         # Admin UI components
│   │   └── layout/         # Layout components
│   ├── context/            # Admin-specific contexts
│   ├── pages/              # Admin pages
│   └── services/           # Admin API services
├── index.html              # Admin HTML entry point
├── tailwind.config.js      # Admin Tailwind configuration
└── vite.config.js          # Admin Vite configuration
```

### Server Structure
```
server/
├── controllers/            # API controllers
├── data/                   # Static data and reference files
├── libs/                   # Utility libraries
├── middlewares/            # Express middlewares
├── models/                 # Mongoose data models
├── public/                 # Public static files
├── routes/                 # API route definitions
├── temp/                   # Temporary files and scripts
├── app.js                  # Express application setup
├── importData.js           # Database seeding script
└── package.json            # Server dependencies
```

## Key Features

### For Buyers
- Authenticated shopping experience
- Cultural product discovery with storytelling elements
- Secure checkout and payment processing
- Order tracking and history
- User profiles with saved addresses
- Wishlist functionality
- Cart management
- Community forum participation

### For Sellers (Rural Artisans)
- Seller onboarding and verification process
- Product listing and management
- Order fulfillment
- Sales analytics
- Mobile-friendly design for low-connectivity areas
- Local language support (in development)
- OTP-based authentication for low digital literacy

### For Education
- Course catalog with various learning paths
- Instructor profiles and ratings
- Student enrollment and progress tracking
- Interactive course content
- Rural empowerment focused curriculum
- Skill development opportunities

### Administrative
- Comprehensive dashboard
- User management
- Seller approval workflow
- Order management
- Analytics and reporting
- System settings configuration

## Database Models

- **User**: Authentication, profiles, and roles
- **Product**: Physical and digital products (courses)
- **Order**: Purchase transactions
- **Category**: Product categorization
- **Cart**: Shopping cart items
- **Wishlist**: Saved items
- **Review**: Product and seller reviews
- **Coupon**: Promotional discounts
- **LearningPath**: Educational paths
- **Forum**: Community discussion

## Setup and Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (v5+)
- npm or yarn

### Environment Variables
The project requires various environment variables for configuration. Example files:
- `/server/.env.example`
- `/client/.env.example`
- `/admin/.env.example`

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/ManishKrBarman/LokRise.git
cd LokRise
```

2. **Server Setup**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with appropriate values
npm run dev
```

3. **Client Setup**
```bash
cd ../client
npm install
cp .env.example .env
# Edit .env with appropriate values
npm run dev
```

4. **Admin Setup**
```bash
cd ../admin
npm install
cp .env.example .env
# Edit .env with appropriate values
npm run dev
```

5. **Database Seeding**
```bash
cd ../server
node dropDatabase.js
node importData.js
```

## Development

### Running in Development Mode
- Server: `npm run dev` in the server directory
- Client: `npm run dev` in the client directory
- Admin: `npm run dev` in the admin directory

## Authentication Flow

The application uses JWT for authentication with the following flow:
1. User login/register via email
2. Server validates credentials and issues JWT
3. JWT stored in localStorage/cookies
4. Token sent with subsequent requests via Authorization header
5. Server validates token middleware for protected routes

## Performance Optimizations

- React lazy loading for route-based code splitting
- Image optimization and lazy loading
- Mongoose query optimization with proper indexing
- API response caching where appropriate
- Efficient Tailwind CSS purging for production

## Project Contributors

- Manish - Full Stack Developer
- Devesh - Full Stack Developer
- Raghav - UI/UX Designer (UX)
- Himanshi - UI/UX Designer (UI)

## Acknowledgments

- This project was created as part of Hackazards 2025.
- Special thanks to all contributors and supporters of rural Indian artisans.

---

© 2025 Creon Team | LokRise