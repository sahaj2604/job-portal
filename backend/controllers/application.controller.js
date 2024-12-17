import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob=async (req,res) => {
    try {
        const userId=req.id;
        const jobId=req.params.id;
        if(!jobId){
            return res.status(400).json({
                message:"job id is required",
                success:false,
            })
        }
        const existingApplication=await Application.findOne({job:jobId,applicant:userId})
        if(existingApplication){
            return res.status(400).json({
                message:"you have already applied for this job"
            })
        }
        const job=await Job.findById(jobId)
        if(!job){
            return res.status(404).json({
                message:"job not found",
                success:false,
            })
        }
        const newApplication=await Application.create({
            job:jobId,
            applicant:userId,
        })

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"job application created successfuly",
            success:true
        })
    } catch (error) {
        console.log('error in applyJob handler',error);
    }
}

export const getAppliedJobs=async (req,res) => {
    try {
        const userId=req.id;
        const applications=await Application.find({applicant:userId}).sort({createdAt:-1})
        .populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!applications){
            return res.status(404).json({
                message:"no applications found",
                success:false,
            })
        }

        return res.status(200).json({
            applications,
            success:true,
        })
    } catch (error) {
        console.log('error in getAllJobs handler',error);
    }
}

//admin will check how many users have applied
export const getApplicants=async (req,res) => {
    try {
        const jobId=req.params.id;
        const job=await Job.findById(jobId)
        .populate({
            path:"applications",
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        }); 
        if(!job){
            return res.status(404).json({
                message:"job not found",
                success:false,
            })
        }
        return res.status(200).json({
            job,
            success:true,
        })
    } catch (error) {
        console.log('error in getApplicants',error);
    }
}

export const updateStatus=async (req,res) => {
    try {
        const applicationId=req.params.id;
        const {status}=req.body;
        if(!status){
            return res.status(400).json({
                message:"status is required",
                success:false,
            })
        }
        let application=await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"application not found",
                success:false,
            })
        }
        application.status=status.toLowerCase();
        await application.save();
        return res.status(200).json({
            message:"application updated successfuly",
            application,
            success:true,
        })
    } catch (error) {
        console.log('error in updateApplication handler',error);
    }
}