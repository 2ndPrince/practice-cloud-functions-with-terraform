"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentTime = void 0;
const sampleUtil_1 = require("./util/sampleUtil");
const currentTime = (req, res) => {
    const now = new Date().toISOString();
    const numberFromUtil = (0, sampleUtil_1.calculateSomething)(1, 2);
    res.status(200).json({ currentTime: now, message: "Hello YSLE", fromUtil: numberFromUtil });
};
exports.currentTime = currentTime;
