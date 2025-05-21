# WhatsApp API Server

A Node.js Express server that provides a REST API for WhatsApp group management and messaging using WhatsApp Web automation. This project supports QR-based authentication, persistent sessions, group listing, and group messaging.

## Features

- **QR Code Authentication:** Scan a QR code to authenticate your WhatsApp account.
- **Session Persistence:** Keeps you logged in across server restarts. But you need to hit `/api/whatsapp/auth` everytime the server restart before using other endpoints of the API.
- **Group Listing:** Fetch all WhatsApp groups you are a member of.
- **Send Messages:** Send messages to any group. User will provide "groupId" while sending request.
- **Rate Limiting:** Prevents abuse of the messaging endpoint.
- **Frontend QR Page:** Simple HTML page to scan the QR code.

## Endpoints

| Method | Endpoint                       | Description                        |
|--------|------------------------------- |------------------------------------|
| GET    | `/api/whatsapp/auth`           | Get QR code or authentication status |
| GET    | `/api/whatsapp/groups`         | List all WhatsApp groups           |
| POST   | `/api/whatsapp/sendmessage/:groupid` | Send a message to a group          |

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nagesh-cse/WhatsAppWebAPIServer.git
   cd whatsapp-api-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and set your variables as needed.

4. **Start the server:**
   ```bash
   npm start
   ```
5. **Hit the `/api/whatsapp/auth` endpoint to initialize the client**
    Here is a catch, I want the client to be initialized only when User hit `/api/whatsapp/auth` endpoint.

6. **Access the QR code page:**
   - Open [http://localhost:PORT/index.html](replace `PORT` with your configured port).

## Usage

1. Open the QR code page in your browser.
2. Scan the QR code with your WhatsApp mobile app.
3. Once authenticated, use the API endpoints to list groups or send messages.

## Project Structure

```
src/
  config/         # WhatsApp client/session logic
  routes/         # Express route handlers
  public/         # Static files (e.g., QR code HTML)
  ...
```

## Security

- Do **not** share session files.

