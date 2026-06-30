import dotenv from 'dotenv';
const envPath = new URL("./.env", import.meta.url).pathname;
dotenv.config({ path: envPath});
import express from 'express';
import authRouter from "./routes/auth.routes.js";
import customerRouter from './routes/customer.routes.js';
import quoteRouter from './routes/quote.route.js';
import jobRouter from './routes/job.routes.js';
import notiRouter  from './routes/notifications.routes.js';
import { AppError } from "./error/error.handler.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from "helmet";

const PORT = process.env.PORT
const app = express();



app.use(express.json())
app.use(cookieParser())
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))


app.use('/api', authRouter)
app.use('/api', customerRouter)
app.use('/api', quoteRouter)
app.use('/api', jobRouter)
app.use('/api', notiRouter)


app.use((req, res) => {
	res.redirect(302, `${process.env.FRONTEND_URL}/404`);
})
app.use((err, req, res, next) => {
	let status = 500;
	if(err instanceof AppError){
		return res.status(err.statusCode).json({ error: err.message })
	}
	return res.status(err.statusCode || status).json({ error: err.message })
})

app.listen(PORT, () => {
    console.log(`Server is running smooth on PORT: ${PORT}`)
})
