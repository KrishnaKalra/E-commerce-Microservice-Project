import env from 'dotenv';
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();

env.config();
const cleanUrl = (url) => url ? url.replace(/\/$/, '') : '';

const config={
    PORT:process.env.PORT||3000,
    JWT_PUBLIC_KEY:fs.readFileSync(path.join(ROOT_DIR, process.env.JWT_PUBLIC_KEY)),
    NODE_ENV:process.env.NODE_ENV||'dev',
    AUTH_SERVICE:cleanUrl(process.env.AUTH_SERVICE)||'',
    INVENTORY_SERVICE:cleanUrl(process.env.INVENTORY_SERVICE)||'',
    ORDER_SERVICE:cleanUrl(process.env.ORDER_SERVICE)||'',
    PRODUCT_SERVICE:cleanUrl(process.env.PRODUCT_SERVICE)||''
}

export default config;