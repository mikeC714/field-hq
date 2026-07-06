import express from 'express';
import { allJobData } from "../controllers/job.controllers.js";
import { verifyToken } from '../middleware/auth.middleware.js';


const jobRouter = express.Router();

jobRouter.get("/quick-access", verifyToken, allJobData);

export default jobRouter;
