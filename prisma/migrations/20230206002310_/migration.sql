-- CreateTable
CREATE TABLE "Kakeibo" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "income" INTEGER NOT NULL,
    "spending" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "cretedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kakeibo_pkey" PRIMARY KEY ("id")
);
