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
  const kakeibo = await prisma.kakeibo.findMany({
    orderBy: [
      {
        cretedAt: "desc",
      },
    ],
  });
  return res.json(kakeibo);
});

app.get("/login", async (req, res) => {
  const user = await prisma.users.findMany();
  return res.json(user);
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const kakeibo = await prisma.kakeibo.findUnique({
    where: {
      id: Number(id),
    },
  });
  return res.json(kakeibo);
});

app.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const deletekakeibo = await prisma.kakeibo.delete({
    where: {
      id: Number(id),
    },
  });
  return res.json(deletekakeibo);
});

app.post("/kakeibo", async (req, res) => {
  const { item, income, spending, comment, cretedAt } = req.body;
  const kakeibo = await prisma.kakeibo.create({
    data: {
      item: item,
      income: income,
      spending: spending,
      comment: comment,
      cretedAt: cretedAt,
    },
  });
  return res.json(kakeibo);
});

app.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { item, income, spending, comment, cretedAt } = req.body;
  const updateKakeibo = await prisma.kakeibo.update({
    where: {
      id: Number(id),
    },
    data: {
      item: item,
      income: income,
      spending: spending,
      comment: comment,
      cretedAt: cretedAt,
    },
  });
  return res.json(updateKakeibo);
});

app.listen(PORT, () => {
  console.log("サーバーが起動中・・・");
});
