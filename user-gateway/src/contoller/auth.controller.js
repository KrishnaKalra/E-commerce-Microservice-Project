import axios from "axios";
import config from "../../config/index.js";

const AUTH_SERVICE_URL = config.AUTH_SERVICE;

const createUser = async (req, res) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/sign-up`, req.body);
        
        return res.status(response.status).json(response.data);

    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }

        console.error("[API Gateway] Error connecting to Auth Service (createUser):", error.message);
        return res.status(500).json({
            success: false,
            message: "API Gateway Error: Auth Service Unavailable",
        });
    }
};

const authUser = async (req, res) => {
    //console.log('hi')
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/log-in`, req.body);
        
        return res.status(response.status).json(response.data);

    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }

        console.error("[API Gateway] Error connecting to Auth Service (authUser):", error.message);
        return res.status(500).json({
            success: false,
            message: "API Gateway Error: Auth Service Unavailable",
        });
    }
};

export { createUser, authUser };