-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "income" BOOLEAN NOT NULL,
    "spending" BOOLEAN NOT NULL,
    "comment" TEXT NOT NULL,
    "cretedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);
