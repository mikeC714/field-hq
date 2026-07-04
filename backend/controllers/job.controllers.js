import jobService from "../service/job.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../error/error.handler.js";

export const allJobData = catchAsync(async(req,res) => {
    const user = req.user;
    if(!user) throw new AppError("User not found.", 404);

	const [
        completedJobs,
        unpaidJobs,
        activeJobs,
        monthlyTotal 
    ] = await Promise.all([
        jobService.allCompletedJobs(user),
        jobService.allUnpaidJobs(user),
        jobService.allActiveJobs(user),
        jobService.getMonthlyTotal(user)
    ]);
      
	if(!completedJobs.length && !unpaidJobs.length && !activeJobs.length){
		return res.status(200).json({ 
			completedJobs: [],
			unpaidJobs: [],
			activeJobs: [],
			monthlyTotal
		})
	}

    return res.status(200).json({
        completedJobs,
        unpaidJobs,
        activeJobs,
        monthlyTotal
    });
});


