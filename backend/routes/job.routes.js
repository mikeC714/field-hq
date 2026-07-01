import express from 'express';
import { allJobData } from "../controllers/job.controllers.js";
import { verifyToken } from '../middleware/auth.middleware.js';


const jobRouter = express.Router();

jobRouter.use(verifyToken);
jobRouter.get("/quick-access", allJobData);

export default jobRouter;
