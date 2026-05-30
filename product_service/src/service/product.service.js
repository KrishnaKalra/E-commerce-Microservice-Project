import prisma from "../../config/db/prisma.js";
import { emitProductCreated } from "../kafka/producer.js";

export const getProducts = async (page, limit) => {
    return await prisma.product.findMany({
        where: {
            deleted: false
        },
        skip: (page - 1) * limit,
        take: limit,
    });
};

export const findProduct = async (id) => {
    return await prisma.product.findUnique({
        where: {
            id,
            deleted: false
        },
    });
};

export const createProduct = async (user, data) => {
    const product = await prisma.product.create({ 
        data: {
            ...data,
            createdBy: user.id
        } 
    });
    
    await emitProductCreated(user, product);
    return product;
};

export const updateProduct = async (id, user, data) => {
    return await prisma.product.update({
        where: { 
            id,
            createdBy: user.id,
            deleted:false
        },
        data,
    });
};

export const deleteProduct = async (id, user) => {
    return await prisma.product.update({
        where: {
            id: id,
            createdBy: user.id,
            deleted:false
        },
        data: {
            deleted: true,
        },
    });
};