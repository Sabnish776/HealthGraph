# HealthGraph India

HealthGraph India is a comprehensive full-stack platform designed to facilitate dynamic inter-hospital emergency resource exchange and unified patient records. Built with modern technologies, it offers solutions for tracking critical resources like ICU beds, oxygen cylinders, and ventilators, while keeping patient profiles updated securely using secure authentication.

## Key Features

### 1. Unified Patient Intelligence
- **Unified Medical Timeline**: A chronological, visual history of every hospital visit, diagnosis, and clinical note across different facilities.
- **Active Medication Management**: Real-time tracking of current prescriptions with the ability for hospitals to revoke or update them as treatment evolves.
- **Disease Risk Profiling**: Categorization of health conditions into Active, Prone, and Resolved (Cured) statuses, providing a dynamic risk map for the patient.

### 2. AI Health Intelligence (Gemini-Powered)
- **Automated History Analysis**: Uses Google Gemini AI to scan years of medical records and generate a concise health summary.
- **Risk Identification**: Proactively identifies potential health risks based on historical data.
- **Personalized Recommendations**: Provides AI-driven lifestyle and medical suggestions tailored to the patient's specific history.

### 3. Emergency & Portability
- **Formatted QR Health ID**: A dynamic QR code that, when scanned, displays critical life-saving information (Blood Group, Allergies, Active Risks) in a clean, human-readable format—no special software required for first responders.
- **Universal Search**: Hospitals can instantly access a patient's entire medical history using just their registered mobile number (with secure authentication).

### 4. Hospital Command Center
- **Global Health Dashboard**: Real-time tracking of platform-wide metrics including Logged Patients, Reports Uploaded, and Total Consultations.
- **Consultation Recorder**: A streamlined interface for doctors to log visits, prescribe medications, identify risks, and upload lab results in one flow.
- **Facility Activity Tracking**: A dedicated view for hospitals to manage their own recent patient interactions and facility-specific data.

### 5. Security & Trust
- **Role-Based Access Control**: Strict separation between Patient and Hospital portals ensuring data privacy.
- **Secure Document Vault**: Centralized storage and previewing of lab reports and medical documents.
- **OTP-Based Authentication**: Secure, passwordless login for patients using their mobile numbers.

### 6. Premium Design System
- **Medical-Glass UI**: A high-end, modern aesthetic using translucent panels, fluid animations (Framer Motion), and a "Medical Blue & Teal" palette.
- **Responsive Experience**: Fully optimized for both desktop clinical use and mobile patient access.

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
