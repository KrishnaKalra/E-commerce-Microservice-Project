import { emitPaymentFailed, emitPaymentVerified } from "../kafka/producer.js";

const verifyPayment = async (user, orderId, paymentId) => {
    console.log('hi');
    await emitPaymentVerified(user, {
        orderId,
        paymentId
    });
    
    // await emitPaymentFailed(user, {
    //     orderId,
    //     paymentId
    // });
};

export { verifyPayment };