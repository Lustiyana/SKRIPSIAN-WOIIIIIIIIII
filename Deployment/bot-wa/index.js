const qrcode = require("qrcode-terminal");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const fetch = require("node-fetch");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "auth" }),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("whatsapp bot siap");
});

client.on("message", async (msg) => {
  if (msg.body === "hai") {
    msg.reply("Hai ada yang bisa dibantu");
  }
  if (msg.hasMedia) {
    const media = await msg.downloadMedia();
    const formData = new FormData();
    formData.append("files", media.data, media.mimetype);
    const config = {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      },
    };
    axios
      .post("http://127.0.0.1:1337/api/upload", formData, config)
      .then((response) => {
        msg.reply("Media berhasil diunggah ke API");
      })
      .catch((error) => {
        console.log(error);
        msg.reply("Terjadi kesalahan saat mengunggah media ke API");
      });
  }
});

client.initialize();
