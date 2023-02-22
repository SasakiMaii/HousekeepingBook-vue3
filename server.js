const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();
const PORT = 8008;
const cors = require("cors");
// import bcrypt from "bcryptjs";
const bcrypt = require("bcryptjs");

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
    skip: 0,
    take: 10,
  });
  return res.json(kakeibo);
});
app.get("/prevpage", async (req, res) => {
  const kakeibo = await prisma.kakeibo.findMany({
    orderBy: [
      {
        cretedAt: "desc",
      },
    ],
    take: -10,
  });
  return res.json(kakeibo);
});

app.get("/nextpage", async (req, res) => {
  const results = await prisma.kakeibo.findMany({
    orderBy: [
      {
        cretedAt: "desc",
      },
    ],
    skip: 10,
    take: 10,
  });
  return res.json(results);
});

app.get("/register", async (req, res) => {
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

app.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);
  const register = await prisma.users.create({
    data: {
      email: email,
      name: name,
      password: hashedPassword,
    },
  });
  return res.json(register);
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
