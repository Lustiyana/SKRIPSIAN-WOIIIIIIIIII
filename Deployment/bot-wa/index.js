const qrcode = require("qrcode-terminal");
const fs = require("fs");
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
  console.log(msg.body);

  if (msg.body === "hai") {
    msg.reply("Hai ada yang bisa dibantu");
  }
  if (msg.hasMedia) {
    const media = await msg.downloadMedia();
    msg.reply("Kamu memasukkan gambar");
    const imageData = Buffer.from(media.data, "base64");

    fs.writeFileSync("image.jpg", imageData);
  }
});

client.initialize();
