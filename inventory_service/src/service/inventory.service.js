import prisma from "../../config/db/prisma.js";
import { emitInventoryReserved, emitReservationFailed } from "../kafka/producer.js";

export const getInventoryByProductId = async (productId) => {
    return await prisma.productInventory.findUnique({
        where: { productId }
    });
};

export const createInventory = async (productId, user) => {
    return await prisma.productInventory.create({
        data: {
            productId,
            createdBy: user.id,
        },
    });
};

export const addInventoryStock = async (productId, user, addedStock) => {
    const existing = await prisma.productInventory.findUnique({
        where: { productId },
    });

    if (!existing) {
        throw new Error("NOT_FOUND");
    }

    if (user && existing.createdBy !== user.id) {
        throw new Error("FORBIDDEN");
    }

    return await prisma.productInventory.update({
        where: { productId },
        data: {
            totalStock: { increment: addedStock },
        },
    });
};

export const createInventoryReservation = async (productId, orderId, user, reservedQty) => {
    try {
        const reservation = await prisma.$transaction(async (tx) => {
            const updatedStock = await tx.productInventory.update({
                where: { productId },
                data: {
                    reserved: { increment: reservedQty },
                },
            });

            if (updatedStock.reserved > updatedStock.totalStock) {
                throw new Error("INSUFFICIENT_STOCK"); 
            }

            const difference = 5 * 60 * 1000; 
            const expiresAt = new Date(Date.now() + difference);
            
            return await tx.inventoryReservation.create({
                data: {
                    productId,
                    orderId,
                    createdBy: user.id,
                    reservedQty,
                    expiresAt,
                },
            });
        });
        //console.log('hi');
        await emitInventoryReserved(user, orderId);
        return reservation;

    } catch (error) {
        if (error.message === "INSUFFICIENT_STOCK") {
            await emitReservationFailed(user, orderId);
            throw new Error("Insufficient stock available!"); 
        }
        
        throw error;
    }
};

export const updateRerservationStatus = async (orderId, status) => {
    if (status === "EXPIRED" || status === "CANCELLED") {
        return await prisma.$transaction(async (txn) => {
            const reservation = await txn.inventoryReservation.update({
                where: { orderId },
                data: { status },
            });
            const productId = reservation.productId;
            await txn.productInventory.update({
                where: { productId },
                data: {
                    reserved: { decrement: reservation.reservedQty },
                },
            });

            return reservation;
        });
    } else if (status === "CONFIRMED") {
        return await prisma.$transaction(async (txn) => {
            const reservation = await txn.inventoryReservation.update({
                where: { orderId },
                data: { status },
            });
            const productId = reservation.productId;
            await txn.productInventory.update({
                where: { productId },
                data: {
                    reserved: { decrement: reservation.reservedQty },
                    totalStock: { decrement: reservation.reservedQty }
                },
            });

            return reservation;
        });
    }
    
    throw new Error("Invalid status provided"); 
};