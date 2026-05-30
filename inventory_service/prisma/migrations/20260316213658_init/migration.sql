/*
  Warnings:

  - You are about to drop the column `productQty` on the `InventoryReservation` table. All the data in the column will be lost.
  - Added the required column `reservedQty` to the `InventoryReservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InventoryReservation" DROP COLUMN "productQty",
ADD COLUMN     "reservedQty" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ProductInventory" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "totalStock" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductInventory_productId_key" ON "ProductInventory"("productId");
