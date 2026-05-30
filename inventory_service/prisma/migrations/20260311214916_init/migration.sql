/*
  Warnings:

  - Added the required column `createdBy` to the `InventoryReservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InventoryReservation" ADD COLUMN     "createdBy" TEXT NOT NULL;
