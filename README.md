# HealthGraph India

HealthGraph India is a comprehensive full-stack platform designed to facilitate dynamic inter-hospital emergency resource exchange and unified patient records. Built with modern technologies, it offers solutions for tracking critical resources like ICU beds, oxygen cylinders, and ventilators, while keeping patient profiles updated securely using secure authentication.

## Key Features

- **Inter-Hospital Resource Exchange**: Real-time tracking and sharing of emergency medical resources.
- **Unified Patient Records**: Centralized system for secure patient profiling and medical history.
- **AI-Powered Parsing**: Uses Google Gemini to intelligently parse and process documents.
- **Secure Authentication**: Robust authentication systems for patients and hospitals.
- **Responsive Dashboard**: Real-time monitoring and dynamic data rendering.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (via Neon DB), Drizzle ORM
- **AI Integration**: `@google/genai` (Google Gemini)
- **Utilities**: JWT, bcryptjs, Axios, Recharts

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (or use a cloud provider like Neon DB)

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Copy the `.env.example` file to create your own local `.env` and fill in the required keys.
   ```bash
   cp .env.example .env
   ```
   *Note: Make sure to configure your `DATABASE_URL` and `GEMINI_API_KEY` correctly.*

3. **Database setup (Drizzle ORM):**
   Use drizzle-kit to push the schema to your database.
   ```bash
   npx drizzle-kit push
   ```

4. **Run the application locally:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Design Aesthetics

The platform features a premium, state-of-the-art UI utilizing dynamic animations, sleek gradients, and glassmorphism elements, carefully implemented with Framer Motion and Tailwind CSS to deliver an exceptional user experience that goes far beyond generic layouts.

## License

&copy; 2024 HealthGraph India. Unified Intelligence Layer. All rights reserved.
