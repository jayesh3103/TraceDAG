# 🔗 TraceDAG — Transparent Supply Chains on Blockchain


![Status](https://img.shields.io/badge/status-Prototype-yellow)
![Built With](https://img.shields.io/badge/built%20with-React%20%7C%20Tailwind%20%7C%20TypeScript%20%7C%20Vite-brightgreen)

> Trace the journey. Verify the origin. Build trust.

**TraceDAG** is a blockchain-powered web app that brings end-to-end transparency to supply chains using NFTs and QR-based verification. By recording each checkpoint of a product's journey on the **BlockDAG** blockchain, we offer a tamper-proof, consumer-friendly way to verify product authenticity — from manufacturing to delivery.

---

## 🌍 Live Demo

👉 [**Visit the App**](https://tracedag.vercel.app/)

---

## 🚀 Features

🔹 **Mint Product Tokens**  
Manufacturers can mint NFTs or similar tokens representing product batches and tag them with QR codes.

🔹 **Checkpoint Updates**  
Logistics partners can scan QR codes and update movement logs (location, handler, timestamp) via a scanner interface.

🔹 **Customer Verification**  
Buyers can scan the QR code to view the product’s full journey, verifying its authenticity and origin.

🔹 **Smart Contract Integration (Future)**  
All product logs are designed to be recorded on-chain via gasless meta-transactions.

🔹 **Off-chain File Storage**  
Documents like invoices or certificates are uploaded to IPFS and linked with the product token metadata.

---

## 📦 Project Structure
```text
project/
├── src/
│   ├── components/          # UI components (Dashboard, Scanner, etc.)
│   ├── store/               # Global state with Zustand
│   ├── types/               # TypeScript interfaces & types
│   ├── lib/                 # Utility functions
│   ├── App.tsx             # Main app entry
│   └── main.tsx            # ReactDOM render root
├── public/                  # Manifest and assets
├── tailwind.config.js       # Tailwind CSS config
├── vite.config.ts           # Vite bundler setup
└── package.json             # Project metadata & dependencies
```

---

## 🧪 Getting Started

### Prerequisites
- Node.js ≥ 18.x
- npm ≥ 9.x

### Installation

```bash
# Clone the repo
git clone https://github.com/jayesh3103/TraceDAG.git
cd TraceDAG/project

# Install dependencies
npm install

# Start the development server
npm run dev
```
---

## 🛠️ Built With

A modern stack for a seamless, decentralized supply chain experience:

- ⚛️ **[React.js](https://reactjs.org/)** (with TypeScript) – Component-based UI framework for fast and scalable frontend development  
- 🎨 **[TailwindCSS](https://tailwindcss.com/)** – Utility-first CSS framework for rapid and responsive styling  
- ⚡ **[Vite](https://vitejs.dev/)** – Next-gen frontend tooling for lightning-fast build and HMR  
- 🔐 **[Ethers.js](https://docs.ethers.org/)** + **[Web3Modal](https://web3modal.com/)** – Ready for seamless blockchain interactions with wallet support  
- 🧠 **[Zustand](https://zustand-demo.pmnd.rs/)** – Lightweight and intuitive state management  
- 🌐 **[IPFS](https://ipfs.tech/)** – Decentralized file storage for documents like invoices and certificates  
- 📱 **Progressive Web App (PWA)** – Installable, offline-friendly, and optimized for mobile logistics workers  
