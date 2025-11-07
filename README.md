# Guided Meditation App

A beautiful, guided meditation web app built with Next.js that helps you practice mindful breathing with visual guidance and tracks your meditation progress.

## Features

### 🧘 Guided Breathing Exercises
- Visual breathing circle that animates with your breath
- 4-phase breathing cycle:
  - **Inhale**: 4 seconds
  - **Hold**: 4 seconds
  - **Exhale**: 6 seconds
  - **Rest**: 2 seconds
- Real-time breath count tracking

### ⏱️ Customizable Timer
- Set meditation duration from 1 to 60 minutes
- Clear countdown display
- Start/stop controls

### 📊 Progress Tracking
- Automatically tracks all meditation sessions
- Records session date, time, and duration
- Displays total sessions completed
- Shows total minutes meditated
- Marks sessions as completed or partial
- Recent sessions history

### 🎨 Beautiful UI
- Gradient background design
- Smooth animations
- Responsive layout for mobile and desktop
- Glass morphism effects

## Getting Started

### Prerequisites
- Node.js 18+ installed

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## How to Use

1. **Set Your Duration**: Use the + and - buttons to select how long you want to meditate
2. **Start Meditation**: Click the "Start Meditation" button
3. **Follow the Guide**: Watch the breathing circle and follow the instructions
   - The circle expands when you should inhale
   - The circle shrinks when you should exhale
4. **Track Progress**: Your session is automatically saved to your browser's local storage
5. **View History**: Scroll down to see your recent meditation sessions

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Storage**: Local Storage API

## Data Storage

All meditation session data is stored locally in your browser using the Local Storage API. No data is sent to external servers, ensuring complete privacy.

## Browser Compatibility

Works on all modern browsers that support:
- ES6+
- Local Storage
- CSS animations

## License

MIT