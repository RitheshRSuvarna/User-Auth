"use strict";
// import mysql from "mysql2/promise";
// import dotenv from "dotenv";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.db = void 0;
// dotenv.config();
// export const db=mysql.createPool({
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT),
//     user: process.env.DB_USER,
//     password:process.env.DB_PASSWORD,
//     database:process.env.DB_NAME,
// });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.db = promise_1.default.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
const connectDB = async () => {
    try {
        const connection = await exports.db.getConnection();
        console.log("MySQL connected successfully");
        connection.release();
    }
    catch (error) {
        console.error("MySQL connection failed:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
