# Lighthouse Analysis Dashboard

A modernized, high-fidelity dashboard for testing frontend connections to the Lighthouse AI engine on Hugging Face.

## 🚀 Key Features

*   **Document History & Caching:** Resumes and analysis results are automatically cached in `localStorage`. Switch between previous analyses instantly without re-processing on the GPU.
*   **Intelligent Partitioning:** Automatically detects resume headers (Skills, Experience, Summary) and allows users to selectively send specific sections for AI analysis.
*   **PII Sanitization:** Optional toggle to redact Personally Identifiable Information (Names, Emails, Locations) before text leaves the browser.
*   **Engine Controls:** Real-time monitoring of the Hugging Face Space status (Running, Building, Sleeping) with manual "Wake Up" and "Restart" capabilities.
*   **Developer Console:** Fixed console bar at the bottom to capture system logs and provide user-friendly formatting for Hugging Face gateway errors.
*   **Mock Mode:** High-fidelity mock data support for rapid UI/UX development without consuming API tokens or waiting for cold starts.

## 🛠 Getting Started

### Installation
```bash
cd my-app
npm install
```

### Development
Standard mode (connects to local/live backend):
```bash
npm run dev
```

**Mock Mode** (uses internal geospatial mock data):
```bash
npm run dev:mock
```

## 🎨 Design System
The dashboard uses the **Data4Good Design Palette**:
*   **Primary Blue:** `#1b3350`
*   **Accent Gold:** `#e3b878`
*   **Background:** `#fffcf3`
*   **Typography:** Outfit (Headings) & Open Sans (Body)

## 📦 Tech Stack
*   **Framework:** Svelte 5 (Runes mode)
*   **Build Tool:** Vite
*   **State Management:** Svelte Writable Stores with persistence
*   **Icons/Transitions:** Native Svelte transitions
