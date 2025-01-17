"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentTime = void 0;
const currentTime = (req, res) => {
    const now = new Date().toISOString();
    res.status(200).json({ currentTime: now, message: "Hello YSLE" });
};
exports.currentTime = currentTime;
