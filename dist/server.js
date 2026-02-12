"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./config/db");
const app_1 = __importDefault(require("./app"));
const PORT = 3000;
const startServer = async () => {
    await (0, db_1.connectDB)();
    app_1.default.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
startServer();
app_1.default.get("/", (req, res) => {
    res.send("Server is running ");
});
exports.default = app_1.default;
