const express = require("express");
const qrcode = require("qrcode");
const rateLimit = require("express-rate-limit");
const {
  initWhatsAppClient,
  getQr,
  isReady,
  getClient,
} = require("../config/client");

const router = express.Router();

const sendMessageLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 150,             
  message: "Too many messages sent.Please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/auth", async (req, res) => {
  try {
    const { clientInstance } = await initWhatsAppClient();

    if (!clientInstance) {
      return res.json({ status: "authenticated" });
    }
    const qr = getQr();
    if (qr) {
      const qrImage = await qrcode.toDataURL(qr);
      return res.json({ qrImage });
    }

    res.status(202).json({ status: "waiting_for_qr" });
  } catch (error) {
    console.error("Failed to init client:", error);
    res.status(500).send("Failed to initialize WhatsApp client.");
  }
});

router.get("/groups", async (req, res) => {
  if (!isReady()) {
    return res.status(400).send("Please authenticate first!");
  }
  try {
    const client = getClient();
    const chats = await client.getChats();
    const groups = chats
      .filter((chat) => chat.isGroup)
      .map((group) => ({
        id: group.id._serialized,
        name: group.name,
      }));
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/sendmessage/:groupid",sendMessageLimiter, async (req, res) => {
  try {
    const { groupid } = req.params;
    const { textmessage } = req.body;
    if (!isReady()) {
      return res.status(400).send("Please authenticate first!");
    }

    const client = getClient();

    const chats = await client.getChats();
    const group = chats.find(
      (chat) => chat.isGroup && chat.id._serialized === groupid
    );
    if (!group) {
      return res.status(404).json({ error: "Invalid group ID" });
    }

    const message = await client.sendMessage(groupid, textmessage);
    res.status(200).json({
      message: message,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
