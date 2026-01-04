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

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

5. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment to Vercel

### Steps:

1. **Push your code to GitHub** (if not already done)

2. **Import project to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables:**
   - In Vercel project settings, go to "Environment Variables"
   - Add: `VITE_GEMINI_API_KEY` with your API key value
   - Make sure to add it for all environments (Production, Preview, Development)

4. **Deploy:**
   - Vercel will automatically detect Vite and deploy
   - The `vercel.json` file is already configured

### Important Notes:

- ✅ `vite` is now in `dependencies` (required for Vercel build)
- ✅ `vercel.json` is configured for proper routing
- ✅ Environment variables must be set in Vercel dashboard
- ✅ The build should work automatically

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Lucide React (icons)
- Google Gemini AI API
