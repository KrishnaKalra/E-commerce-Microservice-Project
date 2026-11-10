import * as InventoryService from '../service/inventory.service.js';

export const getProductInventory = async (req, res) => {
    const { productId } = req.params;

    if (!productId) {
        return res.status(400).json({ status: "fail", message: "Product ID is required" });
    }

    try {
        const inventory = await InventoryService.getInventoryByProductId(productId);

        if (!inventory) {
            return res.status(404).json({ 
                status: "fail", 
                message: "Inventory not found for this product" 
            });
        }

        const availableStock = inventory.totalStock - inventory.reserved;

        return res.status(200).json({
            status: "success",
            data: {
                productId: inventory.productId,
                totalStock: inventory.totalStock,
                reserved: inventory.reserved,
                availableStock: availableStock 
            }
        });

    } catch (error) {
        console.error("Get Inventory Error:", error);
        res.status(500).json({ status: "fail", message: "Internal Server Error" });
    }
};

export const createProductInventory = async (req, res) => {
    const { productId } = req.body;
    const user = req.user; 

    if (!productId || !user) {
        return res.status(400).json({
            status: "fail",
            message: "Proper data not provided.",
        });
    }

    try {
        const inventory = await InventoryService.createInventory(productId, user);

        return res.status(201).json({
            status: "success",
            data: inventory,
        });

    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({
                status: "fail",
                message: "Inventory for this Product ID already exists.",
            });
        }
        
        console.error("Create Inventory Error:", error);
        res.status(500).json({
            status: "fail",
            message: "Internal Server Error",
        });
    }
};

export const updateProductInventory = async (req, res) => {
    const { addedStock } = req.body; 
    const productId = req.params.productId;
    const user = req.user;

    if (!productId || typeof addedStock !== 'number') {
        return res.status(400).json({
            status: "fail",
            message: "Proper data not provided.",
        });
    }

    try {
        const updatedInventory = await InventoryService.addInventoryStock(productId, user, addedStock);

        return res.status(200).json({
            status: "success",
            data: updatedInventory,
        });

    } catch (error) {
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({
                status: "fail",
                message: "You are not authorized to update inventory for this product.",
            });
        }
        if (error.message === "NOT_FOUND" || error.code === 'P2025') {
            return res.status(404).json({
                status: "fail",
                message: "Inventory record not found for this Product ID.",
            });
        }

        console.error("Update Inventory Error:", error);
        res.status(500).json({
            status: "fail",
            message: "Internal Server Error",
        });
    }
};

export const createReservation = async (req, res) => {
    const { productId, orderId, reservedQty } = req.body;
    const user = req.user;

    if (!productId || !orderId || !reservedQty || !user) {
        return res.status(400).json({ 
            status: "fail",
            message: "Proper data not provided",
        });
    }

    try {
        const result = await InventoryService.createInventoryReservation(
            productId, 
            orderId, 
            user, 
            reservedQty
        );

        res.status(200).json({
            status: "success",
            data: result,
        });
    } catch (error) {
        console.log("Create Reservation Error:", error);
        
        if (error.message === "Insufficient stock available!") {
            return res.status(400).json({ status: "fail", message: error.message });
        }

        res.status(500).json({
            status: "fail",
            message: "Internal Server Error",
        });
    }
};

export const updateReservationStatus = async (req, res) => {
    const { orderId, productId, status } = req.body;

    if (!orderId || !productId || !status) { 
        return res.status(400).json({ 
            status: "fail",
            message: "Proper data not provided",
        });
    }

    try {
        const result = await InventoryService.updateReservation(orderId, productId, status);

        res.status(200).json({
            status: "success",
            data: result,
        });
    } catch (error) {
        console.log("Update Reservation Status Error:", error);
        res.status(500).json({
            status: "fail",
            message: "Internal Server Error",
        });
    }
};