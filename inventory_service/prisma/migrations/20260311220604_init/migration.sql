/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `InventoryReservation` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `orderId` on the `InventoryReservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "InventoryReservation" DROP COLUMN "orderId",
ADD COLUMN     "orderId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InventoryReservation_orderId_key" ON "InventoryReservation"("orderId");

-- CreateIndex
CREATE INDEX "InventoryReservation_status_expiresAt_orderId_idx" ON "InventoryReservation"("status", "expiresAt", "orderId");
