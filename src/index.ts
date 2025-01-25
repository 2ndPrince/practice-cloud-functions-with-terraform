import { Request, Response } from 'express';
import { calculateSomething } from "./util/sampleUtil";

export const currentTime = (req: Request, res: Response): void => {
    const now = new Date().toISOString();
    const numberFromUtil = calculateSomething(1, 2);
    res.status(200).json({ currentTime: now, message: "Hello YSLE", fromUtil: numberFromUtil });
};
