import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      position,
      experience,
      companyId,
    } = req.body;
    const userId = req.id;
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !position ||
      !experience ||
      !companyId
    ) {
      return res.status(400).json({
        message: "provide all feilds",
        success: false,
      });
    }
    let job = await Job.findOne({ title });
    if (job) {
      return res.status(400).json({
        message: "job already exist",
        success: false,
      });
    }
    job = await Job.create({
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      position,
      experienceLevel: experience,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "new job created successfuly",
      job,
      success: true,
    });
  } catch (error) {
    console.log("error in postJob handler", error);
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
    .populate({
        path:"company",
    }).sort({createdAt:-1});
    if (!jobs) {
      return res.status(404).json({
        message: "no jobs found",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log("error in getAllJob handler", error);
  }
};

export const getJobById=async (req,res) => {
    try {
        const jobId=req.params.id;
        const job=await Job.findById(jobId).populate({path:"applications"});
        if (!job) {
            return res.status(404).json({
              message: "no job found",
              success: false,
            });
          }
          return res.status(200).json({
            job,
            success: true,
          });
    } catch (error) {
        console.log("error in getJobById handler", error);
    }
}

export const getAdminJobs=async (req,res) => {
    try {
        const adminId=req.id;
        const jobs=await Job.find({created_by:adminId})
        .populate({
            path:"company",
        })
        if (!jobs) {
            return res.status(404).json({
              message: "no jobs found",
              success: false,
            });
          }
          return res.status(200).json({
            jobs,
            success: true,
          });
    } catch (error) {
        console.log("error in getAdminJobs handler", error);
    }
}