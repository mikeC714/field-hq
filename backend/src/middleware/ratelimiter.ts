import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
	message: { error: "Too many request, please try again later." },
	windowMs: 15 * 60 * 1000, 
	limit: 20,
	statusCode: 429,
	ipv6Subnet: 56,
	skipSuccessfulRequests: true,
});

const authLimiter = rateLimit({
	message: { error: "Too many request, please try again later." },
	windowMs: 15 * 60 * 1000, 
	limit: 3,
	statusCode: 429,
	ipv6Subnet: 56,
	skipSuccessfulRequests: true,
});


export { limiter, authLimiter }
