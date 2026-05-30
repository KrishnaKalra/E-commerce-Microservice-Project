import prisma from "../../config/db/prisma.js";

export const reservationCleanupJob = async () => {
    try {
        console.log('hi');
        const now = new Date();
        const expiredReservations = await prisma.inventoryReservation.findMany({
            where: {
                status: "PENDING",
                expiresAt: {
                    lt: now,
                },
            },
        });
        if (expiredReservations.length == 0) return;
        for (const expRes of expiredReservations) {
            const result = await prisma.$transaction(async (tx) => {
                const update = await tx.inventoryReservation.update({
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
        };
    } catch (error) {
        console.log("Job Error", error);
    }
};
