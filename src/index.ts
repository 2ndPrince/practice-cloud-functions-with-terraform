import { Request, Response } from 'express';

export const currentTime = (req: Request, res: Response): void => {
    const now = new Date().toISOString();
    res.status(200).json({ currentTime: now, message: "Hello YSLE" });
};
