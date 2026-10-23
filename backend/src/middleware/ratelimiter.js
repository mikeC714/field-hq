import { rateLimit } from 'express-rate-limit';

export const authLimiter = rateLimit({
    message: { error: "Too many request, please try again later." },
    windowMs: 15 * 60 * 1000, 
    limit: 20,
	statusCode: 429,
    ipv6Subnet: 56,
    skipSuccessfulRequests: true,
})
