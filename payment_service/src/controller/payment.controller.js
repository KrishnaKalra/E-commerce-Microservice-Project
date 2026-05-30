import * as PaymentService from '../service/payement.service.js'

const verifyPayment = async (req, res) => {
    try {
        const { orderId, paymentId } = req.body;
        const user = req.user;

        if (!orderId || !paymentId || !user) {
            return res.status(400).json({
                status: "fail",
                message: "Proper data not provided",
            });
        }

        await PaymentService.verifyPayment(user, orderId, paymentId);

        return res.status(200).json({
            status: "success",
            data: {
                orderId,
                paymentId,
                status: "SUCCESS"
            }
        });

    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({
            status: "fail",
            message: "Internal server error",
        });
    }
};

export { verifyPayment };