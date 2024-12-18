import cors from "cors";
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';



export function corsMiddleware() {
    return cors({
        origin: process.env.WEBSITE_DOMAIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
    })
};


export const protectedRoutesMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await validateAuth(req);
            if (data?.userId) {
                req.headers['x-user-id'] = data.userId;
                next();
            } else {
                res.status(401).send('Unauthorized: Invalid session');
            }

        } catch (error) {
            console.error('Error validating session:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}



const validateAuth = async (req: Request): Promise<{ userId: string }> => {
    try {
        const nginxBaseUrl = process.env.NGINX_BASE_URL || 'http://nginx:8080';
        const response = await axios.get(`${nginxBaseUrl}/api/auth/validate`, {
            headers: {
                Cookie: req.headers.cookie, // Forwarding the original client cookies
            },
            withCredentials: true,
        });


        if (response.status === 200 && response.data?.userId) {
            return response.data;
        } else {
            throw new Error('Unauthorized: Invalid session');
        }
    } catch (error) {
        console.error('Error validating session:', error);
        throw new Error('Internal Server Error');
    }
};




