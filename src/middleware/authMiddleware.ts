import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
    userId?: number;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    req.userId = req.session?.userId;
    next();
};

export default authMiddleware;

