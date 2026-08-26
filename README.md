# Launchfolio

## Description

Launchfolio solves the challenge of organizing, documenting, and publishing projects for developers, UI/UX designers, and data analysts. It simplifies the publishing workflow by allowing users to upload project files, generate professional AI-powered README documentation, organize their work, and publish directly.

## Features

- **File Management & Upload**: Streamlined project file upload capabilities via dedicated API routes.
- **AI-Powered Documentation Generator**: Automatically creates professional README files tailored to your project files and metadata.
- **Direct Publishing**: Publish your organized projects and generated documentation directly.
- **Authentication System**: Secure user authentication powered by NextAuth.js.
- **Database Persistence**: Structured data storage and management using Drizzle ORM.

## Technologies

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database & ORM**: Drizzle ORM
- **Authentication**: NextAuth.js
- **Styling**: CSS / Global Styles (`app/globals.css`)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Launchfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```

4. **Initialize Database**:
   Run your migrations with Drizzle ORM:
   ```bash
   npx drizzle-kit push
   ```
   *(or run migrations matching your setup using `drizzle.config.ts`)*

## Environment Variables

Refer to `.env.example` in the root directory for required environment variables. Ensure the following are configured in your `.env` file:

- Database connection strings
- NextAuth secret and provider credentials
- API integration keys (e.g., AI service keys, OAuth secrets)

## Usage

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **API Routes Overview**:
   - `POST /api/upload` - Endpoint to process and store project files.
   - `POST /api/readme` - Endpoint to generate AI-driven README content.
   - `POST /api/publish` - Endpoint to publish documentation and projects.
   - `GET/POST /api/auth/[...nextauth]` - Handles NextAuth authentication workflows.

## Screenshots

![Launchfolio Logo](./public/launchfolio-mark.svg)

*(Add application dashboard and preview screenshots here)*

## Future Improvements

- Support for additional template styles for README generation.
- Expanded portfolio showcasing capabilities for UI/UX design assets and data analysis notebooks.
- Analytics and project view tracking.
- Multi-platform publishing integrations.

## Author

Created and maintained by the Launchfolio project team.