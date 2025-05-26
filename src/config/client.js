const { Client, RemoteAuth } = require("whatsapp-web.js");
const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");
require("dotenv").config();
let clientInstance = null;
let currentQr = null;
let clientReady = false;

async function initWhatsAppClient() {
  if (clientInstance) return { clientInstance, getQr, isReady };

  // const store = new MongoStore({
  //   mongoose: mongoose,
  // });

  const whatsappclient = new Client({
    // authStrategy: new RemoteAuth({
    //   clientId: "client-one",
    //   // store: store,
    //   backupSyncIntervalMs: 300000,
    // }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  whatsappclient.on("qr", (qr) => {
    console.log("QR Code received:\n", qr);
    currentQr = qr;
    clientReady = false;
  });

  whatsappclient.on("ready", () => {
    console.log("WhatsApp client is ready!");
    currentQr = null;
    clientReady = true;
  });

  whatsappclient.on("disconnected", () => {
    console.warn("WhatsApp client disconnected");
    clientReady = false;
  });

  whatsappclient.on("remote_session_saved", () => {
    console.log("Session saved");
  });

  whatsappclient.on("auth_failure", (message) => {
    console.error("Authentication failure:", message);
    clientReady = false;
  });

  whatsappclient.on("authenticated", () => {
    console.log("WhatsApp client authenticated");
  });

  await whatsappclient.initialize();
  clientInstance = whatsappclient;
  return { clientInstance, getQr, isReady };
}

const getQr = () => currentQr;
const isReady = () => clientReady;
const getClient = () => clientInstance;

module.exports = { initWhatsAppClient, getQr, isReady, getClient };
