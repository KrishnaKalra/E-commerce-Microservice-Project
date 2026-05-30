import prisma from "../../config/db/prima.js";
import { emitUserCreated } from "../kafka/producer.js";

export const findFirstUserByEmail = async (email) => {
    return await prisma.user.findFirst({
        where: {
            email: email
        }
    });
};

export const findUniqueUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email,
        }
    });
};

export const createUser = async (name, email, hashedPassword) => {
    const data= await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });
    return data;
};