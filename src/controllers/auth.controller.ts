import { Request, Response, } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

 await db.execute(
  "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
  [name, email, hashedPassword, "user"]
);


  res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const [rows]: any = await db.execute(
    "SELECT id, email, password, role FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  res.json({ token });
};

export const getProfile = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

if (!authHeader) {
  return res.status(401).json({ message: "No authorization header" });
}

const token = authHeader.split(" ")[1];

if (!token) {
  return res.status(401).json({ message: "No token provided" });
}

const decoded = jwt.decode(token);
const userid=(decoded as any).id

const [rows]: any = await db.execute(
  "SELECT id, name, email, role FROM users WHERE id = ?",
  [userid]
);

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
