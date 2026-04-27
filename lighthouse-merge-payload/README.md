# hugging-face-space-connection-test

The purpose of this repository is to test a front end connection to Hugging Face for the Lighthouse engine. It includes a modernized Svelte 5 dashboard with history tracking, PII sanitization, and real-time engine controls.

## 📂 Project Structure
- **/my-app**: SvelteKit frontend application.
- **/docs**: Design and technical documentation.

## 🚀 Getting Started
1. Navigate to the app directory:
   ```bash
   cd my-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *Optional: Run `npm run dev:mock` to use local mock data instead of calling the live engine.*

## 🔗 Connections
The app connects to the Data4Good backend (default: `http://127.0.0.1:8000`) to interface with the Lighthouse Hugging Face Space.
