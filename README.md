# AI Study Helper

An AI-powered study helper that explains any topic simply and clearly for students using Google's Gemini AI.

## Features

- 🤖 AI-powered explanations using Gemini 1.5 Flash
- 🎨 Beautiful dark theme with animated grid background
- 📝 Formatted output with proper typography
- 📋 Copy to clipboard functionality
- ♿ Accessible and responsive design
- ⚡ Fast and modern React + Vite setup

## Getting Started

### Prerequisites

- Node.js 18+ and a JavaScript package manager (npm, pnpm, or yarn)

### Installation

1. Clone the repository to your local machine.
2. Install the project's dependencies using your preferred package manager.
3. Create a `.env` file in the root directory and set `VITE_GEMINI_API_KEY` to your API key.
4. Obtain an API key from Google AI Studio: https://makersuite.google.com/app/apikey
5. Start the development server using your package manager's dev command.

## Deployment to Vercel

### Steps:

1. Push your code to GitHub (if not already done).
2. Import the project to Vercel via the "New Project" flow and select this repository.
3. Configure environment variables in the Vercel project settings: add `VITE_GEMINI_API_KEY` with your API key value for the environments you need (Production, Preview, Development).
4. Deploy — Vercel will detect Vite and handle the build automatically.

### Important Notes:

- ✅ `vite` is listed in `dependencies` (required for Vercel build)
- ✅ `vercel.json` is configured for proper routing
- ✅ Environment variables must be set in the Vercel dashboard
- ✅ The build should work automatically

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Lucide React (icons)
- Google Gemini AI API
