import { z } from "zod";
import * as ProductService from "../service/product.service.js";

const productSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    price: z.coerce
        .number()
        .positive("Price must be positive")
        .max(1000000, "Price too Large."),
});

const getProducts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        
        let products = await ProductService.getProducts(page, limit);
        
        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error("Get Products Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

const findProduct = async (req, res) => {
    try {
        const id = req.params.id;
        
        let product = await ProductService.findProduct(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: `No product found with the given id ${id}`,
            });
        }
        
        return res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error("Find Products Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

const createProduct = async (req, res) => {
    const data = req.body;
    const user = req.user; 

    try {
        let validatedData = productSchema.parse(data);
        
        const product = await ProductService.createProduct(user, validatedData);
        
        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        if (error.name === "ZodError") {
            console.log("Zod Error :", error);
            return res.status(400).json({
                success: false,
                message: error.errors,
            });
        }
        console.log("Product Creation Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const updateProduct = async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const user = req.user; 
    
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Product Id not found",
        });
    }
    
    try {
        const schema = req.method === "PATCH" ? productSchema.partial() : productSchema;
        let validatedData = schema.parse(data);
        validatedData = {
            ...validatedData,
            updatedBy: user.id,
        };
        
        const product = await ProductService.updateProduct(id, user, validatedData);
        
        return res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        if (error.name === "ZodError") {
            console.log("Zod Error :", error);
            return res.status(400).json({
                success: false,
                message: error.errors,
            });
        }
        console.log("Product Updation Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const deleteProduct = async (req, res) => {
    const id = req.params.id;
    const user = req.user; 
    
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Product Id not found",
        });
    }
    
    try {
        const softDeletedData = await ProductService.deleteProduct(id, user);
        
        res.status(200).json({
            success: true,
            data: softDeletedData,
        });
    } catch (error) {
        console.log("Product Delete Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export {
    updateProduct,
    createProduct,
    findProduct,
    getProducts,
    deleteProduct,
};