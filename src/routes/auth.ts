import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import authMiddleware from '../middleware/authMiddleware';
import validate from '../middleware/validate';
import { loginSchema, signupSchema } from '../validation/authValidation';

const authRouter = Router();

authRouter.get('/', authMiddleware, AuthController.getCurrentUser);
authRouter.post('/', validate(loginSchema), AuthController.login);
authRouter.post('/logout', AuthController.logout);
authRouter.post('/signup', validate(signupSchema), AuthController.signup);


export default authRouter;
