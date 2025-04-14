// api/index.js

const { Expo } = require("expo-server-sdk");

let expo = new Expo();

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
    return ticketChunk;
  } catch (error) {
    console.error("❌ Failed to send notification:", error);
    throw error;
  }
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Only POST allowed");
    return;
  }

  const { token, type } = req.body;
  if (!token || !type) {
    res.status(400).json({ error: "Token or type missing" });
    return;
  }

  const titles = {
    login: "Login Successful",
    register: "Registration Complete",
  };
  const bodies = {
    login: "Welcome back!",
    register: "You're all set!",
  };

  if (!titles[type]) {
    return res.status(400).json({ error: "Unknown type" });
  }

  try {
    const ticket = await sendNotification(token, titles[type], bodies[type]);
    res.status(200).json({ success: true, ticket });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
