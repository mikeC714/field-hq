import { Router } from 'express';
import { CustomerService } from "../service/customer.ts";
import { NotificationService } from "../service/notifications.ts";
import { NotificationController } from "../controllers/notifications.ts";
import { verifyToken } from "../auth/auth.middleware.js";


export function NotificationRoutes(notificationService:NotificationService, customerService:CustomerService){
	const router = Router();

	const controller = new NotificationController(notificationService, customerService);

	router.get('/notifications', verifyToken, controller.allNotifications)

	return router; 
};
