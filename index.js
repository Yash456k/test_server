// server.js
const express = require("express");
const bodyParser = require("body-parser");
const { Expo } = require("expo-server-sdk");

const app = express();
const expo = new Expo(); // If needed, you can pass accessToken here
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const sendNotification = async (pushToken, title, body) => {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error("❌ Invalid Expo push token:", pushToken);
    return;
  }

  const message = {
    to: pushToken,
    sound: "default",
    title,
    body,
    data: { time: new Date().toISOString() },
  };

  try {
    let ticketChunk = await expo.sendPushNotificationsAsync([message]);
    console.log("✅ Ticket:", ticketChunk);
  } catch (error) {
    console.error("❌ Failed to send notification:", error);
  }
};

app.post("/login", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token missing" });

  await sendNotification(token, "Login Successful", "Welcome back!");
  res.json({ message: "Login notification sent" });
});

app.post("/register", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token missing" });

  await sendNotification(token, "Registration Complete", "You’re all set!");
  res.json({ message: "Registration notification sent" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
