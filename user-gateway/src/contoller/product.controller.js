import axios from "axios";
import config from "../../config/index.js";

const PRODUCT_SERVICE_URL = config.PRODUCT_SERVICE;

const getAuthHeader = (req) => ({
    Authorization: req.headers.authorization
});

export const getProducts = async (req, res) => {
    try {
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/`, {
            params: req.query,
            headers: getAuthHeader(req)
        });
        
        return res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "API Gateway Error: Service Unavailable",
        });
    }
};

export const findProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/${id}`, {
            headers: getAuthHeader(req)
        });
        
        return res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "API Gateway Error: Service Unavailable",
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const response = await axios.post(`${PRODUCT_SERVICE_URL}/`, req.body, {
            headers: getAuthHeader(req)
        });
        
        return res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "API Gateway Error: Service Unavailable",
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const response = await axios({
            method: req.method,
            url: `${PRODUCT_SERVICE_URL}/${id}`,
            data: req.body,
            headers: getAuthHeader(req)
        });
        
        return res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "API Gateway Error: Service Unavailable",
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const response = await axios.delete(`${PRODUCT_SERVICE_URL}/${id}`, {
            headers: getAuthHeader(req)
        });
        
        return res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: "API Gateway Error: Service Unavailable",
        });
    }
};