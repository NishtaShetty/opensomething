# Nishta Frontend

This is the frontend application for **Nishta**, a decentralized platform built during the Open Hackathon. It is a Next.js project that integrates Web3 features, mapping, and a modern UI.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Web3**: [Ethers.js](https://docs.ethers.org/) for smart contract interaction
- **Storage/IPFS**: [Pinata Web3](https://pinata.cloud/)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Maps**: [Leaflet](https://leafletjs.com/) with React-Leaflet
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### 1. Clone the repository
\`\`\`bash
git clone <your-github-repo-url>
cd nishta/frontend
\`\`\`

### 2. Install dependencies
Install the required packages using npm:
\`\`\`bash
npm install
\`\`\`

### 3. Set up Environment Variables
Create a `.env` file in the root of the `frontend` directory. Make sure to populate it with the necessary keys (e.g., Supabase, Pinata, Smart Contract addresses). 
*Note: The `.env` file is ignored by git for security purposes.*

### 4. Run the development server
Start the local development server:
\`\`\`bash
npm run dev
# For a faster dev server experience:
# npm run dev -- --turbo
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure
- `src/app`: Contains the Next.js App Router pages (e.g., login, dashboard).
- `src/components`: Reusable React components.
- `src/lib`: Utility functions and Web3 contract configurations.
