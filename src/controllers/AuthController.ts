import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { BasicResponse } from '../entities/basicResponse';
import { AuthRequest } from '../middleware/authMiddleware';


class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    signup = async (req: Request, res: Response) => {
        const { email, password, name } = req.body;

        try {
            const result = await this.authService.signup(email, password, name);
            if (result.error || !result.data) {
                res.status(400).json(new BasicResponse(true, result.message, 400));
            } else {
                req.session.userId = result.data.id;
                res.status(201).json(new BasicResponse(result.data, false, 'User registered successfully', 201));
            }
        } catch (error) {
            res.status(500).json(new BasicResponse(true, 'User registration failed', 500));
        }
    };

    login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        try {
            const result = await this.authService.login(email, password);
            if (result.error || !result.data) {
                res.status(401).json(new BasicResponse(true, result.message, 401));
            } else {
                req.session.userId = result.data.id;
                res.status(200).json(new BasicResponse(result.data, false, 'Login successful', 200));
            }
        } catch (error) {
            res.status(500).json(new BasicResponse(true, 'Login failed', 500));
        }
    };

    logout = (req: Request, res: Response) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json(new BasicResponse(true, 'Logout failed', 500));
            }
            res.status(200).json(new BasicResponse(false, 'Logout successful', 200));
        });
    };

    getCurrentUser = (req: AuthRequest, res: Response) => {
        if (!req.session.userId) {
            return res.status(401).json(new BasicResponse(true, 'Unauthorized', 401));
        }

        res.status(200).json(new BasicResponse({ userId: req.session.userId, sessionId: req.sessionID }, false, 'Current user ID retrieved successfully', 200));
    };
}

export default new AuthController();
