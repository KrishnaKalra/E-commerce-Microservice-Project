import * as OrderService from '../service/order.service.js';

const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, amount,quantity,paymentId } = req.body;

        if (!productId || !amount) {
            return res.status(400).json({
                message: "productId and amount are required",
            });
        }

        const order = await OrderService.createOrder(req.user, productId, paymentId, amount, quantity);
        
        res.status(201).json(order);
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

const findOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const orders = await OrderService.findOrdersByUser(req.user);
        
        res.json(orders);
    } catch (error) {
        console.error("Find orders error:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await OrderService.getOrderByIdAndUser(req.user, id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        res.json(order);
    } catch (error) {
        console.error("Get order error:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Extract only the fields we want to allow updating
        const {
            status,
            paymentStatus,
            inventoryStatus,
            shipmentStatus,
            paymentId,
            quantity
        } = req.body;

        const updateData = {
            status,
            paymentStatus,
            inventoryStatus,
            shipmentStatus,
            paymentId,
            quantity
        };

        const order = await OrderService.updateOrderById(req.user,id, updateData);

        res.json(order);
    } catch (error) {
        console.error("Update order error:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

export { createOrder, findOrders, getOrder, updateOrder };