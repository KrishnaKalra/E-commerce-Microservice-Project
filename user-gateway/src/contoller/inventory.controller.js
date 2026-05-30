import axios from "axios";
import config from "../../config/index.js";

const INVENTORY_SERVICE_URL = config.INVENTORY_SERVICE;

const getAuthHeader = (req) => ({
    Authorization: req.headers.authorization
});

export const getProductInventory = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const response = await axios.get(`${INVENTORY_SERVICE_URL}/${productId}`, {
            headers: getAuthHeader(req)
        });

        return res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        console.error(error.message);
        return res.status(500).json({ status: "fail", message: "API Gateway Error: Service Unavailable" });
    }
};

export const createProductInventory = async (req, res) => {
    try {
        const response = await axios.post(`${INVENTORY_SERVICE_URL}/`, req.body, {
            headers: getAuthHeader(req)
        });

        return res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        console.error(error.message);
        return res.status(500).json({ status: "fail", message: "API Gateway Error: Service Unavailable" });
    }
};

export const updateProductInventory = async (req, res) => {
    try {
        const { productId } = req.params;

        const response = await axios.patch(`${INVENTORY_SERVICE_URL}/${productId}/stock`, req.body, {
            headers: getAuthHeader(req)
        });

        return res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        console.error(error.message);
        return res.status(500).json({ status: "fail", message: "API Gateway Error: Service Unavailable" });
    }
};