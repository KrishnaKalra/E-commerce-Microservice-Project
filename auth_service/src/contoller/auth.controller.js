import bcrypt from "bcrypt";
import { generateToken } from "../jwt/jwt-auth.js";
import * as AuthService from "../service/auth.service.js";
import { emitUserCreated } from "../kafka/producer.js";

const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const existingUser = await AuthService.findFirstUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({
                message: "Email is already in use."
            });
        }

        const newUser = await AuthService.createUser(name, email, hashedPassword);
        console.log(newUser);
        
        let token = {
            user: {
                id: newUser.id, 
                email: newUser.email,
            }
        };
        token = generateToken(token);
        
        emitUserCreated({
                id: newUser.id,
                email: newUser.email,
            });
        return res.json({
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        
        const user = await AuthService.findUniqueUserByEmail(email);
        
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Incorrect email or password."
            });
            return;
        }
        
        const hashedPassword = user.password;
        const isCorrect = await bcrypt.compare(password, hashedPassword);
        
        if (isCorrect) {
            let token = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            token = generateToken(token);
            
            res.status(200).json({
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
            return;
        } else {
            res.status(401).json({
                success: false,
                message: 'Incorrect email or password.'
            });
            return;
        }
    } catch (error) {
        res.status(500).json({
            success: 'false',
            message: 'Internal Server Error.'
        });
    }
};

export { createUser, authUser };