Here is a complete, clean `README.md` file you can drop right into your project folder. It covers the entire "cold start" process for getting both the n8n backend and the React Native frontend up and running.

---

# Thought Sorter

An industrial, minimalist mobile app that captures voice notes and uses an AI Agent to autonomously route tasks, ideas, and logs to Notion, Microsoft To Do, Strava, and Trello.

## Prerequisites

* **Docker** (for running the n8n backend)
* **ngrok** (for tunneling the local backend to the public web)
* **Node.js & npm** (for the Expo React Native app)
* **Expo Go** installed on your mobile device

---

## 🚀 How to Run the Project (Cold Start Guide)

Because the app relies on a local n8n backend, you need to spin up the server and the tunnel before launching the mobile app.

### Phase 1: Start the Backend (n8n + ngrok)

**1. Start the n8n Docker Container**
Open your terminal (PowerShell/Command Prompt) and ensure your n8n container is running.
*(Note: It should start automatically with Docker, but if it doesn't, run this):*

```bash
docker start n8n

```

Verify it's running by going to `http://localhost:5678` in your browser.

**2. Open the ngrok Tunnel**
Because the mobile app needs a public HTTPS URL to send audio to, we use ngrok. Open a **new** terminal window and run:

```bash
ngrok http 5678

```

*Keep this terminal window open!* If you close it, the server connection dies.

### Phase 2: Connect the App

**3. Update the Webhook URL**
Since free ngrok URLs change every time you restart the tunnel, you need to update the app with today's URL.

1. Copy the `Forwarding` URL from the ngrok terminal (e.g., `https://random-words.ngrok-free.app`).
2. Open `App.tsx` in your code editor.
3. Update the `N8N_WEBHOOK_URL` constant, making sure to keep `/webhook/voice-note` at the end:

```typescript
// In App.tsx
const N8N_WEBHOOK_URL = 'https://[YOUR-NEW-NGROK-URL].ngrok-free.app/webhook/voice-note';

```

4. Save the file.

### Phase 3: Launch the Mobile App

**4. Start the Expo Server**
Connect your phone via USB (with USB Debugging enabled) or ensure it's on the same Wi-Fi network. Open a terminal in your project folder and run:

```bash
npx expo start

```

* Press `a` to open on an Android device via USB.
* Press `i` to open on an iOS device.

**5. Test the Connection**

1. Tap **INITIATE** on the app screen.
2. Speak a test command (e.g., "Remind me to check the frontend code tomorrow").
3. Tap **TERMINATE**.
4. Check the app's console UI for a `200 OK` success message, and check your n8n dashboard to watch the workflow execute!

---

## 🛠️ Troubleshooting

* **App says "Network Error":** Your ngrok tunnel probably closed, or you forgot to update the URL in `App.tsx`.
* **n8n isn't catching the audio:** Double-check that your n8n Webhook node is set to the path `voice-note` and responding with `First Entry JSON`.
* **AI Agent throws a tool error:** Ensure your Microsoft To Do node is set to **Create** (not Get) and that you have specified a default List for the tasks to go into.
* **Want to avoid updating the URL every day?** Claim a free static domain on your ngrok dashboard and start your tunnel with `ngrok http --domain=your-custom-name.ngrok-free.app 5678`.

---

You can literally just copy and paste everything above this line into a `README.md` file in the root of your `Thought-Sorter` folder. It should keep you covered anytime you come back to work on it!