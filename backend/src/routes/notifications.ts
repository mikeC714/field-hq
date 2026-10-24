import express from 'express';
import { verifyToken } from "../middleware/auth.middleware.js";
import { allNotifications } from "../controllers/notifications.js";

const notiRouter = express.Router();

notiRouter.get('/notifications', verifyToken, allNotifications)

export default notiRouter;
