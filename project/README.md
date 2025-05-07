# Sports League Tracker

A mobile application built with Expo and React Native for tracking sports leagues, games, and scores.

## Prerequisites

- Node.js (LTS version recommended)
- npm (comes with Node.js)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/AliZaidCU/SuperLeague-App.git
cd SuperLeague-App/project
```

2. Install dependencies:
```bash
npm install
```

## Running the App

1. Start the development server:
```bash
npx expo start
```

2. Once the server starts, you'll have several options:
   - Scan the QR code with your phone's camera (iOS) or Expo Go app (Android)
   - Press 'a' to open in Android emulator
   - Press 'i' to open in iOS simulator
   - Press 'w' to open in web browser

## Features

- User authentication (login/register)
- Game scheduling and tracking
- Live scores
- League standings
- User profiles with different roles (fan, player, referee, organizer)
- Notifications and subscriptions

## Tech Stack

- Expo
- React Native
- TypeScript
- Expo Router
- Various Expo packages for functionality like camera, secure storage, etc.

## Project Structure

```
project/
├── app/              # Main application code
├── assets/           # Images and other static assets
├── components/       # Reusable React components
├── constants/        # Constants and theme configuration
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── services/         # API and other services
└── types/            # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 