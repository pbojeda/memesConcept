# Ticket: MVP-06 - Database Connection Resilience (Retry Policy)

## 1. Objective
Currently, if the MongoDB Atlas connection fails during the application startup (e.g., due to IP Whitelisting rules, temporary DNS resolution issues, or cloud routing downtime), the backend gracefully catches the error to avoid crashing the server (`process.exit(1)` was removed to pass health checks). However, it never attempts to reconnect, rendering the database-dependent routes effectively broken until someone manually reboots the container.
This ticket implements a resilience mechanism (Retry Policy) to attempt reconnections over a period of time before giving up, ensuring the Database can recover connectivity automatically.

## 2. Requirements

### 2.1 Context
Location: `backend/src/infrastructure/database.ts`
Dependencies: Mongoose.

### 2.2 Reconnection Strategy
- **Initial Connection**: The application will attempt to connect to MongoDB.
- **Retry Mechanism**: If the connection fails, it should catch the error, log a warning, and wait `N` seconds before retrying.
- **Max Retries**: The policy will retry a maximum of `MAX_RETRIES` times (e.g., 5 attempts).
- **Delay between Retries**: Provide a constant delay (e.g., 5 seconds) or exponential backoff between attempts.
- **Continuous Monitoring**: Mongoose automatically handles reconnections AFTER an initial successful connection. This policy specifically focuses ONLY on the **initial connection phase**.
- **Failure State**: If all retries are exhausted, log a critical error. The app should NOT crash (`process.exit`), to keep endpoints like `/health` responding for cloud metrics, but it should log clearly that the DB is offline.

### 2.3 Success State
- Once connected, log a success message: `✅ Connected to MongoDB on attempt X`.

## 3. Implementation Plan (B6.1)
1. In `database.ts`, modify the `connectToDatabase` function to include a loop or a recursive function that tracks the number of attempts.
2. Use `await new Promise(res => setTimeout(res, 5000))` to introduce the delay.
3. Catch the connection error. If `attempt < MAX_RETRIES`, log `⚠️ MongoDB connection failed. Retrying in 5 seconds... (Attempt ${attempt}/${MAX_RETRIES})`.
4. If `attempt === MAX_RETRIES`, log `❌ Exhausted all MongoDB connection retries. Database will remain offline.`.

## 4. Verification Check
- **Manual Verification**: Launch the backend locally with an invalid `MONGO_URI` or disconnected internet. Ensure the server logs the attempts and doesn't crash the Node process.
- **Manual Verification**: After 2 attempts failing, fix the `MONGO_URI` (by re-connecting internet or updating IP whitelist). It should connect successfully on attempt 3.
