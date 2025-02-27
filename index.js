const express = require("express");
const rethinkdbdash = require("rethinkdbdash");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const r = rethinkdbdash({ host: "localhost", port: 28015, db: "talha" });

app.post("/add", async (req, res) => {
  try {
    const { text } = req.body;
    await r.table("team").insert({ text }).run();
    res.json({ success: true, message: "Veri eklendi!" });
  } catch (error) {
    console.error("Veri ekleme hatası:", error);
    res.status(500).json({ success: false, message: "Hata oluştu." });
  }
});

app.get("/get", async (req, res) => {
  try {
    const data = await r.table("team").run();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    res.status(500).json({ success: false, message: "Hata oluştu." });
  }
});

app.post("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    await r.table("team").get(id).delete().run();
    res.json({ success: true, message: "Veri silindi!" });
  } catch (error) {
    console.error("Silme hatası:", error);
    res.status(500).json({ success: false, message: "Silme işlemi başarısız." });
  }
});

app.listen(3000, () => console.log("Server 3000 portunda çalışıyor!"));
