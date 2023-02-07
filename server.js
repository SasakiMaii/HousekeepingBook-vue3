const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();
const PORT = 8008;
const cors = require("cors");

const prisma = new PrismaClient();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/kakeibo", async (req, res) => {
  const kakeibo = await prisma.kakeibo.findMany();
  return res.json(kakeibo);
});

app.post("/kakeibo", async (req, res) => {
  const { item, income, spending, comment, cretedAt } = req.body;
  const kakeibo = await prisma.kakeibo.create({
    data: {
      item:item,
      income:income,
      spending:spending,
      comment:comment,
      cretedAt:cretedAt,
    },
  });
  return res.json(kakeibo);
});


app.listen(PORT, () => {
  console.log("サーバーが起動中・・・");
});
