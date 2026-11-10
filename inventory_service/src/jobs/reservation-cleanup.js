import prisma from "../../config/db/prisma.js";
import { emitReservationFailed } from "../kafka/producer.js";

export const reservationCleanupJob = async () => {
    try {
        console.log('[Reservation Cleanup] Checking for expired inventory reservations...');
        const now = new Date();
        const expiredReservations = await prisma.inventoryReservation.findMany({
            where: {
                status: "PENDING",
                expiresAt: {
                    lt: now,
                },
            },
        });

        if (expiredReservations.length === 0) return;

        console.log(`[Reservation Cleanup] Found ${expiredReservations.length} expired reservation(s). Cleaning up and cancelling orders...`);

        for (const expRes of expiredReservations) {
            await prisma.$transaction(async (tx) => {
                await tx.inventoryReservation.update({
                    where: {
                        id: expRes.id,
                    },
                    data: {
                        status: "EXPIRED",
                    },
                });
                await tx.productInventory.update({
                    where: {
                        productId: expRes.productId,
                    },
                    data: {
                        reserved: {
                            decrement: expRes.reservedQty,
                        },
                    },
                });
            });

            // Emit event to Kafka so order-service cancels the order and marks inventoryStatus as FAILED
            try {
                const user = { id: expRes.createdBy };
                await emitReservationFailed(user, expRes.orderId);
                console.log(`[Reservation Cleanup] Order ${expRes.orderId} reservation expired. Emitted RESERVATION_FAILED event.`);
            } catch (kafkaError) {
                console.error(`[Reservation Cleanup] Failed to emit RESERVATION_FAILED event for order ${expRes.orderId}:`, kafkaError.message);
            }
        }
    } catch (error) {
        console.error("[Reservation Cleanup Job Error]:", error);
    }
};
