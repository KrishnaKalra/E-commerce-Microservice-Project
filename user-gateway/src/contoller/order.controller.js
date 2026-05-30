import axios from "axios";
import config from "../../config/index.js";

const ORDER_SERVICE_URL = config.ORDER_SERVICE;

const getAuthHeader = (req) => ({
    Authorization: req.headers.authorization
});

export const createOrder = async (req, res) => {
    try {
        const response = await axios.post(`${ORDER_SERVICE_URL}/`, req.body, {
            headers: getAuthHeader(req)
        });
        
        return res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        console.error(error.message);
        return res.status(500).json({ message: "API Gateway Error: Service Unavailable" });
    }
};

export const findOrders = async (req, res) => {
    try {
        const response = await axios.get(`${ORDER_SERVICE_URL}/`, {
            headers: getAuthHeader(req)
        });
        
        return res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        console.error(error.message);
        return res.status(500).json({ message: "API Gateway Error: Service Unavailable" });
    }
};

export const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        
        const response = await axios.get(`${ORDER_SERVICE_URL}/${id}`, {
            headers: getAuthHeader(req)
        });
        
        return res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        console.error(error.message);
        return res.status(500).json({ message: "API Gateway Error: Service Unavailable" });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        
        const response = await axios.patch(`${ORDER_SERVICE_URL}/${id}`, req.body, {
            headers: getAuthHeader(req)
        });
        
        return res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        console.error(error.message);
        return res.status(500).json({ message: "API Gateway Error: Service Unavailable" });
    }
};