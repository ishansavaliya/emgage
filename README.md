# Live Tracking Application

## Overview
The Live Tracking Application is built using React 18, Vite, and TypeScript. It provides real-time tracking of employee locations, allowing users to view their current positions on a map, refresh data, and access historical tracking information.

## Features
- **Live Tracking**: Displays the current location of employees on a map.
- **Auto Refresh**: Automatically updates the location data at specified intervals.
- **Employee Cards**: Shows individual employee information, including their image and current location.
- **History Popup**: Displays a detailed history of an employee's location with timestamps.
- **Timeline Playback**: Allows users to play, pause, and control the speed of the timeline for location history.
- **Responsive Design**: Built with MUI and Tailwind CSS for a modern and responsive UI.

## Technologies Used
- React 18
- Vite
- TypeScript
- TenStack Routers
- Material-UI (MUI)
- Tailwind CSS
- Axios for API calls

## Project Structure
```
live-tracking-app
├── src
│   ├── main.tsx
│   ├── App.tsx
│   ├── components
│   │   ├── LiveTracking
│   │   │   ├── EmployeeCard.tsx
│   │   │   ├── TrackingMap.tsx
│   │   │   └── RefreshControls.tsx
│   │   ├── History
│   │   │   ├── HistoryPopup.tsx
│   │   │   ├── TimelinePlayer.tsx
│   │   │   └── PlaybackControls.tsx
│   │   └── common
│   │       ├── Layout.tsx
│   │       └── LoadingSpinner.tsx
│   ├── pages
│   │   ├── LiveTrackingPage.tsx
│   │   └── HistoryPage.tsx
│   ├── hooks
│   │   ├── useAutoRefresh.ts
│   │   ├── useLocationData.ts
│   │   └── usePlayback.ts
│   ├── services
│   │   ├── api.ts
│   │   └── mockData.ts
│   ├── types
│   │   ├── employee.ts
│   │   ├── location.ts
│   │   └── tracking.ts
│   ├── utils
│   │   ├── dateUtils.ts
│   │   └── mapUtils.ts
│   ├── styles
│   │   └── globals.css
│   └── router
│       └── AppRouter.tsx
├── public
│   └── employee-avatars
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Getting Started
1. Clone the repository:
   ```
   git clone <repository-url>
   cd live-tracking-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the application:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## API Integration
The application uses Axios to fetch employee location data. The API endpoints can be defined in `src/services/api.ts`.

## Mock Data
For development purposes, mock data can be found in `src/services/mockData.ts`.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.