# Waste Detection Frontend

A beautiful React + Styled Components frontend for the waste detection backend API.

## Features

- Modern, clean UI with styled-components
- Drag and drop image upload
- Real-time waste detection and classification
- Responsive design for all devices
- Confidence visualization for detected objects

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Backend API running (on port 8000)

### Installation

1. Install dependencies:

```bash
npm install
```

or with yarn:

```bash
yarn install
```

### Running the Development Server

```bash
npm start
```

or with yarn:

```bash
yarn start
```

This will start the development server at http://localhost:3000.

### Building for Production

```bash
npm run build
```

or with yarn:

```bash
yarn build
```

This will create an optimized production build in the `build` folder.

## Usage

1. Ensure the backend API is running on http://localhost:8000
2. Upload an image by dragging and dropping or clicking the upload area
3. Click "Analyze Image" to send the image to the backend for processing
4. View the detection results, which show the annotated image and classifications

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── styled/      # Styled components
│   ├── services/        # API services
│   ├── styles/          # Global styles and theme
│   ├── App.js           # Main application component
│   └── index.js         # Entry point
└── package.json         # Dependencies and scripts
```

## Technologies Used

- React.js - Frontend library
- styled-components - CSS-in-JS styling
- axios - HTTP client for API requests
- react-dropzone - File upload component
- react-icons - Icon library 