import Joi from 'joi';

export const createNoteSchema = Joi.object({
    data: Joi.string().required().min(1).max(1000)
});
