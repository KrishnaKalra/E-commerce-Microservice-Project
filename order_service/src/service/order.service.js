import prisma from "../../config/db/prisma.js";
import {
    emitOrderConfirmed,
    emitOrderCreated,
    emitOrderFailed,
} from "../kafka/producer.js";

export const createOrder = async (
    user,
    productId,
    paymentId,
    amount,
    quantity,
) => {
    const data = await prisma.order.create({
        data: {
            createdBy: user.id,
            productId,
            amount,
            quantity,
            paymentId,
        },
    });
    await emitOrderCreated(user, data);
    return data;
};

export const findOrdersByUser = async (user) => {
    return await prisma.order.findMany({
        where: { createdBy: user.id },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getOrderByIdAndUser = async (user, id) => {
    return await prisma.order.findFirst({
        where: {
            id,
            createdBy: user.id,
        },
    });
};

export const updateOrderById = async (user, id, updateData) => {
    // updateData should contain status, paymentStatus, etc.
    return await prisma.order.update({
        where: { id, createdBy: user.id },
        data: updateData,
    });
};
export const updateOrderStatus = async (user, id, updateData) => {
    const { status, paymentStatus, inventoryStatus, shipmentStatus } = updateData;
    const updatedData = await prisma.$transaction(async (tx) => {
        const currentOrder = await tx.order.findUnique({ where: { id } });
        if (!currentOrder) return null;
        if (status) currentOrder.status = status;
        if (paymentStatus) currentOrder.paymentStatus = paymentStatus;
        if (inventoryStatus) currentOrder.inventoryStatus = inventoryStatus;
        if (shipmentStatus) currentOrder.shipmentStatus = shipmentStatus;
        const data = await tx.order.update({
            where: { id },
            data: { 
                status: currentOrder.status,
                paymentStatus: currentOrder.paymentStatus, 
                inventoryStatus: currentOrder.inventoryStatus, 
                shipmentStatus: currentOrder.shipmentStatus 
            },
        });
        return data;
    });
    if (paymentStatus === "VERIFIED") {
        emitOrderConfirmed(user, updatedData);
    }
    if (paymentStatus === "FAILED" || inventoryStatus === "FAILED" || status === "CANCELLED" || status === "FAILED") {
        emitOrderFailed(user, updatedData);
    }
    return updatedData;
};
