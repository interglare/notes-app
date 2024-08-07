import { Response, NextFunction } from 'express';
import redisClient from '../redisClient';
import { AuthRequest } from './authMiddleware';
import { BasicResponse } from '../entities/basicResponse';

const rateLimitMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.userId.toString();
    const currentTime = Date.now();
    const oneMinute = 60_000;
    const key = `rate-limit:${userId}`;

    try {
        let timestamps = await redisClient.lRange(key, 0, -1);

        const validTimestamps = timestamps
            .map(ts => parseInt(ts))
            .filter(timestamp => currentTime - timestamp < oneMinute);

        if (validTimestamps.length >= 3) {
            return res.status(429).json(new BasicResponse(null, true, 'Too many requests', 429));
        }

        validTimestamps.push(currentTime);
        const validTimestampsAsString = validTimestamps.map(ts => ts.toString());
        await redisClient.multi()
            .del(key)
            .rPush(key, validTimestampsAsString)
            .expire(key, 60)
            .exec();

        next();
    } catch (error) {
        console.error('Rate limit error: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default rateLimitMiddleware;
