import env from 'dotenv';
import fs from "fs";
import path from "path";

// Get project root
const ROOT_DIR = process.cwd();

env.config();
const config={
    PORT:process.env.PORT||3005,
    JWT_PRIVATE_KEY:fs.readFileSync(
    path.join(ROOT_DIR, process.env.JWT_PRIVATE_KEY),
    "utf8")||'my_jwt_secret',
    JWT_PUBLIC_KEY:fs.readFileSync(
    path.join(ROOT_DIR, process.env.JWT_PUBLIC_KEY),
    "utf8")||'my_public_secret',
    BCRYPT_SALT_ROUNDS:process.env.BCRYPT_SALT_ROUNDS||10,
    NODE_ENV:process.env.NODE_ENV||'dev',

}

export default config;