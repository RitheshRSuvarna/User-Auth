"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const register = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    await db_1.db.execute("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, "user"]);
    res.status(201).json({ message: "User registered successfully" });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const [rows] = await db_1.db.execute("SELECT id, email, password, role FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = rows[0];
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
};
exports.login = login;
const getProfile = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No authorization header" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jsonwebtoken_1.default.decode(token);
    const userid = decoded.id;
    const [rows] = await db_1.db.execute("SELECT id, name, email, role FROM users WHERE id = ?", [userid]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
        user: rows[0],
    });
    // const userId = decoded.id;
    // const [rows]:any = await db.query(
    //   "SELECT id, name, email FROM users WHERE id = ?",
    //   [userId]
};
exports.getProfile = getProfile;
