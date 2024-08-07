import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { BasicResponse } from '../entities/basicResponse';

const validate = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json(new BasicResponse(null, true, error.details[0].message, 400));
        }
        next();
    };
};

export default validate;
