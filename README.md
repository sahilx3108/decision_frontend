# Decision Intelligence

A comprehensive web application designed to help users make, track, and analyze decisions using AI. The application provides an intuitive dashboard, analytical insights, and an interactive AI chat to discuss strategies.

## Technologies Used

### Frontend
- **React 19** with **Vite**
- **Tailwind CSS** (v4) & **Framer Motion** for styling and animations
- **Recharts** for analytics and data visualization
- **React Router DOM** for navigation
- **Lucide React** for icons
- **Axios** for API communication

### Backend
- **Node.js** & **Express**
- **MongoDB** with **Mongoose**
- **Passport.js** for OAuth Authentication (Google & GitHub)
- **JSON Web Tokens (JWT)** for session management
- **Groq SDK** for AI chat and strategy generation
- **Cloudinary** & **Multer** for image and file uploads
- **Nodemailer** for email communication
- **Bcryptjs** for password hashing

## Features

- **Authentication**: JWT-based login along with OAuth integrations for Google and GitHub.
- **Decision Management**: Add, edit, and categorize your decisions.
- **Analytics Dashboard**: Visualize your decision history with interactive charts (Pie charts, Bar charts).
- **AI Strategy Generation & Chat**: Get AI-generated strategies for your decisions and engage in contextual chat to refine them.
- **Dark Mode UI**: A beautiful, neon-accented dark theme for an optimal user experience.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) instance running

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Decision-intelligence
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `server` directory and add the necessary keys:
     - `PORT` (e.g., 5000)
     - `MONGO_URI`
     - `JWT_SECRET`
     - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
     - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
     - `GROQ_API_KEY`
     - Cloudinary credentials, etc.
   - Configure frontend environment variables if applicable in `client/.env`.

### Running the Application

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

## License
MIT License
