# WebSocket Chat Rooms

A simple real-time chat application with room support using Socket.IO, React, and TypeScript.

## Features

- Real-time messaging
- Room-based chat system using URL hash
- Player count per room
- Automatic room creation

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Start the development servers:

```bash
npm run dev
```

This will start both the client (port 5173) and server (port 3001).

## Usage

- Visit http://localhost:5173
- Share URLs with room hash (e.g., http://localhost:5173/#room1) to join specific rooms
- If no room is specified, a random room will be created
